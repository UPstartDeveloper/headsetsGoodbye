# Prop: `handsfree.debug`

This property contains references to all the debug elements used to hold the webcam stream and the skeleton and keypoint overlays. The following elements are all automatically created if you omit the [.setup config](/ref/prop/config/#setup-canvas) during instantiation.

## Properties

handsfree.debug.$canvas[modelName]: CANVAS
: The canvas element used for overlaying the skeleton/keypoints

handsfree.debug.context[modelName]: CANVAS
: The canvas context used for overlaying the skeleton/keypoints

handsfree.debug.$video: VIDEO
: The video element containing the webcam stream. You can access the stream directly with `handsfree.debug.$video.srcObject`. Currently this is only used by the [weboji model](/ref/model/weboji/) as each model handles the stream differently. This will be unified eventually!

handsfree.debug.$wrap: CANVAS
: The element that contains the canvases and video. If you need to move all the debug elements around in your DOM, this is the element to target

## Example

```js
const handsfree = new Handsfree({hands: true})
handsfree.start()

// Move the debuggers to a DIV#debug-window
document.querySelector('#debug-window').appendChild(handsfree.debug.$wrap)

// Apply a filter to the canvas
handsfree.debug.$canvas.weboji.style.filter = 'blur(4px)'
```