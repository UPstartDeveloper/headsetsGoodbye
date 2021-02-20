---
sidebarDepth: 2
---

# Plugin: faceScroll

<div class="window mb-md">
  <div class="window-body">
    <div class="row">
      <div class="col-6">
        <img src="https://media0.giphy.com/media/Iv2aSMS0QTy2P5JNCX/giphy.gif" />
      </div>
      <div class="col-6">
        <ul>
          <li>Move <router-link to="/ref/plugin/facePointer/">facePointer</router-link> above or below a scroll area to scroll in that direction</li>
          <li>Hover over scroll areas to focus it</li>
          <li>Adjust focus time and scroll zones and speeds</li>
          <li><strong>Tags:</strong> <code>['browser']</code></li>
        </ul>
        <div>
          <HandsfreeToggle class="full-width handsfree-hide-when-started-without-weboji" text-off="Try faceScroll" text-on="Stop Weboji" :opts="demoOpts" />
          <button class="handsfree-show-when-started-without-weboji handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
          <button class="handsfree-show-when-started-without-weboji handsfree-hide-when-loading" @click="startDemo"><Fa-Video /> Try faceScroll</button>
        </div>
      </div>
    </div>
  </div>
</div>

> **Models:** [Jeeliz Weboji](/ref/model/weboji/)
>
> **Activate:** `handsfree.plugin.faceScroll.enable()`
>
> **Tags:** `['browser']`
>
> **About:** This plugin is used in combination with the [facePointer](/ref/plugin/facePointer/) to help you scroll pages with head movements.

## Config

### During instantiation

```js
const handsfree = new Handsfree({
  weboji: true,

  plugin: {
    faceScroll: {
      // Number of frames over the same element before activating that element
      framesToFocus: 10,

      vertScroll: {
        // The multiplier to scroll by. Lower numbers are slower
        scrollSpeed: 0.15,
        // How many pixels from the top/bottom of the scroll area to scroll
        scrollZone: 100
      }
    }
  }
})
```

### After instantiation

```js
// Require 100ms to focus that element
handsfree.plugin.faceScroll.config.framesToFocus = 100

// Require that the pointer moves way above or way below the scroll area
handsfree.plugin.faceScroll.config.offset.yaw = -100
```

## Full plugin code

<<< @/src/plugin/weboji/faceScroll.js


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