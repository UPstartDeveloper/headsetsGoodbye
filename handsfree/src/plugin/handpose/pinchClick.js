/**
 * Click on things with a pinch gesture
 */
export default {
  models: 'handpose',
  enabled: false,

  tags: ['browser'],

  config: {
    // How often in milliseconds to trigger clicks
    throttle: 50,

    // Max number of frames to keep down
    maxMouseDownedFrames: 1,

    // Number of pixels that the finger/thumb tips must be within to trigger a click
    pinchDistance: 40
  },

  // Number of frames mouse has been downed
  mouseDowned: 0,
  // Is the mouse up?
  mouseUp: false,
  // Whether one of the morph confidences have been met
  thresholdMet: false,

  onUse() {
    this.throttle(this.config.throttle)
  },

  /**
   * Maps .maybeClick to a new throttled function
   */
  throttle (throttle) {
    this.maybeClick = this.handsfree.throttle(
      function (data) {
        this.click(data)
      },
      throttle,
      { trailing: false }
    )
  },

  /**
   * Detect click state and trigger a real click event
   */
  onFrame (data) {
    // Detect if the threshold for clicking is met with specific morphs
    const a = data.annotations.indexFinger[3][0] - data.annotations.thumb[3][0]
    const b = data.annotations.indexFinger[3][1] - data.annotations.thumb[3][1]
    const c = Math.sqrt(a*a + b*b)
    this.thresholdMet = c < this.config.pinchDistance

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
    if (this.mouseDowned > 0 && this.mouseDowned <= this.config.maxMouseDownedFrames)
      data.pointer.state = 'mouseDown'
    else if (this.mouseDowned > this.config.maxMouseDownedFrames)
      data.pointer.state = 'mouseDrag'
    else if (this.mouseUp) data.pointer.state = 'mouseUp'
    else ''

    // Actually click something (or focus it)
    if (data.pointer.state === 'mouseDown') {
      this.maybeClick(data)
    }
  },

  /**
   * The actual click method, this is what gets throttled
   */
  click(data) {
    const $el = document.elementFromPoint(data.pointer.x, data.pointer.y)
    if ($el) {
      $el.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          clientX: data.pointer.x,
          clientY: data.pointer.y
        })
      )

      // Focus
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes($el.nodeName))
        $el.focus()

      data.pointer.$target = $el
    }
  },

  /**
   * Throttles the click event
   * - Defined in onuse
   */
  maybeClick: function() {}
}
