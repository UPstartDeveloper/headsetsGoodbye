# Method: `handsfree.enablePlugins()`

```js
handsfree.enablePlugins(tags)
```

By default all the [core plugins](/ref/plugin/) are disabled. Currently all core plugins are centered around using the browser handsfree, so to enable them you'd use `handsfree.enablePlugins('browser')`.

When you [handsfree.use()](/ref/method/use/) you'll have the option of setting its tags. When running `handsfree.enablePlugins()` it will search through all plugins and enable the ones that contain any of those tags. If no tags are passed then all plugins are enabled.

This can be used along with [handsfree.disablePlugins()](/ref/method/disablePlugins/) to instantly swap out entire user experiences by tag.

## Parameters

tags: string | array
: (optional) A tag or list of tags in all plugins to enable. Pass `null` to enable them all.

## Example

```js
const handsfree = new Handsfree({hands: true})

// First enable all the browser plugins
handsfree.enablePlugins('browser')
```