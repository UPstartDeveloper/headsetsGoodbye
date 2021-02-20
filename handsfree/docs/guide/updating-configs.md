# 🎭 Updating and switching models

[handsfree.update(config, callback)](/ref/method/update/) can be used to update Handsfree in real time, even as it's actively running. The passed [config](/ref/prop/config/) will override the existing one, and the `callback` will get called after all new models are loaded (or immediately if all models are already loaded).

In addition to reconfiguring models you can also [enable/disable them](/ref/prop/model/#toggling-models-on-off/), as well as reconfigure plugins. Below is an example of switching off the [hands model](/ref/model/hands/) for the [weboji model](/ref/model/weboji/) and configuring the the [facePointer plugin](/ref/plugin/facePointer/):

```js
// Start the hands model with "browser" plugins
const handsfree = new Handsfree({hands: true})
handsfree.enablePlugins('browser')
handsfree.start()

// Switch to the weboji model and update the facePointer
handsfree.update({
  weboji: true,
  hands: false,

  plugin: {
    // Make the face pointer move slower
    facePointer: {
      speed: {
        x: .5,
        y: .5
      }
    }
  }
})

// Toggle a specific model on, loading missing dependencies
handsfree.model.handpose.enable(function () {
  handsfree.weboji.disable()
})
```

## See also

- [handsfree.model](/ref/prop/model/)