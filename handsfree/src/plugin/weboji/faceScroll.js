import throttle from 'lodash/throttle'

/**
 * Scrolls the page vertically
 */
export default {
  models: 'weboji',
  enabled: false,

  tags: ['browser'],

  // Number of frames the current element is the same as the last
  numFramesFocused: 0,
  // The last scrollable target focused
  $lastTarget: null,
  // The current scrollable target
  $target: null,

  config: {
    // Number of frames over the same element before activating that element
    framesToFocus: 10,

    vertScroll: {
      // The multiplier to scroll by. Lower numbers are slower
      scrollSpeed: 0.05,
      // How many pixels from the top/bottom of the scroll area to scroll
      scrollZone: 100
    }
  },

  onUse () {
    this.$target = window
  },

  /**
   * Scroll the page when the cursor goes above/below the threshold
   */
  onFrame ({weboji}) {
    // @FIXME we shouldn't need to do this, but this is occasionally reset to {x: 0, y: 0} when running in client mode
    if (!weboji.pointer.x && !weboji.pointer.y) return

    // Check for hover
    this.checkForFocus(weboji)
    let isScrolling = false

    // Get bounds
    let bounds
    let scrollTop = this.getTargetScrollTop()

    if (this.$target.getBoundingClientRect) {
      bounds = this.$target.getBoundingClientRect()
    } else {
      bounds = { top: 0, bottom: window.innerHeight }
    }

    // Check on click
    if (weboji.pointer.state === 'mouseDown') {
      this.numFramesFocused = 0
      this.maybeSetTarget(weboji)
    }

    // Scroll up
    if (weboji.pointer.y < bounds.top + this.config.vertScroll.scrollZone) {
      this.$target.scrollTo(
        0,
        scrollTop +
          (weboji.pointer.y - bounds.top - this.config.vertScroll.scrollZone) *
            this.config.vertScroll.scrollSpeed
      )

      isScrolling = true
    }

    // Scroll down
    if (weboji.pointer.y > bounds.bottom - this.config.vertScroll.scrollZone) {
      this.$target.scrollTo(
        0,
        scrollTop -
          (bounds.bottom -
            weboji.pointer.y -
            this.config.vertScroll.scrollZone) *
            this.config.vertScroll.scrollSpeed
      )

      isScrolling = true
    }

    isScrolling && this.maybeSelectNewTarget()
  },

  /**
   * Check that the scroll is actually happening, otherwise traverse up the DOM
   */
  maybeSelectNewTarget() {
    let curScrollTop = this.getTargetScrollTop()
    let didNotScroll = false

    // Check if we have scrolled up
    this.$target.scrollTo(0, curScrollTop + this.config.vertScroll.scrollSpeed)
    if (curScrollTop === this.getTargetScrollTop()) {
      didNotScroll = true
    } else {
      this.$target.scrollTo(0, curScrollTop - this.config.vertScroll.scrollSpeed)
      return
    }

    // Check if we have scrolled down
    this.$target.scrollTo(0, curScrollTop - this.config.vertScroll.scrollSpeed)
    if (curScrollTop === this.getTargetScrollTop()) {
      if (didNotScroll) {
        this.numFramesFocused = 0

        this.selectTarget(
          this.recursivelyFindScrollbar(this.$target.parentElement)
        )
      }
    } else {
      this.$target.scrollTo(0, curScrollTop + this.config.vertScroll.scrollSpeed)
      return
    }
  },

  /**
   * Gets the scrolltop, taking account the window object
   */
  getTargetScrollTop() {
    return this.$target?.scrollY || this.$target?.scrollTop || 0
  },

  /**
   * Checks to see if we've hovered over an element for x turns
   */
  checkForFocus: throttle(function(weboji) {
    let $potTarget = document.elementFromPoint(
      weboji.pointer.x,
      weboji.pointer.y
    )
    if (!$potTarget) return
    $potTarget = this.recursivelyFindScrollbar($potTarget)

    if ($potTarget === this.$lastTarget) {
      ++this.numFramesFocused
    } else {
      this.numFramesFocused = 0
    }

    if (this.numFramesFocused > this.config.framesToFocus) {
      this.selectTarget($potTarget)
    }

    this.$lastTarget = $potTarget
  }, 100),

  /**
   * Select and style the element
   */
  selectTarget($potTarget) {
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
   * Sets a new scroll target on click
   */
  maybeSetTarget(weboji) {
    if (weboji.pointer.state === 'mouseDown' && weboji.pointer.$target) {
      this.selectTarget(this.recursivelyFindScrollbar(weboji.pointer.$target))
    }
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
