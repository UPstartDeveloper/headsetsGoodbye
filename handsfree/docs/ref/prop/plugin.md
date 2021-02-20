# Prop: `handsfree.plugin`

Contains a collection of interfaces for all plugins. Refer to the [individual plugins](/ref/plugin/) for more information on what methods and properties are available in each, and [Updating Configs](/guide/updating-configs/) to see how to reconfigure them.

## Toggling plugins on/off

Each plugin has a `.enable()` and `.disable()` method allowing you to toggle the model on/off. Plugins that are enabled run their `handsfree.plugin[pluginName].onFrame()` on every frame.

This can be used as an alternative to [handsfree.update()](/ref/method/update/) if you don't need to actually configure the plugin and are OK with [the defaults](/ref/prop/config/#the-full-list).


```js
const handsfree = new Handsfree({hands: true})

handsfree.plugin.handPointers.enable()
```

## See also

- [🔌 Plugins and the main loop](/guide/the-loop/)