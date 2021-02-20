# Method: `handsfree.use()`

```js
handsfree.use(pluginName, config)
```

This method creates a "plugin" and is the recommended way to work with Handsfree.js. For now, please see the detailed [🔌 Plugins and the main loop guide](/guide/the-loop/) to learn more about this powerful feature!

## Parameters

pluginName: String
: (required) The name of the `plugin` to create. If the name is taken then this will overwrite the existing plugin

config: Object | Function
: (required) An object containing the plugin definition, or a callback function to run on every frame

## Example

```js
const handsfree = new Handsfree({
  weboji: true,
  pose: true,
  hands: true
})

// A plugin that console logs your data on every frame
// - The callback is mapped to handsfree.plugin.consoleLogger.onFrame(data => {})
handsfree.use('consoleLogger', (data) => {
  console.log(data.weboji, data.pose, data.hands)
})
```

## Advanced example

```js
handsfree.use('consoleLogger', {
  // Whether the plugin is enabled or not
  // - If omitted, this will default to true
  enabled: true,

  // A list of strings that can be used to toggle this plugin on/off (see below)
  tags: [],

  // A set of config values that can be overwritten
  // - These can be set during instantiation (see below)
  config: {},

  // Called on every frame
  // - If you only pass a callback, it'll get assigned to this method
  onFrame (data) {
    console.log(data.weboji, data.pose, data.hands)
  },

  // Called immediate after this plugin is added (whether it's enabled or not)
  // - Use this for any setup, like creating DOM elements
  onUse (handsfree) {},

  // Called when the plugin is enabled from a disabled state
  // - eg, after calling: handsfree.plugin.myPlugin.enable()
  onEnable (handsfree) {},

  // Called when the plugin is disabled from an enabled state
  // - eg, after calling: handsfree.plugin.myPlugin.disable()
  onDisable (handsfree) {}
})
```

## See Also

- [Guide: 🔌 Plugins and the main loop](/guide/the-loop/)