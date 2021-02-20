---
prev: /ref/event/
---
# Event: `handsfree-data`

This event is triggered on the `document` on each frame after [handsfree.start()](/ref/method/start/). It receives an object containing data for each active model. This is a great way to work with the data in situations where you don't have access to your handsfree instance (for example, inside modules).

The data is available on [handsfree.data](/ref/prop/data/) or in the individual models at [handsfree.model.weboji.data](/ref/model/weboji/), [handsfree.model.handpose.data](/ref/model/handpose/)

## Receives

event
: An event object containing {[weboji](/ref/model/weboji/), [handpose](/ref/model/handpose/), [hands](/ref/model/hands/), [facemesh](/ref/model/facemesh/), [pose](/ref/model/pose/)} with data for each. Because this is an event the data is stored in `event.detail`

## Example

```js
// Instantiate
const handsfree = new Handsfree({weboji: true, handpose: true})

// Listen for the event
document.addEventListener('handsfree-data', (event) => {
  const data = event.detail
  console.log(data.weboji, data.handpose)
})
handsfree.on('data', (event) => {
  const data = event.detail
  console.log(data.weboji, data.handpose)
})

// Start collecting data
handsfree.start()
```