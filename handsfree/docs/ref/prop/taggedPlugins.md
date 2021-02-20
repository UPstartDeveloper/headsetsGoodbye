# Prop: `handsfree.taggedPlugins`

Contains a collection of all tagged plugin names by tag. Plugins without tags are stored in `handsfree.taggedPlugins.untagged`. This is mostly used internally for the [handsfree.enablePlugins()](/ref/method/enablePlugins/) and [handsfree.disablePlugins()](/ref/method/disablePlugins/) methods but is exposed just incase you need it!

## Example

```js
const handsfree = new Handfree({weboji: true})

handsfree.use('pluginA', {tag: ['tagA']})
handsfree.use('pluginB', {tag: ['tagA', 'tagB']})
handsfree.use('pluginC', {})
```

Assuming no core plugins are loaded, the above would produce:

```js
handsfree.taggedPlugins == {
  tagA: ['pluginA', 'pluginB'],
  tagB: ['pluginB']
}
```

You could then do things with the collection of plugins, like so:

```js
// Re-run all plugin onUse() methods
handsfree.taggedPlugins.tagA.forEach((pluginName) => {
  handsfree.plugin[pluginName]?.onUse()
})
```