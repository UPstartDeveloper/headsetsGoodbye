# Event: `handsfree-modelError`

This event is triggered on the `document` when a model fails to load and receives an error message string. In the future this event will be used to try and self-correct the error (for instance, by trying to load dependencies that timed out).

## Receives

event
: An event object containing the error message. Because this is an event the message is stored in `event.detail`

## Example

```js
// Instantiate
const handsfree = new Handsfree({handpose: true})

// Listen for the event
document.addEventListener('handsfree-modelError', (event) => {
  console.log(event.detail)
})
handsfree.on('modelError', (event) => {
  console.log(event.detail)
})

// Start handpose (assume an error occurs)
handsfree.start()
```