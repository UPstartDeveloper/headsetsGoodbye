# Method: `handsfree.stop()`

```js
handsfree.stop()
```

Currently this just reloads the page 😅

## Example

```js
const handsfree = new Handsfree({weboji: true})

// Stop immediately after starting
handsfree.start(() => {
  handsfree.stop()
})
```