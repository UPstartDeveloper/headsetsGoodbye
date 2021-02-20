export default {
  models: 'handpose',
  enabled: false,

  tags: ['browser'],
  
  // The pointer element
  $pointer: null,

  // Pointers position
  pointer: { x: 0, y: 0 },

  // Used to smoothen out the pointer
  tween: {
    x: 0,
    y: 0,
    positionList: []
  },

  config: {
    offset: {
      x: 0,
      y: 0,
      // A little nudge for when camera is above screen
      pitch: -15,
      yaw: -12,
      roll: 0
    },

    speed: {
      x: 1,
      y: 1
    }
  },

  onEnable () {
    if (!this.$pointer) {
      const $pointer = document.createElement('div')
      $pointer.classList.add('handsfree-pointer', 'handsfree-pointer-finger', 'handsfree-hide-when-started-without-handpose')
      document.body.appendChild($pointer)
      this.$pointer = $pointer
    }

    this.pointer = { x: 0, y: 0 }
    this.$pointer?.classList.remove('handsfree-hidden')
  },

  onFrame (data) {
    this.handsfree.handpose.updateMeshes(data)
    this.handsfree.handpose.three.renderer.render(this.handsfree.handpose.three.scene, this.handsfree.handpose.three.camera)

    this.handsfree.handpose.three.raycaster.set(this.handsfree.handpose.three.arrow.position, this.handsfree.handpose.three.arrow.direction.normalize())
    const hits = this.handsfree.handpose.three.raycaster.intersectObject(this.handsfree.handpose.three.screen, true)

    if (hits && hits.length) {
      this.handsfree.TweenMax.to(this.tween, 1, {
        x: window.outerWidth - this.handsfree.normalize(this.handsfree.handpose.three.renderer.domElement.width - (hits[0].point.x + this.handsfree.handpose.three.renderer.domElement.width / 2), this.handsfree.handpose.three.renderer.domElement.width) * window.outerWidth,
        y: this.handsfree.normalize(hits[0].point.y + this.handsfree.handpose.three.renderer.domElement.height / 2, this.handsfree.handpose.three.renderer.domElement.height) * window.outerHeight, 
        overwrite: true,
        ease: 'linear.easeNone',
        immediate: true
      })
    }

    this.$pointer.style.left = `${this.tween.x}px`
    this.$pointer.style.top = `${this.tween.y}px`
    
    data.pointer = {
      x: this.tween.x,
      y: this.tween.y
    }
  },

  /**
   * Toggle pointer
   */
  onDisable() {
    this.$pointer?.classList.add('handsfree-hidden')
  }
}
