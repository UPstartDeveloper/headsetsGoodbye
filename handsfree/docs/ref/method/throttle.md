# Method: `handsfree.throttle`

```js
handsfree.throttle(callback, timeToWait, options)
```

This is an alias to [Lodash's throttle](https://lodash.com/docs/4.17.15#throttle) method, and is used by plugins to limit the number of times a function is passed. One use case is to improve performance by limiting the number of times a method is called.

Please see their documentation for all the available functionality.

## Example
```js
// Limit the number of times a model is run to 10 times a second (10 FPS)
const handsfree = Handsfree({hands: true})
const targetFPS = 10

handsfree.model.hands.getData = handsfree.throttle(
  handsfree.model.hands.getData,
  1000 / targetFPS
)

handsfree.start()
```