/**
 * Scrolls the page vertically by closing hand
 */
export default {
  models: 'hands',
  tags: ['browser'],
  enabled: false,

  // Number of frames the current element is the same as the last
  numFramesFocused: [0, 0, 0, 0],
  // The current scrollable target
  $target: [null, null, null, null],

  // The original grab point
  origScrollLeft: [0, 0, 0, 0],
  origScrollTop: [0, 0, 0, 0],

  // The tweened scrollTop, used to smoothen out scroll
  tweenScroll: [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}],

  config: {
    // Number of frames over the same element before activating that element
    framesToFocus: 10,

    // Number of pixels the middle and thumb tips must be near each other to drag
    threshold: 50,

    // Number of frames where a hold is not registered before releasing a drag
    numThresholdErrorFrames: 5,

    // Speed multiplier
    speed: 1
  },

  /**
   * Scroll the page when the cursor goes above/below the threshold
   */
  onFrame ({hands}) {
    // Wait for other plugins to update
    setTimeout(() => {
      if (!hands.pointer) return
      const height = this.handsfree.debug.$canvas.hands.height
      const width = this.handsfree.debug.$canvas.hands.width

      hands.pointer.forEach((pointer, n) => {
        // @fixme Get rid of n > origPinch.length
        if (!pointer.isVisible || n > hands.origPinch.length) return

        // Start scroll
        if (hands.pinchState[n]?.[0] === 'start') {
          let $potTarget = document.elementFromPoint(pointer.x, pointer.y)

          this.$target[n] = this.getTarget($potTarget)
          this.tweenScroll[n].x = this.origScrollLeft[n] = this.getTargetScrollLeft(this.$target[n])
          this.tweenScroll[n].y = this.origScrollTop[n] = this.getTargetScrollTop(this.$target[n])
          this.handsfree.TweenMax.killTweensOf(this.tweenScroll[n])
        }

        if (hands.pinchState[n]?.[0] === 'held' && this.$target[n]) {
          // With this one you have to pinch, drag, and release in sections each time
          // this.handsfree.TweenMax.to(this.tweenScroll[n], 1, {
          //   x: this.origScrollLeft[n] - (hands.origPinch[n][0].x - hands.curPinch[n][0].x) * width,
          //   y: this.origScrollTop[n] + (hands.origPinch[n][0].y - hands.curPinch[n][0].y) * height,
          //   overwrite: true,
          //   ease: 'linear.easeNone',
          //   immediateRender: true  
          // })

          // With this one it continuously moves based on the pinch drag distance
          this.handsfree.TweenMax.to(this.tweenScroll[n], 1, {
            x: this.tweenScroll[n].x - (hands.origPinch[n][0].x - hands.curPinch[n][0].x) * width * this.config.speed,
            y: this.tweenScroll[n].y + (hands.origPinch[n][0].y - hands.curPinch[n][0].y) * height * this.config.speed,
            overwrite: true,
            ease: 'linear.easeNone',
            immediateRender: true  
          })

          this.$target[n].scrollTo(this.tweenScroll[n].x, this.tweenScroll[n].y)
        }
      })
    })
  },

  /**
   * Finds the closest scroll area
   */
  getTarget ($potTarget) {
    const styles = $potTarget && $potTarget.getBoundingClientRect ? getComputedStyle($potTarget) : {}

    if ($potTarget && $potTarget.scrollHeight > $potTarget.clientHeight &&
      (styles.overflow === 'auto' ||
        styles.overflow === 'auto scroll' ||
        styles.overflowY === 'auto' ||
        styles.overflowY === 'auto scroll')
    ) {
      return $potTarget
    } else {
      if ($potTarget && $potTarget.parentElement) {
        return this.getTarget($potTarget.parentElement)
      } else {
        return window
      }
    }
  },

  /**
   * Gets the scrolltop, taking account the window object
   */
  getTargetScrollLeft ($target) {
    return $target.scrollX || $target.scrollLeft || 0
  },

  /**
   * Gets the scrolltop, taking account the window object
   */
  getTargetScrollTop ($target) {
    return $target.scrollY || $target.scrollTop || 0
  }
}
