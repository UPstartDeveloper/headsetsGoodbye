/**
 * Click on things with a gesture
 */
export default {
  models: 'weboji',
  enabled: false,

  tags: ['browser'],

  config: {
    // How often in milliseconds to trigger clicks
    throttle: 50,

    // Max number of frames to keep down
    maxMouseDownedFrames: 1,

    // Morphs to watch for and their required confidences
    morphs: {
      0: 0.25,
      1: 0.25
    }
  },

  // Number of frames mouse has been downed
  mouseDowned: 0,
  // Is the mouse up?
  mouseUp: false,
  // Whether one of the morph confidences have been met
  thresholdMet: false,

  // The last held {x, y}, used to calculate move delta
  lastHeld: {x: 0, y: 0},
  // Original target under mousedown
  $origTarget: null,

  /**
   * Detect click state and trigger a real click event
   */
  onFrame ({weboji}) {
    // Detect if the threshold for clicking is met with specific morphs
    this.thresholdMet = false
    let event = ''
    Object.keys(this.config.morphs).forEach((key) => {
      const morph = +this.config.morphs[key]
      if (morph > 0 && weboji.morphs[key] >= morph) this.thresholdMet = true
    })

    // Click/release and add body classes
    if (this.thresholdMet) {
      this.mouseDowned++
      document.body.classList.add('handsfree-clicked')
    } else {
      this.mouseUp = this.mouseDowned
      this.mouseDowned = 0
      document.body.classList.remove('handsfree-clicked')
    }

    // Set the state
    if (
      this.mouseDowned > 0 &&
      this.mouseDowned <= this.config.maxMouseDownedFrames
    )
      event = weboji.pointer.state = 'mousedown'
    else if (this.mouseDowned > this.config.maxMouseDownedFrames)
      event = weboji.pointer.state = 'mousedrag'
    else if (this.mouseUp)
      event = weboji.pointer.state = 'mouseup'
    else
      event = 'mousemove'

    // Actually click something (or focus it)
    const $el = document.elementFromPoint(weboji.pointer.x, weboji.pointer.y)
    if ($el && event === 'mousedown') {
      this.$origTarget = $el
    }

    if ($el) {
      const eventOpts = {
        view: window,
        button: 0,
        bubbles: true,
        cancelable: true,
        clientX: weboji.pointer.x,
        clientY: weboji.pointer.y,
        // Only used when the mouse is captured in full screen mode
        movementX: weboji.pointer.x - this.lastHeld.x,
        movementY: weboji.pointer.y - this.lastHeld.y
      }
      
      $el.dispatchEvent(new MouseEvent(event, eventOpts))

      // Focus
      if (weboji.pointer.state === 'mousedown' && ['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes($el.nodeName))
        $el.focus()

      // Click
      if (weboji.pointer.state === 'mouseup' && $el === this.$origTarget) {
        $el.dispatchEvent(new MouseEvent('click', eventOpts))
      }

      weboji.pointer.$target = $el
    }

    this.lastHeld = weboji.pointer
  }
}
