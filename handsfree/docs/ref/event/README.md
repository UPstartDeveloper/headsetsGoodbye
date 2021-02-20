---
next: /ref/method/
prev: /ref/model/
---
# ⚡ Events

You can listen to each of the following on the document. Because these are events the data will be in `event.detail`:

```js
// Listen on the document...
document.addEventListener('handsfree-data', event => {
  console.log(event.detail)
})

// ...or through the .on() method (without the 'handsfree-' prefix)
handsfree.on('data', ({detail}) => {
  console.log(detail)
})
```

- [handsfree-data](/ref/event/handsfree-data/) - Called anytime a model updates it's data
- [handsfree-gotUserMedia](/ref/event/gotUserMedia/) - Called when the webcam stream is started
- [handsfree-init](/ref/event/handsfree-init/) - Called after Handsfree has been instantiated with `new Handsfree()`
- [handsfree-loading](/ref/event/handsfree-loading/) - Called after `handsfree.start()` but before the models are loaded
- [handsfree-modelError](/ref/event/handsfree-modelError/) - Called when an error occurs while loading a model
- [handsfree-modelReady](/ref/event/handsfree-modelReady/) - Called when a model is loaded and ready to be used