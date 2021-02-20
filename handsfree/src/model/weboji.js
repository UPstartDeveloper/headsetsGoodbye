import BaseModel from './base.js'

export default class WebojiModel extends BaseModel {
  constructor (handsfree, config) {
    super(handsfree, config)
    this.name = 'weboji'
  }

  loadDependencies (callback) {
    // Just load utils on client
    if (this.handsfree.config.isClient) {
      this.onReady(callback)
      return
    }

    // Load weboji
    this.loadDependency(`${this.handsfree.config.assetsPath}/jeeliz/jeelizFaceTransfer.js`, () => {
      const url = this.handsfree.config.assetsPath + '/jeeliz/jeelizFaceTransferNNC.json'
      this.api = window.JEEFACETRANSFERAPI

      fetch(url)
        .then(model => model.json())
        // Next, let's initialize the weboji tracker API
        .then(model => {
          this.api.init({
            canvasId: `handsfree-canvas-weboji-${this.handsfree.id}`,
            NNC: JSON.stringify(model),
            videoSettings: this.handsfree.config.weboji.videoSettings,
            callbackReady: () => this.onReady(callback)
          })
        })
        .catch((ev) => {
          console.log(ev)
          console.error(`Couldn't load weboji tracking model at ${url}`)
          this.handsfree.emit('modelError', ev)
        })
    })
  }

  onReady (callback) {
    this.dependenciesLoaded = true
    this.handsfree.emit('modelReady', this)
    this.handsfree.emit('webojiModelReady', this)
    document.body.classList.add('handsfree-model-weboji')
    callback && callback(this)
  }
  
  getData () {
    // Core
    this.data.rotation = this.api.get_rotationStabilized()
    this.data.translation = this.api.get_positionScale()
    this.data.morphs = this.api.get_morphTargetInfluencesStabilized()
    
    // Helpers
    this.data.state = this.getStates()
    this.data.degree = this.getDegrees()
    this.data.isDetected = this.api.is_detected()

    this.handsfree.data.weboji = this.data

    return this.data
  }

  /**
   * Helpers for getting degrees
   */
  getDegrees () {
    return [
      this.data.rotation[0] * 180 / Math.PI,
      this.data.rotation[1] * 180 / Math.PI,
      this.data.rotation[2] * 180 / Math.PI
    ]
  }
  
  /**
   * Sets some stateful helpers
   */
  getStates() {
    /**
     * Handles extra calculations for weboji morphs
     */
    const morphs = this.data.morphs
    const state = this.data.state || {}

    // Smiles
    state.smileRight =
      morphs[0] > this.handsfree.config.weboji.morphs.threshold.smileRight
    state.smileLeft =
      morphs[1] > this.handsfree.config.weboji.morphs.threshold.smileLeft
    state.smile = state.smileRight && state.smileLeft
    state.smirk =
      (state.smileRight && !state.smileLeft) ||
      (!state.smileRight && state.smileLeft)
    state.pursed =
      morphs[7] > this.handsfree.config.weboji.morphs.threshold.mouthRound

    // Eyebrows
    state.browLeftUp =
      morphs[4] > this.handsfree.config.weboji.morphs.threshold.browLeftUp
    state.browRightUp =
      morphs[5] > this.handsfree.config.weboji.morphs.threshold.browRightUp
    state.browsUp =
      morphs[4] > this.handsfree.config.weboji.morphs.threshold.browLeftUp &&
      morphs[5] > this.handsfree.config.weboji.morphs.threshold.browLeftUp

    state.browLeftDown =
      morphs[2] > this.handsfree.config.weboji.morphs.threshold.browLeftDown
    state.browRightDown =
      morphs[3] > this.handsfree.config.weboji.morphs.threshold.browRightDown
    state.browsDown =
      morphs[2] > this.handsfree.config.weboji.morphs.threshold.browLeftDown &&
      morphs[3] > this.handsfree.config.weboji.morphs.threshold.browLeftDown

    state.browsUpDown =
      (state.browLeftDown && state.browRightUp) ||
      (state.browRightDown && state.browLeftUp)

    // Eyes
    state.eyeLeftClosed =
      morphs[8] > this.handsfree.config.weboji.morphs.threshold.eyeLeftClosed
    state.eyeRightClosed =
      morphs[9] > this.handsfree.config.weboji.morphs.threshold.eyeRightClosed
    state.eyesClosed = state.eyeLeftClosed && state.eyeRightClosed

    // Mouth
    state.mouthClosed = morphs[6] === 0
    state.mouthOpen =
      morphs[6] > this.handsfree.config.weboji.morphs.threshold.mouthOpen

    return state
  }
}