# Prop: `handsfree.id`

This isn't really used yet but will be used to help distinguish between different instances of `Handsfree`. The `id` is always sequential, and the first instance always has an `id` of 1.

## Example

```js
const handsfreeA = new Handsfree({weboji: true})
const handsfreeB = new Handsfree({handpose: true})

// logs: 1
console.log(handsfreeA.id)

// logs: 2
console.log(handsfreeB.id)
```