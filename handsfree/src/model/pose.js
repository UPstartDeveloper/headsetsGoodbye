import BaseModel from './base.js'

export default class PoseModel extends BaseModel {
  constructor (handsfree, config) {
    super(handsfree, config)
    this.name = 'pose'

    // Without this the loading event will happen before the first frame
    this.hasLoadedAndRun = false

    this.palmPoints = [0, 1, 2, 5, 9, 13, 17]
  }

  loadDependencies (callback) {
    // Just load utils on client
    if (this.handsfree.config.isClient) {
      this.loadDependency(`${this.handsfree.config.assetsPath}/@mediapipe/drawing_utils.js`, () => {
        this.onWarmUp(callback)
      }, !!window.drawConnectors)

      return
    }

    // Load pose
    this.loadDependency(`${this.handsfree.config.assetsPath}/@mediapipe/pose/pose.js`, () => {
      this.api = new window.Pose({locateFile: file => {
        return `${this.handsfree.config.assetsPath}/@mediapipe/pose/${file}`
      }})
      this.api.setOptions(this.handsfree.config.pose)
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
    document.body.classList.add('handsfree-model-pose')                    
    this.handsfree.emit('modelReady', this)
    this.handsfree.emit('poseModelReady', this)
    this.handsfree.emit('mediapipeWarmedUp', this)
    callback && callback(this)
  }
  
  /**
   * Get data
   */
  async getData () {
    this.dependenciesLoaded && await this.api.send({image: this.handsfree.debug.$video})
  }
  // Called through this.api.onResults
  dataReceived (results) {
    this.data = results
    this.handsfree.data.pose = results
    if (this.handsfree.isDebugging) {
      this.debug(results)
    }
  }


  /**
   * Debugs the pose model
   */
  debug (results) {
    this.handsfree.debug.context.pose.clearRect(0, 0, this.handsfree.debug.$canvas.pose.width, this.handsfree.debug.$canvas.pose.height)

    if (results.poseLandmarks) {
      drawConnectors(this.handsfree.debug.context.pose, results.poseLandmarks, POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 4})
      drawLandmarks(this.handsfree.debug.context.pose, results.poseLandmarks, {color: '#FF0000', lineWidth: 2})
    }
  }
}