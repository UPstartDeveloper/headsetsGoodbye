# A-Frame: "Look around" handsfree

<div class="window mb-md">
  <div class="window-body">
    <div class="row">
      <div class="col-6">
        <img src="https://media3.giphy.com/media/YOPrRX6vTy6tb3frgt/giphy.gif">
      </div>
      <div class="col-6">
        <h2>Try it!</h2>
        <ul>
          <li>Turn head around to turn the camera</li>
          <li>Move your head to move the camera</li>
          <li><a href="https://codepen.io/MIDIBlocks/pen/wvzqbXr">Try it on CodePen</a></li>
        </ul>
        <div>
          <HandsfreeToggle class="full-width handsfree-hide-when-started-without-weboji" text-off="Look around Handsfree" text-on="Stop Pose" :opts="demoOpts" />
          <button class="handsfree-show-when-started-without-weboji handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
          <button class="handsfree-show-when-started-without-weboji handsfree-hide-when-loading" @click="startDemo"><Fa-Video /> Look around Handsfree</button>
        </div>
      </div>
    </div>
  </div>
</div>

<Window title="Look around the A-Frame Handsfree" style="height: 500px" :maximize='true'>
  <iframe id="aframe" src="/example/aframe/look-around-handsfree/index.html" style="width: 100%; height: 100%"></iframe>
</Window>

## The basic approach

First we start by instantiating Handsfree. We'll use the [Weboji model](/ref/model/weboji/) which gives us head pose and translation:

```js
handsfree = new Handsfree({weboji: true})
```

Next we create a plugin to match the A-Frame camera's pose with your head's:

```js
$rig = document.querySelector('#camera-rig')

// Create the plugin
handsfree.use('lookHandsfree', ({weboji}) => {
  // Bail if we don't have weboji data
  if (!weboji.degree) return
  
  // [yaw, pitch, roll]
  const rot = weboji.degree

  // Let's shift the yaw slightly
  // - this assumes webcam is slightly below eye level, like on a laptop
  rot[0] += 15
  
  // Calculate position
  // - Positions are normalized between [0, 1]
  // - 0 is all the way to the left of the canvas, 1 all the way to the right
  // - Change the multiplier to change the range you want to move by
  const pos = {
    // Subtract .5 to "center" the x value
    x: (weboji.translation[0] - .5) * 10,
    // Subtract .5 to "center" the y value
    y: (weboji.translation[1] - .5) * 5,
    // Let's position the camera 5 units back from the center of the room
    z: 5 - weboji.translation[2] * 30
  }
  
  // Now let's just tell A-Frame to update our camera rig
  // - We flip yaw/roll because we are "looking into" the aframe vs how the tracker is "looking at" us
  // - We multiply by 1.5 to make it "look more", so we don't have to physically move our head as much
  $rig.setAttribute('rotation', `${-rot[0] * 1.5} ${-rot[1] * 1.5} ${rot[2] * 1.5}`)
  $rig.setAttribute('position', `${pos} ${pos} ${pos}`)
})

// Start tracking
handsfree.start()
```

## Adding Tweening

Although the above will definitely work, you'll notice that it jerks around quite a bit:

<div class="window mb-md">
  <div class="window-body">
    <div class="row">
      <div class="col-6">
        <h2>Jerky</h2>
        <img src="https://media1.giphy.com/media/N2KK8hpwsepdXy7lUA/giphy.gif">
      </div>
      <div class="col-6">
        <h2>Smooth</h2>
        <img src="https://media3.giphy.com/media/YOPrRX6vTy6tb3frgt/giphy.gif">
      </div>
    </div>
  </div>
</div>

This is due to slight errors between frames and the fact that it isn't running at a full 30 or 60FPS. To fix this, we can modify the above to use Tweening:

```html
<!-- Add a tweening library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js"></script>
```

```js
// This will hold our tween values
tween = {yaw: 0, pitch: 0, roll: 0, x: 0, y: 0, z: 0}

handsfree.use('lookHandsfree', ({weboji}) => {
  if (!weboji.degree) return
  
  // Calculate rotation
  const rot = weboji.degree
  rot[0] += 15
  
  // Calculate position
  const pos = {
    x: (weboji.translation[0] - .5) * 10,
    y: (weboji.translation[1] - .5) * 5,
    z: 5 - weboji.translation[2] * 30
  }

  // Tween this values
  window.handsfree.TweenMax.to(tween, 1, {
  yaw: -rot[0] * 1.5,
  pitch: -rot[1] * 1.5,
  roll: rot[2] * 1.5,
    x: pos.x,
    y: pos.y,
    z: pos.z
  })
  
  // Use the tweened values instead of the actual current values from webcam
  $rig.setAttribute('rotation', `${tween.yaw} ${tween.pitch} ${tween.roll}`)
  $rig.setAttribute('position', `${tween.x} ${tween.y} ${tween.z}`)
})

// Start tracking
handsfree.start()
```

## See Also

- The [Weboji Model](/ref/model/weboji/)
- [Plugins and the main loop](/ref/guide/the-loop/)
- [handsfree.use()](/ref/method/use/)

## Boilerplate

The following is the boilerplate located [in the repo at /boilerplate/aframe/look-around-handsfree/index.html](https://github.com/MIDIBlocks/handsfree/tree/master/boilerplate/aframe/look-around-handsfree/index.html). You can also [play with this demo on CodePen](https://codepen.io/MIDIBlocks/pen/wvzqbXr), or by copy/pasting the following into a local `.html` file without a server.

<<< @/boilerplate/aframe/look-around-handsfree/index.html



<script>
let iframe
let $rig
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

      weboji: true,
      hands: false,
      pose: false,
      handpose: false,
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
      const weboji = detail.weboji
      if (!weboji.isDetected) return

      // Calculate rotation
      const rot = weboji.degree
      rot[0] -= 15
      
      // Calculate position
      const pos = {
        x: (weboji.translation[0] - .5) * 10,
        y: (weboji.translation[1] - .5) * 5,
        z: 5 - weboji.translation[2] * 30
      }

      // Tween this values
      window.handsfree.TweenMax.to(tween, 1, {
        yaw: -rot[0] * 1.5,
        pitch: -rot[1] * 1.5,
        roll: rot[2] * 1.5,
        x: pos.x,
        y: pos.y,
        z: pos.z
      })
      
      // Use the tweened values instead of the actual current values from webcam
      $rig.setAttribute('rotation', `${tween.yaw} ${tween.pitch} ${tween.roll}`)
      $rig.setAttribute('position', `${tween.x} ${tween.y} ${tween.z}`)
    },

    /**
     * Listen to ready state
     */
    onMessage (ev) {
      if (ev.data === 'aframeReady') {
        window.iframe = iframe = document.querySelector('#aframe').contentDocument
        window.$rig = $rig = iframe.querySelector('#rig')
      }
    },

    startDemo () {
      window.handsfree.disablePlugins()
      window.handsfree.update(this.demoOpts)
    }
  }
}
</script>