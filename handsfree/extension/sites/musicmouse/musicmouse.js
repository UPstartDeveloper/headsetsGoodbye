/**
 * Orchestrate an intelligent gesture-controlled piano
 * @see https://teropa.info/musicmouse/
 * @see https://handsfree.js.org/ref/plugin/pinchers.html#pinch-states-with-pinchstate
 */
handsfree.enablePlugins('browser')
handsfree.update({
  hands: true,
  weboji: false
})

const $target = document.querySelector('app-pointer-surface')

/**
 * Use mousemove API
 */
handsfree.use('musicmouse', {
  // The higher this number the more you have to move to hit the next key
  moveFriction: 1.5,
  
  last: {
    x: 0,
    y: 0
  },
  
  onFrame ({hands}) {
    if (!hands.pointer) return

    // Apply movement
    if (hands.pinchState[1][0] === 'held' && hands.pointer[1].isVisible) {
      $target.dispatchEvent(new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        movementX: (hands.pointer[1].x - this.last.x) / this.moveFriction,
        movementY: (hands.pointer[1].y - this.last.y) / this.moveFriction
      }))
    }

    // Update movement deltas
    if (hands.pointer[1]?.isVisible) {
      this.last.x = hands.pointer[1].x
      this.last.y = hands.pointer[1].y
    }

    // Change Treatment
    if (hands.pinchState[0][0] === 'start') {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        view: window,
        bubbles: true,
        cancelable: true,
        altKey: true,
        code: 'Digit1'
      }))
    }
    if (hands.pinchState[0][1] === 'start') {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        view: window,
        bubbles: true,
        cancelable: true,
        altKey: true,
        code: 'Digit2'
      }))
    }
  }
})