import BaseModel from './base.js'
import fingerpose from 'fingerpose'

export default class HandsModel extends BaseModel {
  constructor (handsfree, config) {
    super(handsfree, config)
    this.name = 'hands'

    this.palmPoints = [0, 5, 9, 13, 17]
    this.gestureEstimator = new fingerpose.GestureEstimator([])
  }

  loadDependencies (callback) {
    // Just load utils on client
    if (this.handsfree.config.isClient) {
      this.loadDependency(`${this.handsfree.config.assetsPath}/@mediapipe/drawing_utils.js`, () => {
        this.onWarmUp(callback)
      }, !!window.drawConnectors)

      return
    }

    // Load hands
    this.loadDependency(`${this.handsfree.config.assetsPath}/@mediapipe/hands/hands.js`, () => {
      // Configure model
      this.api = new window.Hands({locateFile: file => {
        return `${this.handsfree.config.assetsPath}/@mediapipe/hands/${file}`
      }})
      this.api.setOptions(this.handsfree.config.hands)
      this.api.onResults(results => this.dataReceived(results))

      // Load the media stream
      this.handsfree.getUserMedia(() => {
        // Warm up before using in loop
        if (!this.handsfree.mediapipeWarmups.isWarmingUp) {
          this.warmUp(callback)
        } else {
          this.handsfree.on('mediapipeWarmedUp', () => {
            if (!this.handsfree.mediapipeWarmups.isWarmingUp && !this.handsfree.mediapipeWarmups[this.name]) {
              this.warmUp(callback)
            }
          })
        }
      })

      // Load the hands camera module
      this.loadDependency(`${this.handsfree.config.assetsPath}/@mediapipe/drawing_utils.js`, null, !!window.drawConnectors)
    })
  }

  /**
   * Warms up the model
   */
  warmUp (callback) {
    this.handsfree.mediapipeWarmups[this.name] = true
    this.handsfree.mediapipeWarmups.isWarmingUp = true
    this.api.send({image: this.handsfree.debug.$video}).then(() => {
      this.handsfree.mediapipeWarmups.isWarmingUp = false
        this.onWarmUp(callback)
    })
  }

  /**
   * Called after the model has been warmed up
   * - If we don't do this there will be too many initial hits and cause an error
   */
  onWarmUp (callback) {
    this.dependenciesLoaded = true
    document.body.classList.add('handsfree-model-hands')                    
    this.handsfree.emit('modelReady', this)
    this.handsfree.emit('handsModelReady', this)
    this.handsfree.emit('mediapipeWarmedUp', this)
    callback && callback(this)
  }

  /**
   * Get data
   */
  async getData () {
    this.dependenciesLoaded && await this.api.send({image: this.handsfree.debug.$video})
    return this.data
  }
  // Called through this.api.onResults
  dataReceived (results) {
    // Get center of palm
    if (results.multiHandLandmarks) {
      results = this.getCenterOfPalm(results)
    }

    // Force handedness
    results = this.forceHandedness(results)

    // Update and debug
    this.data = results
    this.handsfree.data.hands = results
    if (this.handsfree.isDebugging) {
      this.debug(results)
    }
  }

  /**
   * Forces the hands to always be in the same index
   */
  forceHandedness (results) {
    // Empty landmarks
    results.landmarks = [[], [], [], []]
    results.landmarksVisible = [false, false, false, false]
    if (!results.multiHandLandmarks) {
      return results
    }

    // Store landmarks in the correct index
    results.multiHandLandmarks.forEach((landmarks, n) => {
      let hand
      if (n < 2) {
        hand = results.multiHandedness[n].label === 'Right' ? 0 : 1
      } else {
        hand = results.multiHandedness[n].label === 'Right' ? 2 : 3
      }

      results.landmarks[hand] = landmarks
      results.landmarksVisible[hand] = true
    })

    return results
  }

  /**
   * Calculates the center of the palm
   */
  getCenterOfPalm (results) {
    results.multiHandLandmarks.forEach((hand, n) => {
      let x = 0
      let y = 0
      
      this.palmPoints.forEach(i => {
        x += hand[i].x
        y += hand[i].y
      })

      x /= this.palmPoints.length
      y /= this.palmPoints.length
      
      results.multiHandLandmarks[n][21] = {x, y}
    })
    
    return results
  }

  /**
   * Debugs the hands model
   */
  debug (results) {
    // Bail if drawing helpers haven't loaded
    if (typeof drawConnectors === 'undefined') return
    
    // Clear the canvas
    this.handsfree.debug.context.hands.clearRect(0, 0, this.handsfree.debug.$canvas.hands.width, this.handsfree.debug.$canvas.hands.height)
    
    // Draw skeletons
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(this.handsfree.debug.context.hands, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5})
        drawLandmarks(this.handsfree.debug.context.hands, landmarks, {color: '#FF0000', lineWidth: 2})
      }
    }
  }

  /**
   * Updates the gesture estimator
   */
  updateGestureEstimator () {
    const activeGestures = []
    const gestureDescriptions = []
    
    // Build the gesture descriptions
    this.gestures.forEach(name => {
      if (!this.handsfree.gesture[name].enabled) return
      activeGestures.push(name)
      
      // Loop through the description and compile it
      if (!this.handsfree.gesture[name].compiledDescription && this.handsfree.gesture[name].enabled) {
        const description = new fingerpose.GestureDescription(name)

        this.handsfree.gesture[name].description.forEach(pose => {
          // Build the description
          switch (pose[0]) {
            case 'addCurl':
              description[pose[0]](
                fingerpose.Finger[pose[1]],
                fingerpose.FingerCurl[pose[2]],
                pose[3]
              )
            break
            case 'addDirection':
              description[pose[0]](
                fingerpose.Finger[pose[1]],
                fingerpose.FingerDirection[pose[2]],
                pose[3]
              )
            break
            case 'setWeight':
              description[pose[0]](
                fingerpose.Finger[pose[1]],
                pose[2]
              )
            break
          }
        })

        this.handsfree.gesture[name].compiledDescription = description
      }
    })

    // Create the gesture estimator
    activeGestures.forEach(gesture => {
      gestureDescriptions.push(this.handsfree.gesture[gesture].compiledDescription)
    })

    if (activeGestures.length) {
      this.gestureEstimator = new fingerpose.GestureEstimator(gestureDescriptions)
    }
  }
  
  /**
   * Gets current gesture
   */
  getGesture () {
    let gestures = [null, null, null, null]

    this.data.landmarks.forEach((landmarksObj, hand) => {
      if (this.data.landmarksVisible[hand]) {
        // Convert object to array
        const landmarks = []
        for (let i = 0; i < 21; i++) {
          landmarks.push([landmarksObj[i].x * window.outerWidth, landmarksObj[i].y * window.outerHeight, 0])
        }
        
        // Estimate
        const estimate = this.gestureEstimator.estimate(landmarks, 7.5)
        if (estimate.gestures.length) {
          gestures[hand] = estimate.gestures.reduce((p, c) => {
            const requiredConfidence = this.handsfree.gesture[c.name].confidence
            return (c.confidence >= requiredConfidence && c.confidence > p.confidence) ? c : p
          })
        } else {
          gestures[hand] = {
            name: '',
            confidence: 0
          }
        }

        // Must pass confidence
        if (gestures[hand].name) {
          const requiredConfidence = this.handsfree.gesture[gestures[hand].name].confidence
          if (gestures[hand].confidence < requiredConfidence) {
            gestures[hand] = {
              name: '',
              confidence: 0
            }
          }
        }

        gestures[hand].pose = estimate.poseData
      }
    })

    return gestures
  }  
}