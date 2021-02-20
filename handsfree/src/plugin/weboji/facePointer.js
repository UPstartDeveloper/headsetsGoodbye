export default {
  models: 'weboji',
  enabled: false,

  tags: ['browser'],

  // The pointer element
  $pointer: null,

  // Pointers position
  pointer: { x: -20, y: -20 },

  // Used to smoothen out the pointer
  tween: {
    x: 0,
    y: 0,
    positionList: []
  },

  config: {
    // Used to offset the pointer, like when the webcam is not in front of you
    offset: {
      // Nudge the pointer by this amount
      x: 0,
      y: 0,
      // Calibrate the head (in degrees)
      pitch: 10,
      yaw: 0,
      roll: 0
    },

    // Sets how senstive the pointer is
    speed: {
      x: 1,
      y: 1
    }
  },

  onEnable () {
    if (!this.$pointer) {
      const $pointer = document.createElement('div')
      $pointer.classList.add('handsfree-pointer', 'handsfree-pointer-face', 'handsfree-hide-when-started-without-weboji')
      document.body.appendChild($pointer)
      this.$pointer = $pointer
    }

    this.$pointer?.classList.remove('handsfree-hidden')
  },

  onFrame ({weboji}) {
    // Get X/Y as if looking straight aweboji
    let x = weboji.translation[0] * window.outerWidth
    let y = window.outerHeight - weboji.translation[1] * window.outerHeight
    let z = (1 - weboji.translation[2]) * window.outerWidth * 2.5

    // Add pitch/yaw
    x +=
      z *
      Math.tan(weboji.rotation[1] + (this.config.offset.yaw * Math.PI) / 180) *
      this.config.speed.x

    y +=
      z *
        Math.tan(
          weboji.rotation[0] + (this.config.offset.pitch * Math.PI) / 180
        ) *
        this.config.speed.y -
      window.outerHeight

    // Add offsets
    x += this.config.offset.x
    y += this.config.offset.y

    // @todo Make the sensitivity variable
    this.handsfree.TweenMax.to(this.tween, 1, {
      x,
      y,
      overwrite: true,
      ease: 'linear.easeNone',
      immediateRender: true
    })

    this.$pointer.style.left = `${this.tween.x}px`
    this.$pointer.style.top = `${this.tween.y}px`
    weboji.pointer = {
      x: this.tween.x,
      y: this.tween.y
    }
  },

  /**
   * Toggle pointer
   */
  onDisable () {
    this.$pointer?.classList.add('handsfree-hidden')
  }
}
