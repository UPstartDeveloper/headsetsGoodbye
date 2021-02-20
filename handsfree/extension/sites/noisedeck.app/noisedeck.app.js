/**
 * Setup Handsfree.js
 */
handsfree.enablePlugins('browser')
handsfree.update({
  hands: true,
  weboji: false
})

/**
 * Clamp a number within the values of a scroller
 */
function normalize (num, $el) {
  return num <= $el.min ? $el.min : num >= $el.max ? $el.max : num
}

const $ = {
  // Right index
  hueRotation2: {
    el: document.querySelector('#hueRotation2'),
    start: 0
  },
  hueRange2: {
    el: document.querySelector('#hueRange2'),
    start: 0
  },

  // Right middle
  loopAmp2: {
    el: document.querySelector('#loopAmp2'),
    start: 0
  },
  loopFreq2: {
    el: document.querySelector('#loopFreq2'),
    start: 0
  },

  // Left index
  brightness: {
    el: document.querySelector('#brightness'),
    start: 0
  },
}
handsfree.disablePlugins('browser')

handsfree.use('noisedeck.app', {
  onFrame ({hands}) {
    if (!hands?.multiHandLandmarks) return

    // Right Pointer: Hue
    if (hands.pointer[1].isVisible) {
      if (hands.pinchState[1][0] === 'start') {
        $.hueRange2.start = $.hueRange2.el.value
        $.hueRotation2.start = $.hueRotation2.el.value
      } else if (hands.pinchState[1][0] === 'held') {
        $.hueRange2.el.value = normalize(
          $.hueRange2.start - (hands.origPinch[1][0].x - hands.curPinch[1][0].x),
          $.hueRange2.el.max,
          $.hueRange2.el.min
        )
        $.hueRotation2.el.value = normalize(
          $.hueRotation2.start - (hands.curPinch[1][0].y - hands.origPinch[1][0].y),
          $.hueRotation2.el.max,
          $.hueRotation2.el.min
        )
      }
    }

    // Right Middle: Loop
    if (hands.pointer[1].isVisible) {
      if (hands.pinchState[1][1] === 'start') {
        $.loopAmp2.start = $.loopAmp2.el.value
        $.loopFreq2.start = $.loopFreq2.el.value
      } else if (hands.pinchState[1][1] === 'held') {
        $.loopAmp2.el.value = normalize(
          $.loopAmp2.start - (hands.origPinch[1][1].x - hands.curPinch[1][1].x) * 2,
          $.loopAmp2.el.max,
          $.loopAmp2.el.min
        )
        $.loopFreq2.el.value = normalize(
          $.loopFreq2.start - (hands.curPinch[1][1].y - hands.origPinch[1][1].y) * 20,
          $.loopFreq2.el.max,
          $.loopFreq2.el.min
        )
      }
    }

    // Left Index: Kaleidoscope
    if (hands.pointer[0].isVisible) {
      if (hands.pinchState[0][0] === 'start') {
        $.brightness.start = $.brightness.el.value
      } else if (hands.pinchState[0][0] === 'held') {
        $.brightness.el.value = normalize(
          $.brightness.start - (hands.origPinch[0][0].x - hands.curPinch[0][0].x) * 2,
          $.brightness.el.max,
          $.brightness.el.min
        )
      }
    }
    
    // Loop through every visible hand
    // if (!pointer.isVisible || n > 1) return

    // // Right Pointer > Hue Ranges
    // if (hands.pinchState[n][0] === 'start') {
    // } else if (hands.pinchState[n][0] === 'held') {
    //   // $.hueRange1.el.value = clampToRange(handsfree.normalize(hands.pointer[n][0].x - hands.origPinch[n][0].x, 1, -1), $.hueRange1.el)
    // }
  }
})