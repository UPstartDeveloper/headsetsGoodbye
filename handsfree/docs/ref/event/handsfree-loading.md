# Event: `handsfree-loading`

This event is triggered on the `document` after running `handsfree.start()`, right before the models are loaded. This event can be helpful in setting up loading screens.

## Receives


event
: An event object the webcam stream. Because this is an event the instance is stored in `event.detail`

## Example

```js
// Instantiate
const handsfree = new Handsfree({weboji: true})

// Listen for the event
document.addEventListener('handsfree-loading', (event) => {
  console.log(event.detail)
})
handsfree.on('loading', (event) => {
  console.log(event.detail)
})

// Start to trigger the event
handsfree.start()
```