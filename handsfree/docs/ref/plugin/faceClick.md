---
prev: /ref/plugin/
sidebarDepth: 2
---

# Plugin: faceClick

<div class="window mb-md">
  <div class="window-body">
    <div class="row">
      <div class="col-6">
        <img src="https://media0.giphy.com/media/Iv2aSMS0QTy2P5JNCX/giphy.gif" />
      </div>
      <div class="col-6">
        <ul>
          <li>Activate a face morph to click</li>
          <li>Customize which face morph to use</li>
          <li><strong>Tags:</strong> <code>['browser']</code></li>
        </ul>
        <div>
          <HandsfreeToggle class="full-width handsfree-hide-when-started-without-weboji" text-off="Try faceClick" text-on="Stop Weboji" :opts="demoOpts" />
          <button class="handsfree-show-when-started-without-weboji handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
          <button class="handsfree-show-when-started-without-weboji handsfree-hide-when-loading" @click="startDemo"><Fa-Video /> Try faceClick</button>
        </div>
      </div>
    </div>
  </div>
</div>

> **Models:** [Jeeliz Weboji](/ref/model/weboji/)
>
> **Activate:** `handsfree.plugin.faceClick.enable()`
>
> **Tags:** `['browser']`
>
> **About:** This plugin is used in combination with the [facePointer](/ref/plugin/facePointer/) to help you click on things on the screen with a face gesture.

You can customize which `handsfree.data.weboji.morphs[]` to use and how activated that morph needs to be to register the click. The click triggers a `MouseEvent` on the element underneath the pointer with the following options:

```js
new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
  clientX: data.pointer.x,
  clientY: data.pointer.y
})
```

## Config

### During instantiation

```js
const handsfree = new Handsfree({
  weboji: true,

  plugin: {
    faceClick: {
      // Morphs to watch for and their required confidences
      morphs: {
        // Smile right when it's at least 25% actitvated
        0: 0.25,
        // Smile left when it's at least 25% actitvated
        1: 0.25
      }
    }
  }
})
```

### After instantiation

```js
// Let's only use the right smile
delete handsfree.plugin.faceClick.config.moprhs[1]
// Let's require it to be 50% activated
handsfree.plugin.faceClick.config.moprhs[0] = .5
```

## Full plugin code

<<< @/src/plugin/weboji/faceClick.js


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