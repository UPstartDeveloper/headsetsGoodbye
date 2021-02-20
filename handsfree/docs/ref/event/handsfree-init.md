# Event: `handsfree-init`

This event is triggered on the `document` after Handsfree is instantiated with `new Handsfree()`. It receives the `handsfree` instance, configured and ready to go. This is the only event that you can't listen to with [handsfree.on()](/ref/method/on/).

## Receives

event
: An event object containing the handsfree instance that was initialized. Because this is an event the instance is stored in `event.detail`

## Examples

### Listening on the document

```js
// Listen for the event
document.addEventListener('handsfree-init', (event) => {
  console.log('The initialized handsfree instance', event.detail)
})

// Instantiate
const handsfree = new Handsfree()
```