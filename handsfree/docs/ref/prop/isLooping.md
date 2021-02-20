# Prop: `handsfree.isLooping`

This is used to maintain the state of the [main loop](/guide/the-loop/). It's set to `true` when running [handsfree.start()](/ref/method/start/) and set to `false` after [handsfree.pause()](/ref/method/pause/).

Setting `handsfree.isLooping = false` when the loop is running can be used to pause tracking while maintaining the webcam stream, which allows you to instantly restart the loop without needing to wait for another webcam stream to be initialized.

## Examples

```js
const handsfree = new Handsfree({weboji: true})
// Start tracking and set handsfree.isLooping to true
handsfree.start()

// Manually stop the loop
// - This is equivalent to running handsfree.pause()
handsfree.isLooping = false

// Manually restart the loop
// - This is equivalent to running handsfree.unpause()
handsfree.isLooping = true
handsfree.loop()
```

## See Also
- [handsfree.pause()](/ref/method/pause/)
- [handsfree.unpause()](/ref/method/unpause/)