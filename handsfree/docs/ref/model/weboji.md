---
next: /ref/event/
sidebarDepth: 2
---
# Model: Weboji


<div class="row align-top">
  <div class="col-6">
    <p><img alt="A person moving a virtual mouse pointer by moving their head" src="https://media0.giphy.com/media/Iv2aSMS0QTy2P5JNCX/giphy.gif" /></p>
    <ul>
      <li>Powered by <a href="https://github.com/jeeliz/jeelizWeboji">Jeeliz's Weboji</a></li>
      <li>Full <a href="https://github.com/jeeliz/jeelizWeboji/blob/master/doc/jeefacetransferAPI.pdf">technical documentation</a></li>
    </ul>
  </div>
  <div class="col-6">
    <Window title="Overview and basic demo">
      <section>
        <ul>
          <li>😀 6DOF head pose estimations</li>
          <li>😜 11 face morphs and 16 helper states</li>
          <li>🔌 Comes with "Face Pointer" based plugins</li>
        </ul>
        <p>This model uses morphs to help estimate various face states simultaneously and includes assistive tech plugins for browsing pages with face gestures.</p>
        <div>
          <HandsfreeToggle class="full-width handsfree-hide-when-started-without-weboji" text-off="Try basic Weboji demo" text-on="Stop Weboji Model" :opts="demoOpts" />
          <button class="handsfree-show-when-started-without-weboji handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
          <button class="handsfree-show-when-started-without-weboji handsfree-hide-when-loading" @click="startDemo"><Fa-Video /> Try basic Weboji demo</button>
        </div>
      </section>
    </Window>
  </div>
</div>

## Usage

### With defaults

```js
const handsfree = new Handsfree({weboji: true})
handsfree.start()
```

### With config

```js
// These are all the default values
handsfree = new Handsfree({
  weboji: {
    // Whether the model is enabled or not
    enabled: false,

    // Custom video settings
    videoSettings: {
      // The video, canvas, or image element
      // Omit this to auto create a <VIDEO> with the webcam
      videoElement: null,

      // ID of the device to use
      // Omit this to use the system default
      deviceId: null,

      // Which camera to use on the device
      // Possible values: 'user' (front), 'environment' (back)
      facingMode: 'user',

      // Video dimensions
      idealWidth: 320,
      idealHeight: 240,
      minWidth: 240,
      maxWidth: 1280,
      minHeight: 240,
      maxHeight: 1280
    },

    // Thresholds needed before these are considered "activated"
    // - Ranges from 0 (not active) to 1 (fully active)
    morphs: {
      threshold: {
        smileRight: 0.7,
        smileLeft: 0.7,
        browLeftDown: 0.8,
        browRightDown: 0.8,
        browLeftUp: 0.8,
        browRightUp: 0.8,
        eyeLeftClosed: 0.4,
        eyeRightClosed: 0.4,
        mouthOpen: 0.3,
        mouthRound: 0.8,
        upperLip: 0.5
      }
    }
  }
})
```

## Data

```js
/**
 * {Boolean} Whether the face is detected or not
 */
handsfree.data.weboji.isDetected

/**
 * {Array} Face morphs, from 0 (not activated) to 1 (fully activated)
 * 
 * 0: smileRight → closed mouth smile right
 * 1: smileLeft → closed mouth smile left
 * 2: eyeBrowLeftDown → left eyebrow frowned
 * 3: eyeBrowRightDown → right eyebrow frowned
 * 4: eyeBrowLeftUp → raise left eyebrow (surprise)
 * 5: eyeBrowRightUp → raise right eyebrow (surprise)
 * 6: mouthOpen → open mouth
 * 7: mouthRound → o shaped mouth
 * 8: eyeRightClose → close right eye
 * 9: eyeLeftClose → close left eye
 * 10: mouthNasty → nasty mouth (show teeth)
 */
handsfree.data.weboji.morphs

/**
 * {Array} Head rotation [pitch, yaw, roll]
 * - in radians where [0, 0, 0] is the head pointed directly at camera
 */
handsfree.data.weboji.rotation

/**
 * {Array} Head rotation [pitch, yaw, roll]
 * - in degrees where [0, 0, 0] is the head pointed directly at camera
 */
handsfree.data.weboji.degree

/**
 * {Array} Head translation [x, y, s]
 * - These are each between 0 and 1
 * - Scale refers to the size of the head in relation to the webcam frame
 */
handsfree.data.weboji.translation

/**
 * {Object} Where on the screen the head is pointed at {x, y}
 * - This is updated by: handsfree.plugin.facePointer
 */
handsfree.data.weboji.pointer

/**
 * {Object} Helper booleans checking if the morph has reached a threshold
 * 
 * .smileRight      Smirking lips to the right
 * .smileLeft       Smirking lips to the left
 * .smile           Smiling equally to both sides
 * .smirk           Smiling either to the right or left, but not both
 * .pursed          Kiss face
 * 
 * .browLeftUp      Left eyebrow raised up
 * .browRightUp     Right eyebrow raised up
 * .browsUp         Both eyebrows raised up
 * .browLeftDown    Left eyebrow frowning down
 * .browRightDown   Right eyebrow frowning down
 * .browsDown       Both eyebrows frowning down
 * .browseUpDown    One eyebrow down and the other up ("The Rock eyebrows")
 * 
 * .eyeLeftClosed   The left eye closed
 * .eyeRightClosed  The right eye closed
 * .eyesClosed      Both eyes closed
 * 
 * .mouthClosed
 * .mouthOpen
 */
handsfree.data.weboji.state
```

## API

Please see the [Weboji Docs](https://github.com/jeeliz/jeelizWeboji/blob/master/doc/jeefacetransferAPI.pdf) to see available methods exposed through `handsfree.model.weboji.api`:

```js
// Check if the head is detected or not
handsfree.model.weboji.api.is_detected()
```

## Using a pre-recorded video instead of a webcam

By default, setting `{weboji: true}` adds a new `<video>` element to the DOM to grab the webcam: 

```js
handsfree = new Handsfree({weboji: true})
```

To use a pre-recorded video or video stream, a canvas, or an image instead of a webcam set the `.videoSettings.videoElement` property:

```js
handsfree = new Handsfree({
  weboji: {
    enabled: true,
    videoSettings: {
      videoElement: document.querySelector('#my-video')
    }
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
    <blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">The Handsfree.js repo can itself be loaded as an unpacked Chrome Extensions: <a href="https://t.co/8RFl3yR0uA">https://t.co/8RFl3yR0uA</a><br><br>So if you&#39;d like to go that route, all the heavy work is already done for you. Additionally, with WebSockets and Robot.js, you can control your desktop too! <a href="https://t.co/m7Xunc0pfq">pic.twitter.com/m7Xunc0pfq</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1357799020521902080?ref_src=twsrc%5Etfw">February 5, 2021</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">This newer rewrite does less out the box but will be way more extensible<br><br>You can use it with Robot.js or other desktop automation libraries to control your desktop/devices. Here&#39;s an older demo of that (will share code to this soon) <a href="https://t.co/ShoAwHGGHu">pic.twitter.com/ShoAwHGGHu</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1326763862457274368?ref_src=twsrc%5Etfw">November 12, 2020</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">Here&#39;s a 30sec video w positioning &amp; smoothing<br><br>On the right is my Chrome Dev Tools opened to the <a href="https://twitter.com/hashtag/WebXR?src=hash&amp;ref_src=twsrc%5Etfw">#WebXR</a> tab that comes with the Mozilla Emulator Extension with the new Handsfree button 🖐👀🖐<br><br>Thanks to <a href="https://twitter.com/i0nif?ref_src=twsrc%5Etfw">@i0nif</a> for the enthusiastic idea &amp; vision! Repo + docs + more after holidays <a href="https://t.co/rdV9MIjUBk">pic.twitter.com/rdV9MIjUBk</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1342356735814553600?ref_src=twsrc%5Etfw">December 25, 2020</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Working on a boilerplate for &quot;looking around&quot; an A-Frame handsfree without a VR headset<br><br>Going to release this tonight along with a tutorial! Since Handsfree.js is built in a way to support Hot Reload, one idea is to help you work on your 3D projects and look around while coding! <a href="https://t.co/NlIMKxgqWT">pic.twitter.com/NlIMKxgqWT</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1341118933206646784?ref_src=twsrc%5Etfw">December 21, 2020</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Handsfree projector w/ funky angles, test #1 🙌<br><br>Goal is to see what happens when the surface you want to point at is different than where the webcam is<br><br>This is the first step in my implementation of this paper but with projection mapping instead of AR: <a href="https://t.co/bflVqmW2RJ">https://t.co/bflVqmW2RJ</a> <a href="https://t.co/YgmYGRETB3">pic.twitter.com/YgmYGRETB3</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1334767867938525184?ref_src=twsrc%5Etfw">December 4, 2020</a></blockquote>
  </div>
  <div class="col-6">
    <Window title="Add your project">
      If you've made something with this model I'd love to showcase it here! DM me <a href="https://twitter.com/midiblocks">on Twitter</a>, <a class="https://github.com/midiblocks/handsfree/edit/master/docs/ref/model/hands.md">make a pull request</a>, or <a href="https://discord.gg/JeevWjTEdu">find us on Discord</a>.  
    </Window>
  </div>
</div>

## See also

- Examples
  - A-Frame
    - ["Look around" handsfree](/example/aframe/look-around-handsfree/)
- Plugins
  - [faceClick](/ref/model/faceClick/)
  - [facePointer](/ref/model/facePointer/)
  - [faceScroll](/ref/model/faceScroll/)

<!-- Code -->
<script>
export default {
  data () {
    return {
      demoOpts: {
        autostart: true,

        weboji: true,
        hands: false,
        facemesh: false,
        pose: false,
        handpose: false,

        plugin: {
          facePointer: {enabled: true},
          faceScroll: {enabled: true},
          faceClick: {enabled: true}
        }
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