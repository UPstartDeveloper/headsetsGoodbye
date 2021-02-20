---
sidebarDepth: 2
---
# Model: Hands

<div class="row align-top">
  <div class="col-6">
    <p><img alt="A 3D model of a hand projected above a person's hand" src="https://media0.giphy.com/media/y4S6WFaCUWvqHL7UA8/giphy.gif" /></p>
    <ul>
      <li>Powered by <a href="https://www.npmjs.com/package/@mediapipe/hands">MediaPipe's Hands</a></li>
      <li>Full <a href="https://google.github.io/mediapipe/solutions/hands.html">technical documentation</a></li>
    </ul>
  </div>
  <div class="col-6">
    <Window title="Overview and basic demo">
      <section>
        <ul>
          <li>🖐 22 2D hand landmarks</li>
          <li>🖐🖐 Track up to 4 hands total</li>
        </ul>
        <p>This model includes dozens of <router-link to="/ref/plugin/pinchers/">Pinch Events</router-link> and helper styles to get you going quickly, along with a <router-link to="/ref/plugin/pinchScroll/">plugin for scrolling pages handsfree</router-link>.</p>
        <div>
          <HandsfreeToggle class="full-width handsfree-hide-when-started-without-hands" text-off="Try basic Hands demo" text-on="Stop Hands Model" :opts="demoOpts" />
          <button class="handsfree-show-when-started-without-hands handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
          <button class="handsfree-show-when-started-without-hands handsfree-hide-when-loading" @click="startDemo"><Fa-Video /> Try basic Hands demo</button>
        </div>
      </section>
    </Window>
  </div>
</div>

## Usage

### With defaults

```js
const handsfree = new Handsfree({hands: true})
handsfree.start()
```

### With config

```js
const handsfree = new Handsfree({
  hands: {
    enabled: true,
    // The maximum number of hands to detect [0 - 4]
    maxNumHands: 2,

    // Minimum confidence [0 - 1] for a hand to be considered detected
    minDetectionConfidence: 0.5,

    // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
    // Higher values are more robust at the expense of higher latency
    minTrackingConfidence: 0.5
  }
})

handsfree.start()
```

## Data

![](https://i.imgur.com/yhSbAUU.png)
<br><small>Image source, MediaPipe: [https://google.github.io/mediapipe/solutions/hands#hand-landmark-model](https://google.github.io/mediapipe/solutions/hands#hand-landmark-model)</small>

### Hand Landmarks

#### `.landmarks` and `.landmarksVisible`

You can access the landmarks for each hand through:

```js
// handIndex [0 - 3] An array of landmark points for each detected hands
handsfree.data.hands.landmarks

// Left hand, person #1
handsfree.data.hands.landmarks[0]
// Right hand, person #1
handsfree.data.hands.landmarks[1]
// Left hand, person #2
handsfree.data.hands.landmarks[2]
// Right hand, person #2
handsfree.data.hands.landmarks[3]
```

Each of these has 22 `{x, y}` landmarks. To check if the hand is detected, you can use `handsfree.data.hands.landmarksVisible`:

```js
// Left hand, person #1
handsfree.data.hands.landmarksVisible[0]
// Right hand, person #1
handsfree.data.hands.landmarksVisible[1]
// Left hand, person #2
handsfree.data.hands.landmarksVisible[2]
// Right hand, person #2
handsfree.data.hands.landmarksVisible[3]
```

#### Original data

It's not recommended to use these as the hands are not always in the correct index, however it's exposed here to provide backward compatibility for those switching to Handsfree.js from using MediaPipe Hands directly.

```js
// handIndex [0 - 3] An array of landmark points for each detected hands
handsfree.data.hands.multiHandLandmarks[handIndex] == [
  // Landmark 0
  {x, y},
  // Landmark 1
  {x, y},
  // ...
  // Landmark 20
  {x, y}
]

// hand 0, landmark 0
handsfree.data.hands.multiHandLandmarks[0][0].x
handsfree.data.hands.multiHandLandmarks[0][0].y
```

### Is it the right or left hand?

```js
// handIndex [0 - 3] An array of landmark points for each detected hands
handsfree.data.hands.multiHandedness[handIndex] == {
  // "Right" or "Left"
  label,
  // The probability that it is "Right" or "Left"
  score
}

// hand 0
handsfree.data.hands.multiHandedness[0].label
handsfree.data.hands.multiHandedness[0].score
```

### Examples of accessing the data

```js
handsfree = new Handsfree({hands: true})
handsfree.start()

// From anywhere
handsfree.data.hands.landmarks

// From inside a plugin
handsfree.use('logger', data => {
  if (!data.hands) return

  // Show a log whenever the left hand is visible
  if (data.hands.landmarksVisible[0]) {
    console.log(data.hands.landmarks[0])
  }
})

// From an event
document.addEventListener('handsfree-data', event => {
  const data = event.detail
  if (!data.hands) return

  // Show a log whenever the right hand for person #2 is visible
  if (data.hands.landmarksVisible[3]) {
    console.log(data.hands.landmarks[3])
  }
})
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
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">I remixed <a href="https://twitter.com/notwaldorf?ref_src=twsrc%5Etfw">@notwaldorf</a>&#39;s Piano Genie so that you can jam out with your fingers through a webcam 🖐🎹🖐<br><br>Try it on <a href="https://twitter.com/glitch?ref_src=twsrc%5Etfw">@Glitch</a>: <a href="https://t.co/CvrOboC5tV">https://t.co/CvrOboC5tV</a><br><br>Or see the source: <a href="https://t.co/ffWG92OEm2">https://t.co/ffWG92OEm2</a><br><br>Remixed by simply using the &quot;Pincher Plugin&quot; of Handsfree.js! <a href="https://twitter.com/hashtag/MediaPipe?src=hash&amp;ref_src=twsrc%5Etfw">#MediaPipe</a> <a href="https://twitter.com/hashtag/MadeWithTFJS?src=hash&amp;ref_src=twsrc%5Etfw">#MadeWithTFJS</a> <a href="https://t.co/lblUgzNl7N">pic.twitter.com/lblUgzNl7N</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1359382512938541057?ref_src=twsrc%5Etfw">February 10, 2021</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Day 2 of <a href="https://twitter.com/hashtag/100DaysHandsfree?src=hash&amp;ref_src=twsrc%5Etfw">#100DaysHandsfree</a><br><br>On recommendation I&#39;ve started handsfree-ifying <a href="https://twitter.com/daviddotli?ref_src=twsrc%5Etfw">@daviddotli</a> Blob Opera 🎶 Only works with 1 pinch at a time but it works really well!<br><br>If you&#39;d like to see how I did it, it was just 39 smooth lines of JavaScript: <a href="https://t.co/ho39dwQiqB">https://t.co/ho39dwQiqB</a> <a href="https://t.co/qdoWZD1gJg">pic.twitter.com/qdoWZD1gJg</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1352434377871872006?ref_src=twsrc%5Etfw">January 22, 2021</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Been trying to figure out a way to safely sandbox webcam but also render it w/ green wireframes on top of pages<br><br>My solution was to run webcam in a headless Browser Background Script, render it + wireframes onto canvas, then use Picture in Picture API to &quot;pop it outside&quot; browser! <a href="https://t.co/dZDStQ6BFq">pic.twitter.com/dZDStQ6BFq</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1344466561222889472?ref_src=twsrc%5Etfw">December 31, 2020</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">My browser based, handsfree UX toolkits are finally coming together after 2.5 looong years 😭<br><br>Here I&#39;m playing a Steam game with hand gestures detected in the browser and sent to the desktop<br><br>It&#39;s 100% JavaScript! <a href="https://twitter.com/hashtag/MadeWithTFJS?src=hash&amp;ref_src=twsrc%5Etfw">#MadeWithTFJS</a> cc <a href="https://twitter.com/jason_mayes?ref_src=twsrc%5Etfw">@jason_mayes</a> <a href="https://t.co/Y1h7ajgnTD">pic.twitter.com/Y1h7ajgnTD</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1332924126973939713?ref_src=twsrc%5Etfw">November 29, 2020</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">In 2021 I&#39;m going to make a small piece of handsfree art/music every few days using a different online tool, and I&#39;ll be curating everything on my new Instagram: <a href="https://t.co/gQZ3uk9muG">https://t.co/gQZ3uk9muG</a><br><br>Here&#39;s my first exploration from a few days ago, where I try to direct diffusions to music <a href="https://t.co/OJywuYK7z9">pic.twitter.com/OJywuYK7z9</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1344366460374683648?ref_src=twsrc%5Etfw">December 30, 2020</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Handsfree.js 8.2.4 is ready:<br><br>- Pinch scrolling is now continuous which is so smooth now!<br>- Pointers now emulate mousedown, mousemove, and mouseup so hover styles/listeners now work &amp; also works within Pointer Lock API<br><br>Here&#39;s the pinchScroll demo: <a href="https://t.co/DYWag59y1d">https://t.co/DYWag59y1d</a> <a href="https://t.co/T5tln7A3a8">pic.twitter.com/T5tln7A3a8</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1354530511448760321?ref_src=twsrc%5Etfw">January 27, 2021</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Handsfree.js now emits 24+ &quot;Pinch Events&quot; ✨👌<br><br>Like mouse events, you can now listen for a &quot;start&quot;, &quot;held&quot;, and &quot;release&quot; event for each finger (index, middle, ring, pinky). You also get the original pixel you pinched at + tons of new styles!<br><br>Docs: <a href="https://t.co/ngOKInXzeV">https://t.co/ngOKInXzeV</a> <a href="https://t.co/J39qvDnWcV">pic.twitter.com/J39qvDnWcV</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1345093247161389056?ref_src=twsrc%5Etfw">January 1, 2021</a></blockquote>
  </div>
  <div class="col-6">
    <Window title="Add your project">
      If you've made something with this model I'd love to showcase it here! DM me <a href="https://twitter.com/midiblocks">on Twitter</a>, <a class="https://github.com/midiblocks/handsfree/edit/master/docs/ref/model/hands.md">make a pull request</a>, or <a href="https://discord.gg/JeevWjTEdu">find us on Discord</a>.  
    </Window>
  </div>
</div>

## See Also

- [palmPointers plugin](/ref/plugin/palmPointers/) - Creates pointers for each hand that can be moved around my moving the hands with the palm pointed towards the webcam
- [pinchers plugin](/ref/plugin/pinchers/) - This plugin adds dozens of new events and helper styles for pinching any finger (index, middle, ring, pinky) to your thumb. It is enabled by default
- [pinchScroll plugin](/ref/plugin/pinchScroll/) - Adds the ability to scroll pages with a pinch gesture






<!-- Code -->
<script>
export default {
  data () {
    return {
      demoOpts: {
        autostart: true,

        weboji: false,
        hands: true,
        facemesh: false,
        pose: false,
        handpose: false
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