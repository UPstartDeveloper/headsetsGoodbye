# Method: `handsfree.unpause()`

```js
handsfree.unpause()
```

Unpauses the [main loop](/guide/the-loop/). This is different from [handsfree.start()](/ref/method/start/) which is used to initialize Handsfree and load dependencies, and should be used whenever [handsfree.isLooping](/ref/prop/isLooping/) is set to false (as is the case with [handsfree.pause()](/ref/prop/pause/)).


## Example

```js
const handsfree = new Handsfree({weboji: true})

// Manually stop the loop
handsfree.isLooping = false

// Unpause the loop
handsfree.unpause()
```

## See also

- [handsfree.isLooping](/ref/prop/isLooping/)
- [handsfree.pause()](/ref/method/pause/)