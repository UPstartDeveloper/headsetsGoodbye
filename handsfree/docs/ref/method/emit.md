# Method: `handsfree.emit()`

```js
handsfree.emit(eventName, data)
```

Triggers a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) named `handsfree-${eventName}` on the `document`. It's essentially a shortcut to the following:

```js
const event = new CustomEvent(`handsfree-${eventName}`, {detail: data})
document.dispatchEvent(event)
```

## Parameters

eventName: string
: (required) The name of the event to call, prefixed with `handsfree-`

data: any
: (optional) Data to send with the event

## Example

```js
const handsfree = new Handsfree({weboji: true})

// Listen to the event
document.addEventListener('handsfree-myEvent', (event) => {
  // logs: 123
  console.log(event.detail)
})

// Emit the event
handsfree.emit('myEvent', 123)
```