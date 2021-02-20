import BaseGesture from './Base'

export default class GestureFingerpose extends BaseGesture {
  constructor (handsfree, config) {
    super(handsfree, config)
    this.algorithm = 'fingerpose'

    // Contains the fingerpose GestureDescription
    this.compiledDescription = null
  }
}