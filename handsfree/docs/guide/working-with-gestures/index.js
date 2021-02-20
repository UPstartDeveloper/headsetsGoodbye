// Gesture Definitions
import gestureLove from './gesture/hands/love.js'
import gestureHorns from './gesture/hands/horns.js'
import gesturePointRight from './gesture/hands/pointRight.js'
import gesturePointLeft from './gesture/hands/pointLeft.js'
import gesturePointUp from './gesture/hands/pointUp.js'
import gesturePointDown from './gesture/hands/pointDown.js'
import gestureSpock from './gesture/hands/spock.js'
import gestureCallMe from './gesture/hands/callMe.js'
import gestureOk from './gesture/hands/ok.js'
import gestureStop from './gesture/hands/stop.js'
import gestureVictory from './gesture/hands/victory.js'
import gestureFist from './gesture/hands/fist.js'
import gestureThumbUp from './gesture/hands/thumbUp.js'
import gestureThumbDown from './gesture/hands/thumbDown.js'

const demoGestures = {
  love: gestureLove,
  horns: gestureHorns,
  pointRight: gesturePointRight,
  pointLeft: gesturePointLeft,
  pointUp: gesturePointUp,
  pointDown: gesturePointDown,
  spock: gestureSpock,
  callMe: gestureCallMe,
  ok: gestureOk,
  stop: gestureStop,
  victory: gestureVictory,
  fist: gestureFist,
  thumbUp: gestureThumbUp,
  thumbDown: gestureThumbDown,
}

export default {
  data: () => ({
    demoOpts: {
      autostart: true,
      weboji: false,
      hands: true,
      handpose: false,
      facemesh: false,
      pose: false,
    }
  }),

  mounted () {
    /**
     * Plugin to detect and toggle models
     */
    let lastGestureHandpose = null
    let lastGestureHands = [null, null, null, null]

    // Recursive because of the way we're loading handsfree into the docs
    const checkHandsfree = () => {
      if (this.$root.handsfree) {
        // Add gestures
        Object.keys(demoGestures).forEach(name => {
          this.$root.handsfree.useGesture(demoGestures[name])
        })
        this.$root.handsfree.enableGestures('gestureDemo')
    
        // Emoji detector
        this.$root.handsfree.use('gestureEmojiDetector', ({hands, handpose}) => {
          if (hands?.gesture) {
            hands.gesture.forEach((gesture, n) => {
              if (gesture && gesture.name !== lastGestureHands[n]) {
                let $el = document.querySelector(`.gesture-emoji[gesture="${lastGestureHands[n]}"]`)
                if ($el) $el.classList.remove('active')
                $el = document.querySelector(`.gesture-emoji[gesture="${gesture.name}"]`)
                if ($el) $el.classList.add('active')
                
                lastGestureHands[n] = gesture.name
              }
    
              // Disable the gesture emoji if no gestures
              if (lastGestureHands[n] && !gesture?.name) {
                let $el = document.querySelector(`.gesture-emoji[gesture="${lastGestureHands[n]}"]`)
                if ($el) $el.classList.remove('active')
    
                lastGestureHands[n] = null
              }
            })
          }
    
          // Toggle the gesture emoji
          if (handpose?.gesture && handpose.gesture.name !== lastGestureHandpose) {
            let $el = document.querySelector(`.gesture-emoji[gesture="${lastGestureHandpose}"]`)
            if ($el) $el.classList.remove('active')
            $el = document.querySelector(`.gesture-emoji[gesture="${handpose.gesture.name}"]`)
            if ($el) $el.classList.add('active')
            
            lastGestureHandpose = handpose.gesture.name
          }
    
          // Disable the gesture emoji if no gestures
          if (lastGestureHandpose && !handpose?.gesture?.name) {
            let $el = document.querySelector(`.gesture-emoji[gesture="${lastGestureHandpose}"]`)
            if ($el) $el.classList.remove('active')
    
            lastGestureHandpose = null
          }
        })
      } else {
        setTimeout(checkHandsfree, 5)
      }
    }

    checkHandsfree()
  },

  destroyed () {
    this.$root.handsfree.plugin.gestureEmojiDetector.disable()
    this.$root.handsfree.disableGestures('gestureDemo')
  },

  methods: {
    startDemo () {
      this.$root.handsfree.update(this.demoOpts)
    }
  }
}