---
prev: /ref/model/
sidebarDepth: 2
---

# Model: FaceMesh

<div class="row align-top">
  <div class="col-6">
    <p><img alt="A 3D model of a hand projected above a person's hand" src="https://media0.giphy.com/media/g2msiDwoLqabEMrmaL/giphy.gif" /></p>
    <ul>
      <li>Powered by <a href="https://www.npmjs.com/package/@mediapipe/face_mesh">MediaPipe's Face Mesh</a></li>
      <li>Full <a href="https://google.github.io/mediapipe/solutions/face_mesh.html">technical documentation</a></li>
    </ul>
  </div>
  <div class="col-6">
    <Window title="Overview and basic demo">
      <section>
        <ul>
          <li>🙂 468 2D face landmarks</li>
          <li>😁😜 Track up to 4 faces at once</li>
          <li>📅 Extra helpers and plugins coming soon</li>
        </ul>
        <p>This model doesn't come with any bonuses or plugins yet but they'll come soon. The API will remain exactly the same, so feel free to started with this model today!</p>
        <div>
          <HandsfreeToggle class="full-width handsfree-hide-when-started-without-facemesh" text-off="Try basic Face Mesh demo" text-on="Stop Face Mesh Model" :opts="demoOpts" />
          <button class="handsfree-show-when-started-without-facemesh handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
          <button class="handsfree-show-when-started-without-facemesh handsfree-hide-when-loading" @click="startDemo"><Fa-Video /> Try basic Face Mesh demo</button>
        </div>
      </section>
    </Window>
  </div>
</div>

## Usage

### With defaults

```js
const handsfree = new Handsfree({facemesh: true})
handsfree.start()
```

### With config

```js
const handsfree = new Handsfree({
  facemesh: {
    enabled: true,
    // The maximum number of faces to detect [1 - 4]
    maxNumFaces: 1,

    // Minimum confidence [0 - 1] for a face to be considered detected
    minDetectionConfidence: 0.5,
    
    // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
    // Higher values are more robust at the expense of higher latency
    minTrackingConfidence: 0.5
  }
})

handsfree.start()
```

## Data
```js
// faceIndex [0 - 3] An array of landmark points for each detected face
handsfree.data.facemesh.multiFaceLandmarks[faceIndex] == [
  // Landmark 0
  {x, y},
  // Landmark 1
  {x, y},
  // ...
  // Landmark 467
  {x, y}
]

// face 0, landmark 0
handsfree.data.facemesh.multiFaceLandmarks[0][0].x
handsfree.data.facemesh.multiFaceLandmarks[0][0].y
```

### Examples of accessing the data

```js
handsfree = new Handsfree({facemesh: true})
handsfree.start()

// From anywhere
handsfree.data.facemesh.multiFaceLandmarks[0]

// From inside a plugin
handsfree.use('logger', data => {
  if (!data.facemesh) return

  console.log(data.facemesh.multiFaceLandmarks[0][0])
})

// From an event
document.addEventListener('handsfree-data', event => {
  const data = event.detail
  if (!data.facemesh) return

  console.log(data.facemesh.multiFaceLandmarks)
})
```

## Inspiration

The following projects where built with TensorFlow's Face Mesh. They weren't made with Handsfree.js, but they're listed here as they use the same model and data ✨


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
    <Window title="AR Face Filter" :maximize="true">
      <section>
        <div>
          <a href="https://www.youtube.com/watch?v=TpiGFaHC_5U"><img alt="Various full digital face masks mimicking a persons head movements" src="https://media4.giphy.com/media/t7X4Ggyzrp7c0oeX4Q/giphy.gif"></a>
        </div>
        <p>In this project, <a href="https://twitter.com/samarthishere">Samarth Gulati</a> and Praveen Sinha demonstrate how to use Face Mesh together with Three.js to create customizable face filters!</p>
        <div>
          <ul>
            <li><a href="https://www.youtube.com/watch?v=TpiGFaHC_5U">Learn more about this project on YouTube</a></li>
            <li><a href="https://github.com/samarthgulati/ar-face-filters">Fork it on GitHub</a></li>
          </ul>
        </div>
      </section>
    </Window>
  </div>
  <div class="col-6">
    <Window title="Add your project">
      If you've made something with this model I'd love to showcase it here! DM me <a href="https://twitter.com/midiblocks">on Twitter</a>, <a class="https://github.com/midiblocks/handsfree/edit/master/docs/ref/model/hands.md">make a pull request</a>, or <a href="https://discord.gg/JeevWjTEdu">find us on Discord</a>.  
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
        facemesh: true,
        pose: false,
        handpose: false
      }
    }
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