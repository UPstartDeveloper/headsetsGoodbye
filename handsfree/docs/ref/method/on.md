# Method: `handsfree.on()`

```js
handsfree.on(eventName, callback, opts)
```

Listens to an event on the document with `handsfree-${eventName}`. This is basically a helper to:

```js
document.addEventListener(`handsfree-${eventName}`, (event) => {
  callback(event.detail)
}, opts)
```

Because this is listening to events, the data will be in the `event.detail` property.

## Parameters

eventName: string
: (required) The event name to listen to, without the `handsfree-` prefix

callback: function
: (required) The callback to call. Receives an `event` object

opts: object
: (optional) Options to pass into [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters), like `{once: true}`

## Example

```js
const handsfree = new Handsfree({hands: true})

// Work with data without creating a plugin
handsfree.on('data', (event) => {
  const data = event.detail
  console.log(data.hands)
})

handsfree.start()
```