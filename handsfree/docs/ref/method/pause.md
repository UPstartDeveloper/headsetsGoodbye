# Method: `handsfree.pause()`

```js
handsfree.pause()
```

Pauses the [main loop](/guide/the-loop/) while keeping the webcam stream active. By keeping the stream open, pausing allows you to instantly unpause without needing to wait for a new stream to be created.

In complex apps with multiple routes, loading screens, or processing heavy workflows the `handsfree.pause()` method helps you free resources until tracking is needed again.

Pausing can also be used in combination with start as a sort of "preloader" to load all dependencies for all models, making switching between models instant.

This is different from [handsfree.stop()](/ref/method/stop/), which ends the webcam stream completely.

## Example

```js
const handsfree = new Handsfree({weboji: true})

// Load dependencies and start the webcam, but don't start the loop
handsfree.start(() => {
  handsfree.pause()
})
```

## See also

- [handsfree.isLooping](/ref/prop/isLooping/)
- [handsfree.unpause()](/ref/method/unpause/)