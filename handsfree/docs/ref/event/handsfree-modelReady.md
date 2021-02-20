---
next: /ref/method/
---
# Event: `handsfree-modelReady`

This event is triggered on the `document` when a model is ready to be used. In addition to `handsfree-modelReady` you can also use `handsfree-webojiModelReady`, `handsfree-handsModelReady`, `handsfree-poseModelReady`, `handsfree-facemeshModelReady`, and `handsfree-handposeModelReady` to zero in on specific models.

## Receives

event
: An event object containing the [model](/ref/prop/model/). Because this is an event the model is stored in `event.detail`

## Example

```js
// Instantiate
const handsfree = new Handsfree({hands: true, pose: true, weboji: true})

// Listen for the event
// - This will get called 3 times since 3 models are being loaded
document.addEventListener('handsfree-modelReady', (event) => {
  console.log(event.detail)
})
handsfree.on('modelReady', (event) => {
  console.log(event.detail)
})
handsfree.on('webojiModelReady', (event) => {
  console.log(event.detail)
})
handsfree.on('handsModelReady', (event) => {
  console.log(event.detail)
})

// Start handpose (assume an error occurs)
handsfree.start()
```