---
sidebarDepth: 2
---
# Plugin: palmPointers

<Window>
  <div class="row">
    <div class="col-6"><img src="https://media3.giphy.com/media/r3Z89IFJfndPwJcItT/giphy.gif"></div>
    <div class="col-6">
      <ul>
        <li>🖐 With your palm(s) pointed at the screen, move your hands to move the pointer</li>
        <li>👌 Pinch your index and thumb to scroll the area under the pointer</li>
        <li>Try scrolling two scroll areas at once!</li>
      </ul>
      <HandsfreeToggle class="full-width handsfree-hide-when-started-without-hands" text-off="Try Palm Pointers" text-on="Stop Palm Pointers" :opts="demoOpts" />
      <button class="handsfree-show-when-started-without-hands handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
      <button class="handsfree-show-when-started-without-hands handsfree-hide-when-loading" @click="startDemo"><Fa-Video /> Try Palm Pointers</button>
    </div>
  </div>
</Window>

> **Models:** [MediaPipe Hands](/ref/model/hands/)
>
> **About:** This plugin displays a pointer on the screen for each visible hand, which can be used as a guide when [pinch clicking](/ref/plugin/pinchClick/) or [pinch scrolling](/ref/plugin/pinchScroll/)
>
> **Activate:** `handsfree.plugin.palmPointers.enable()` or `handsfree.enablePlugins('core')`
>
> **Tags:** `['core']`

## Try scrolling these different areas at the same time
<table class="multi-hand-scrollers">
  <tr>
    <td><div><div></div></div></td>
    <td><div><div></div></div></td>
  </tr>
  <tr>
    <td><div><div></div></div></td>
    <td><div><div></div></div></td>
  </tr>
</table>

## The Pointers

This plugin adds `handsfree.data.hands.pointers` to the [Hands Model](/ref/model/hands/) with an object for each hand:

```js
handsfree.data.hands.pointers = [
  // Left hand 1
  {x, y, isVisible},
  // Right hand 1
  {x, y, isVisible},
  // Left hand 2
  {x, y, isVisible},
  // Right hand 2
  {x, y, isVisible}
]
```

The pointers are automatically shown and hidden as the hands come in and out view. You can access these in several ways:

```js
// From anywhere
handsfree.data.hands.pointers[0]

// From inside a plugin
handsfree.use('logger', data => {
  if (!data.hands) return

  console.log(data.hands.pointers[0])
})

// From an event
document.addEventListener('handsfree-data', event => {
  const data = event.detail
  if (!data.hands) return

  console.log(data.hands.pointers[0])
})
```

## Config

### During instantiation

```js
handsfree = new Handsfree({
  hands: true,

  plugin: {
    palmPointers: {
      enabled: true,

      // How much to offfset the pointers by
      // - This is useful for when the camera won't be in front of you
      // - This is also useful when working with multiple displays
      offset: {
        x: 0,
        y: 0
      },

      // A multiplier to apply to moving the pointer
      speed: {
        x: 1.5,
        y: 1.5
      }
    }
  }
})
```

### After instantiation

```js
handsfree = new Handsfree({hands: true})
handsfree.start()

handsfree.plugin.palmPointers.enable()
handsfree.plugin.palmPointers.speed = {x: 2, y: 2}
handsfree.plugin.palmPointers.offset = {x: 100, y: 100}
```

## Properties

The following properties are available on this plugin:

```js
// The pointer {x, y} for each hand
handsfree.plugin.palmPointers.pointers === [leftHand1, rightHand1, leftHand2, rightHand2]

// The pointer elements
handsfree.plugin.palmPointers.$pointers === [leftHand1, rightHand1, leftHand2, rightHand2]
```

### Examples of accessing properties

```js
// hide the pointer for the left hand (for the 1st person)
handsfree.plugin.palmPointers.$pointers[0].style.display = 'none'

// show the pointer for the right hand (for the 2nd person)
handsfree.plugin.palmPointers.$pointers[3].style.display = 'block'
```

## Methods

The following methods are available on this plugins:

```js
// Show the pointers (shown by default when enabled)
this.plugin.palmPointers.showPointers()

// Hide pointers. Note that the pointer values are still updated, this simply hides
// them visually
this.plugin.palmPointers.hidePointers()
```

## See also

- [pinchers](/ref/plugin/pinchers/) - A collection of events, properties, and helper styles for finger pinching
- [pinchScroll](/ref/plugin/pinchScroll/) - Scroll the page by pinching together your thumb and pointer finger




## Full plugin code

<<< @/src/plugin/hands/palmPointers.js


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
        handpose: false,

        plugin: {
          palmPointers: {enabled: true},
          pinchScroll: {enabled: true}
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
