# Event: `handsfree-gotUserMedia`

This event is triggered on the `document` when the webcam's media stream is received. Currently this is only used for the [handpose model](/ref/model/handpose/) but will be applied to other models as well to unify the APIs.

The stream is also available in [handsfree.debug.stream](/ref/prop/debug/)

## Receives

event
: An event object the webcam stream. Because this is an event the stream is stored in `event.detail`

## Example

```js
// Instantiate
const handsfree = new Handsfree({handpose: true})

// Listen for the event
document.addEventListener('handsfree-gotUserMedia', (event) => {
  console.log(event.detail)
})
handsfree.on('gotUserMedia', (event) => {
  console.log(event.detail)
})

// Start handpose so that it gets the media stream
handsfree.start()
```