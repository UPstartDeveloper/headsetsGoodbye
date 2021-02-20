---
sidebarDepth: 2
---

# Plugin: facePointer

<div class="window mb-md">
  <div class="window-body">
    <div class="row">
      <div class="col-6">
        <img src="https://media0.giphy.com/media/Iv2aSMS0QTy2P5JNCX/giphy.gif" />
      </div>
      <div class="col-6">
        <ul>
          <li>Move head to move the pointer</li>
          <li>Adjust the the offsets and move speed</li>
          <li><strong>Tags:</strong> <code>['browser']</code></li>
        </ul>
        <div>
          <HandsfreeToggle class="full-width handsfree-hide-when-started-without-weboji" text-off="Try facePointer" text-on="Stop Weboji" :opts="demoOpts" />
          <button class="handsfree-show-when-started-without-weboji handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
          <button class="handsfree-show-when-started-without-weboji handsfree-hide-when-loading" @click="startDemo"><Fa-Video /> Try facePointer</button>
        </div>
      </div>
    </div>
  </div>
</div>

> **Models:** [Jeeliz Weboji](/ref/model/weboji/)
>
> **Activate:** `handsfree.plugin.facePointer.enable()`
>
> **Tags:** `['browser']`
>
> **About:** This plugin is used in combination with the [faceClick](/ref/plugin/faceClick/) and [facePointer](/ref/plugin/facePointer/) to help you interact with pages with face gestures.

This plugin will create pointer element with the following classes: 

```css
.handsfree-pointer
.handsfree-pointer-face
.handsfree-hide-when-started-without-weboji
```

## Config

### During instantiation

```js
const handsfree = new Handsfree({
  weboji: true,

  plugin: {
    facePointer: {
      // Used to offset the pointer, like when the webcam is not in front of you
      offset: {
        // Nudge the pointer by this amount
        x: 0,
        y: 0,
        // Calibrate the head (in degrees)
        pitch: -15,
        yaw: -12,
        roll: 0
      },

      // Sets how senstive the pointer is
      speed: {
        x: 1,
        y: 1
      }
    }
  }
})
```

### After instantiation

```js
// Let's make the pointer move a bit slower
handsfree.plugin.facePointer.config.speed.x = .8
handsfree.plugin.facePointer.config.speed.y = .8

// Let's adjust for when the camera is to the right of you
handsfree.plugin.facePointer.config.offset.yaw = -90
```

## Full plugin code

<<< @/src/plugin/weboji/facePointer.js


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