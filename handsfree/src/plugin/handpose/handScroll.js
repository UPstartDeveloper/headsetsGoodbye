/**
 * Scrolls the page vertically by closing hand
 */
export default {
  models: 'handpose',
  tags: ['browser'],
  enabled: false,

  // Number of frames the current element is the same as the last
  numFramesFocused: 0,
  // The current scrollable target
  $target: null,

  // The original grab point
  origScrollTop: {
    x: 0,
    y: 0
  },

  // Number of frames that has passed since the last grab
  framesSinceLastGrab: 0,

  config: {
    // Number of frames over the same element before activating that element
    framesToFocus: 10,

    // Number of pixels the middle and thumb tips must be near each other to drag
    threshold: 60,

    // Number of frames where a hold is not registered before releasing a drag
    numThresholdErrorFrames: 5,

    vertScroll: {
      // The multiplier to scroll by. Lower numbers are slower
      scrollSpeed: 0.15,
      // How many pixels from the the edge to scroll
      scrollZone: 100
    }
  },

  onUse () {
    this.$target = window
  },

  /**
   * Scroll the page when the cursor goes above/below the threshold
   */
  onFrame (data) {
    // Detect if the threshold for clicking is met with specific morphs
    const a = data.annotations.middleFinger[3][0] - data.annotations.thumb[3][0]
    const b = data.annotations.middleFinger[3][1] - data.annotations.thumb[3][1]
    const c = Math.sqrt(a*a + b*b)
    this.thresholdMet = c < this.config.threshold

    // Set the original grab point
    if (this.thresholdMet) {
      if (this.framesSinceLastGrab > this.config.numThresholdErrorFrames) {
        this.checkForFocus(data)
        this.origScrollTop = this.getTargetScrollTop() + data.pointer.y
      }
      this.framesSinceLastGrab = 0
    }
    ++this.framesSinceLastGrab
    
    // Scroll
    if (this.framesSinceLastGrab < this.config.numThresholdErrorFrames) {
      this.$target.scrollTo(0, this.origScrollTop - data.pointer.y)
    }
  },

  /**
   * Gets the scrolltop, taking account the window object
   */
  getTargetScrollTop () {
    return this.$target.scrollY || this.$target.scrollTop || 0
  },

  /**
   * Checks to see if we've hovered over an element for x turns
   */
  checkForFocus (data) {
    let $potTarget = document.elementFromPoint(
      data.pointer.x,
      data.pointer.y
    )
    if (!$potTarget) return

    $potTarget = this.recursivelyFindScrollbar($potTarget)
    this.selectTarget($potTarget)
  },

  /**
   * Select and style the element
   */
  selectTarget ($potTarget) {
    // Check required in case the window is the target
    if (this.$target.classList) {
      this.$target.classList.remove('handsfree-scroll-focus')
    }
    if ($potTarget && $potTarget.classList) {
      $potTarget.classList.add('handsfree-scroll-focus')
    }

    if ($potTarget.nodeName === 'HTML' || !$potTarget.nodeName) {
      $potTarget = window
    }

    this.$target = $potTarget
  },

  /**
   * Traverses up the DOM until a scrollbar is found, or until we hit the body/window
   */
  recursivelyFindScrollbar($target) {
    const styles =
      $target && $target.getBoundingClientRect ? getComputedStyle($target) : {}

    if (
      $target &&
      $target.scrollHeight > $target.clientHeight &&
      (styles.overflow === 'auto' ||
        styles.overflow === 'auto scroll' ||
        styles.overflowY === 'auto' ||
        styles.overflowY === 'auto scroll')
    ) {
      return $target
    } else {
      if ($target && $target.parentElement) {
        return this.recursivelyFindScrollbar($target.parentElement)
      } else {
        return window
      }
    }
  }
}
