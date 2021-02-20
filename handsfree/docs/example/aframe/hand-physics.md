# A-Frame: Hand physics

<div class="window mb-md">
  <div class="window-body">
    <div class="row">
      <div class="col-6">
        <img src="https://media3.giphy.com/media/YOPrRX6vTy6tb3frgt/giphy.gif">
      </div>
      <div class="col-6">
        <h2>Try it!</h2>
        <ul>
          <li>Move hand around to interact with environment</li>
          <li>Move your head to move the camera</li>
          <li><a href="https://codepen.io/MIDIBlocks/pen/wvzqbXr">Try it on CodePen</a></li>
        </ul>
        <div>
          <HandsfreeToggle class="full-width handsfree-hide-when-started-without-weboji" text-off="Try Demo" text-on="Stop Demo" :opts="demoOpts" />
          <button class="handsfree-show-when-started-without-weboji handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
          <button class="handsfree-show-when-started-without-weboji handsfree-hide-when-loading" @click="startDemo"><Fa-Video /> Try Demo</button>
        </div>
      </div>
    </div>
  </div>
</div>

<Window title="Look around the A-Frame Handsfree" style="height: 500px" :maximize='true'>
  <iframe id="aframe" src="/example/aframe/hand-physics/index.html" style="width: 100%; height: 100%"></iframe>
</Window>

## The basic approach

## Adding Tweening


## Boilerplate

<!-- The following is the boilerplate located [in the repo at /boilerplate/aframe/hand-physics/index.html](https://github.com/MIDIBlocks/handsfree/tree/master/boilerplate/aframe/hand-physics/index.html). You can also [play with this demo on CodePen](https://codepen.io/MIDIBlocks/pen/wvzqbXr), or by copy/pasting the following into a local `.html` file without a server.

<<< @/boilerplate/aframe/look-around-handsfree/index.html -->



<script>
import pick from 'lodash/pick'

let $iframe
let tween = {
  x: 0,
  y: 0,
  z: 0,
  yaw: 0,
  pitch: 0,
  roll: 0
}
  
export default {
  data: () => ({
    demoOpts: {
      autostart: true,
      weboji: false,
      hands: false,
      pose: false,
      handpose: true,
      facemesh: false
    }
  }),
  
  mounted () {
    document.addEventListener('handsfree-data', this.onData)
    window.addEventListener('message', this.onMessage)
  },

  destroyed () {
    document.removeEventListener('handsfree-data', this.onData)
    window.removeEventListener('onMessage', this.onMessage)
  },

  methods: {
    /**
     * Called on handsfree-data
     */
    onData ({detail}) {
      if (!detail?.handpose) return
      $iframe.contentWindow.postMessage({
        isHandsfree: true,
        action: 'data',
        handpose: pick(detail.handpose, ['normalized'])
      })
    },

    /**
     * Listen to ready state
     */
    onMessage (ev) {
      if (ev.data === 'aframeReady') {
        $iframe = document.querySelector('#aframe')
      }
    },

    startDemo () {
      window.handsfree.disablePlugins()
      window.handsfree.update(this.demoOpts)
    }
  }
}
</script>