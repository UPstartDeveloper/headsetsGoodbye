import BaseModel from './base.js'

export default class FacemeshModel extends BaseModel {
  constructor (handsfree, config) {
    super(handsfree, config)
    this.name = 'facemesh'
    this.isWarmedUp = false
  }

  loadDependencies (callback) {
    // Just load utils on client
    if (this.handsfree.config.isClient) {
      this.loadDependency(`${this.handsfree.config.assetsPath}/@mediapipe/drawing_utils.js`, () => {
        this.onWarmUp(callback)
      }, !!window.drawConnectors)

      return
    }
    
    // Load facemesh
    this.loadDependency(`${this.handsfree.config.assetsPath}/@mediapipe/face_mesh/face_mesh.js`, () => {
      // Configure model
      this.api = new window.FaceMesh({locateFile: file => {
        return `${this.handsfree.config.assetsPath}/@mediapipe/face_mesh/${file}`
      }})
      this.api.setOptions(this.handsfree.config.facemesh)
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
    document.body.classList.add('handsfree-model-facemesh')                    
    this.handsfree.emit('modelReady', this)
    this.handsfree.emit('facemeshModelReady', this)
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
    this.handsfree.data.facemesh = results
    if (this.handsfree.isDebugging) {
      this.debug(results)
    }
  }

  /**
   * Debugs the facemesh model
   */
  debug (results) {
    // Bail if drawing helpers haven't loaded
    if (typeof drawConnectors === 'undefined') return
    
    this.handsfree.debug.context.facemesh.clearRect(0, 0, this.handsfree.debug.$canvas.facemesh.width, this.handsfree.debug.$canvas.facemesh.height)

    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        drawConnectors(this.handsfree.debug.context.facemesh, landmarks, FACEMESH_TESSELATION, {color: '#C0C0C070', lineWidth: 1})
        drawConnectors(this.handsfree.debug.context.facemesh, landmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'})
        drawConnectors(this.handsfree.debug.context.facemesh, landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'})
        drawConnectors(this.handsfree.debug.context.facemesh, landmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'})
        drawConnectors(this.handsfree.debug.context.facemesh, landmarks, FACEMESH_LEFT_EYEBROW, {color: '#30FF30'})
        drawConnectors(this.handsfree.debug.context.facemesh, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'})
        drawConnectors(this.handsfree.debug.context.facemesh, landmarks, FACEMESH_LIPS, {color: '#E0E0E0'})
      }
    }
  }
}