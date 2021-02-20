---
sidebarDepth: 2
---
# Model: Handpose

<div class="row align-top">
  <div class="col-6">
    <p><img alt="A 3D model of a hand projected above a person's hand" src="https://media1.giphy.com/media/qtDKTxsvD2fegGlRFr/giphy.gif" /></p>
    <ul>
      <li>Powered by <a href="https://github.com/tensorflow/tfjs-models/tree/master/handpose">TensorFlow's Handpose</a></li>
      <li>Debugger remixed from <a href="https://github.com/LingDong-/handpose-facemesh-demos">@LingDong-'s <code>handpose-facemesh-demos</code> on GitHub</a></li>
    </ul>
  </div>
  <div class="col-6">
    <Window title="Overview and basic demo">
      <section>
        <ul>
          <li>🖐 21 3D hand landmarks</li>
          <li>1️⃣ Only one hand at a time is supported</li>
          <li>🧰 Includes <a href="https://github.com/mrdoob/three.js/">THREE r124</a>, <a href="https://github.com/tensorflow/tfjs">TensorFlow 2.1</a></li>
        </ul>
        <p>This model includes a fingertip raycaster, center of palm object, and a minimal THREE environment which doubles as a basic debugger for your project.</p>
        <div>
          <HandsfreeToggle class="full-width handsfree-hide-when-started-without-handpose" text-off="Try basic Handpose demo" text-on="Stop Handpose Model" :opts="demoOpts" />
          <button class="handsfree-show-when-started-without-handpose handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
          <button class="handsfree-show-when-started-without-handpose handsfree-hide-when-loading" @click="startDemo"><Fa-Video /> Try basic Handpose demo</button>
        </div>
      </section>
    </Window>
  </div>
</div>

## Usage

### With defaults

```js
handsfree = new Handsfree({handpose: true})
handsfree.start()
```

### With config

```js
handsfree = new Handsfree({
  handpose: {
    enabled: true,

    // The backend to use: 'webgl' or 'wasm'
    // 🚨 Currently only webgl is supported
    backend: 'webgl',

    // How many frames to go without running the bounding box detector. 
    // Set to a lower value if you want a safety net in case the mesh detector produces consistently flawed predictions.
    maxContinuousChecks: Infinity,

    // Threshold for discarding a prediction
    detectionConfidence: 0.8,

    // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]
    iouThreshold: 0.3,

    // A threshold for deciding when to remove boxes based on score in non-maximum suppression.
    scoreThreshold: 0.75
  }
})
```

## Data

![](/hand-indices.jpg)

```js
// Get the [x, y, z] of various landmarks
// Thumb tip
handsfree.data.handpose.landmarks[4]
// Index fingertip
handsfree.data.handpose.landmarks[8]

// Normalized landmark values from [0 - 1] for the x and y
// The z isn't really depth but "units" away from the camera so those aren't normalized
handsfree.data.handpose.normalized[0]

// How confident the model is that a hand is in view [0 - 1]
handsfree.data.handpose.handInViewConfidence

// The top left and bottom right pixels containing the hand in the iframe
handsfree.data.handpose.boundingBox = {
  topLeft: [x, y],
  bottomRight: [x, y]
}

// [x, y, z] of various hand landmarks
handsfree.data.handpose.annotations: {
  thumb: [...[x, y, z]], // 4 landmarks
  indexFinger: [...[x, y, z]], // 4 landmarks
  middleFinger: [...[x, y, z]], // 4 landmarks
  ringFinger: [...[x, y, z]], // 4 landmarks
  pinkyFinger: [...[x, y, z]], // 4 landmarks
  palmBase: [[x, y, z]], // 1 landmarks
}
```

### Examples of accessing the data

```js
handsfree = new Handsfree({handpose: true})
handsfree.start()

// From anywhere
handsfree.data.handpose.landmarks

// From inside a plugin
handsfree.use('logger', data => {
  if (!data.handpose) return

  console.log(data.handpose.boundingBox)
})

// From an event
document.addEventListener('handsfree-data', event => {
  const data = event.detail
  if (!data.handpose) return

  console.log(data.handpose.annotations.indexFinger)
})
```

## Three.js Properties

The following helper Three.js properties are also available:

```js
// A THREE Arrow object protuding from the index finger
// - You can use this to calculate pointing vectors
handsfree.model.handpose.three.arrow
// The THREE camera
handsfree.model.handpose.three.camera
// An additional mesh that is positioned at the center of the palm
// - This is where we raycast the Hand Pointer from
handsfree.model.handpose.three.centerPalmObj
// The meshes representing each skeleton joint
// - You can tap into the rotation to calculate pointing vectors for each fingertip
handsfree.model.handpose.three.meshes[]
// A reusable THREE raycaster
// @see https://threejs.org/docs/#api/en/core/Raycaster
handsfree.model.handpose.three.raycaster
// The THREE scene and renderer used to hold the hand model
handsfree.model.handpose.three.renderer
handsfree.model.handpose.three.scene
// The screen object. The Hand Pointer raycasts from the centerPalmObj
// onto this screen object. The point of intersection is then mapped to
// the device screen to position the pointer
handsfree.model.handpose.three.screen
```


## Examples

<!-- 🙌 Hi! If you'd like to add your project, just uncomment below with and replace the ALL_CAPS to your info. Thanks so much 🙏 -->

<!--
<div class="row">
  <div class="col-6">
    <Window title="DEMO_TITLE" :maximize="true">
      <div>
        <a href="LINK_TO_DEMO"><img alt="SHORT_DESCRIPTION" src="LINK_TO_GIPHY_OR_OTHER_PUBLIC_GIF_URL"></a>
      </div>
      <p>A_BRIEF_DESCRIPTION</p>
      <div>
        <ul>
          <li><a href="LINK_TO_DEMO">Try it on Glitch</a></li>
          <li><a href="LINK_TO_SOURCE_OR_GITHUB">See the source</a></li>
        </ul>
      </div>
    </Window>
  </div>
</div>
-->

<div class="row align-top">
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Handsfree.js now has <a href="https://twitter.com/hashtag/TensorFlow?src=hash&amp;ref_src=twsrc%5Etfw">#TensorFlow</a> <a href="https://twitter.com/hashtag/Handpose?src=hash&amp;ref_src=twsrc%5Etfw">#Handpose</a>:<br><br>- 21 3D landmarks (only 1 hand for now)<br>- A fingertip raycaster for pointing at things<br>- No plugins yet but will have some basic gestures added soon<br><br>Basic documentation + demos: <a href="https://t.co/LH0qYbOG4G">https://t.co/LH0qYbOG4G</a><a href="https://twitter.com/hashtag/MadeWithTFJS?src=hash&amp;ref_src=twsrc%5Etfw">#MadeWithTFJS</a> <a href="https://twitter.com/hashtag/WebXR?src=hash&amp;ref_src=twsrc%5Etfw">#WebXR</a> <a href="https://t.co/qT0lWgtN7P">pic.twitter.com/qT0lWgtN7P</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1347287684272717824?ref_src=twsrc%5Etfw">January 7, 2021</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">I made Handsfree Jenga 🧱👌<br><br>It&#39;s kinda buggy still but this demos how to use Hand Pointers to interact w/ physics in a Three.js scene <a href="https://twitter.com/hashtag/MadeWithTFJS?src=hash&amp;ref_src=twsrc%5Etfw">#MadeWithTFJS</a><br><br>Try it: <a href="https://t.co/ACuamUga0r">https://t.co/ACuamUga0r</a><br>Handsfree.js hook: <a href="https://t.co/UybmDLnVFE">https://t.co/UybmDLnVFE</a><br>Docs: <a href="https://t.co/WpNd3kLp8r">https://t.co/WpNd3kLp8r</a> <a href="https://t.co/bEdi5Gm5z7">pic.twitter.com/bEdi5Gm5z7</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1334667133779755008?ref_src=twsrc%5Etfw">December 4, 2020</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Some progress on getting 2 hands tracked with <a href="https://twitter.com/hashtag/Handpose?src=hash&amp;ref_src=twsrc%5Etfw">#Handpose</a>!<br><br>Since it can&#39;t detect 2 hands yet what I do is:<br>- Check for a hand<br>- Draw a rectangle over the hand<br>- Check for a hand again...since 1st hand is covered it&#39;ll now detect 2nd<br><br>Kinda slow still but getting there 🖐👁👄👁🖐 <a href="https://t.co/xcdo14Txwn">pic.twitter.com/xcdo14Txwn</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1336953212176224256?ref_src=twsrc%5Etfw">December 10, 2020</a></blockquote>  
  </div>
  <div class="col-6">
    <Window title="Add your project">
      If you've made something with this model I'd love to showcase it here! DM me <a href="https://twitter.com/midiblocks">on Twitter</a>, <a class="https://github.com/midiblocks/handsfree/edit/master/docs/ref/model/handpose.md">make a pull request</a>, or <a href="https://discord.gg/JeevWjTEdu">find us on Discord</a>.  
    </Window>
  </div>
</div>





<!-- Code -->
<script>
export default {
  data () {
    return {
      demoOpts: {
        autostart: true,

        weboji: false,
        hands: false,
        facemesh: false,
        pose: false,
        handpose: true
      }
    }
  },

  // Render tweets
  mounted () {
    const $script = document.createElement('SCRIPT')
    $script.src = 'https://platform.twitter.com/widgets.js'
    document.body.appendChild($script)
  },

  methods: {
    /**
     * Start the page with our preset options
     */
    startDemo () {
      this.$root.handsfree.update(this.demoOpts)
    }
  }
}
</script>