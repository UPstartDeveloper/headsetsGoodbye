---
next: /ref/plugin/
prev: /ref/event/
---
# 💻 Methods

Each of the following are accessed through your instance, for example:

```js
const handsfree = new Handsfree({hands: true})

// Accessing the start method
handsfree.start()
```

- [.disablePlugins()](/ref/method/disablePlugins/) - Disables plugins by plugin tag
- [.emit()](/ref/method/emit/) - Triggers an event on the `document` with a `handsfree-` namespace
- [.enablePlugins()](/ref/method/enablePlugins/) - Enables plugins by plugin tag
- [.hideDebugger()](/ref/method/hideDebugger/) - Hides the visual feedback and adds helper classes to the body
- [.normalize()](/ref/method/normalize/) - A helper method to normalize values between 0 and 1
- [.on()](/ref/method/on/) - A helper method for listening to `.emit()` or browser events prefixed with `handsfree-`
- [.pause()](/ref/method/pause/) - Pauses the [main loop](/guide/the-loop/) without shutting off the webcam stream
- [.runPlugins()](/ref/method/runPlugins/) - Manually sets [handsfree.data](/ref/prop/data/) and runs all active plugins
- [.showDebugger()](/ref/method/showDebugger/) - Shows the visual feedback and adds helper classes to the body
- [.start()](/ref/method/start/) - Starts the [main loop](/guide/the-loop/) and begins tracking
- [.stop()](/ref/method/stop/) - Stops the [main loop](/guide/the-loop/) and tracking
- [.throttle()](/ref/method/throttle/) - An alias to [lodash.throttle](https://lodash.com/docs/4.17.15#throttle) function which is used to throttle (or limit the number of times) the passed function is called over a given amount of milliseconds
- [.TweenMax()](/ref/method/TweenMax/) - An alias to [gsap's TweenMax](https://greensock.com/tweenmax/) function which is used to tween (or smoothen) values over time
- [.unpause()](/ref/method/unpause/) - Unpauses the main loop
- [.update()](/ref/method/update/) - Updates your `handsfree.config` and loads any missing dependencies
- [.use()](/ref/method/use/) - Adds callback functions to the [main loop](/guide/the-loop/) that can be toggled on/off