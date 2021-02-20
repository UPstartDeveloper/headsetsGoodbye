import merge from 'lodash/merge'

/**
 * The base gesture class
 * - When you do `handsfree.useGesture()` it actually extends this class
 */
export default class BaseGesture {
  constructor (gesture, handsfree) {
    // Props
    this.handsfree = handsfree

    // Copy properties and methods from plugin into class
    Object.keys(gesture).forEach((prop) => {
      this[prop] = gesture[prop]
    })

    // handsfree.config.gesture[name] overwrites gesture.config
    let handsfreeGestureConfig = handsfree.config?.gesture?.[gesture.name]
    if (typeof handsfreeGestureConfig === 'boolean') {
      handsfreeGestureConfig = { enabled: handsfreeGestureConfig }
    }

    // Disable gestures via new Handsfree(config)
    if (typeof handsfreeGestureConfig === 'object') {
      merge(this.config, handsfreeGestureConfig)
      if (typeof handsfreeGestureConfig.enabled === 'boolean') {
        this.enabled = handsfreeGestureConfig.enabled
      }
    }
  }

  /**
   * Toggle gesture
   */
  enable () {
    this.enabled = true
    this.updateGestureEstimator()
  }
  disable () {
    this.enabled = false
    this.updateGestureEstimator()
  }

  /**
   * Update the estimator when a gesture is toggled
   */
  updateGestureEstimator () {
    this.models.forEach(name => {
      this.handsfree.model[name].updateGestureEstimator()
    })
  }
}