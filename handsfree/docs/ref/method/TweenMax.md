# Method: `handsfree.TweenMax`

```js
handsfree.TweenMax.to(tweenedValues, time, dataAndOptions)
```

This is an alias to [gsap's TweenMax](https://greensock.com/docs/v2/TweenMax) module, and is used by plugins to help smoothen model data through the `TweenMax.to()` method.

Please see their documentation for all the available functionality.

## Example

```js
// This will contained the tweened (current) values
const tween = {x: 0, y: 0}

this.handsfree.TweenMax.to(tween, 1, {
  // Step the x towards targetY
  x: targetY,
  // Step the x towards targetY
  y: targetY,

  // Do this now
  overwrite: true,
  ease: 'linear.easeNone',
  immediate: true
})

// Use the tweened values, not the target values
$pointer.style.left = `${tween.x}px`
$pointer.style.top = `${tween.y}px`
```