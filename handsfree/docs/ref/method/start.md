# Method: `handsfree.start()`

```js
handsfree.start(callback)
```

Loads tracker dependencies, starts the webcam, and starts the main loop. Calls an optional `callback` just before the first frame.

The document `body` receives `.handsfree-loading` before the models are actually loaded, giving you a chance to style custom loaders. Then a [handsfree-loading event](/ref/event/handsfree-loading/) is triggered on the document immediately after, allowing you to run any final logic before the models are actually loaded.

## Parameters

callback: function
: (optional) A function to call after dependencies are loaded but just before the first frame

## Example

```js
const handsfree = new Handsfree({weboji: true})
handsfree.start(() => {
  console.log('weboji started!')
})
```