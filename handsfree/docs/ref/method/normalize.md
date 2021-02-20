# Method: `handsfree.normalize()`

```js
handsfree.normalize(value, max, min)
```

This method can be used to normalize a value between 0 and 1. Another way of looking at this is that it turns `value` into a percentage. Once you have your normalized value, you can multiply it by the size of the space you want to map the value to.

Normalization is often used in plugins to map a point within the webcam (which is usually a much lower resolution than the actual window) to a point on the screen.


## Parameters

value: number
: (required) The value to normalize

max: number
: (required) The maximum value possible

tags: number
: (optional) The minimum value possible. Defaults to 0


## Example

```js
const handsfree = new Handsfree({handpose: true})

// Let's create a simple plugin to move a pointer with the palm
// - Note: This doesn't have any tweening so it'll be a bit jerky
handsfree.use('palmPointerBasic', {
  // Create the pointer element
  onUse () {
    this.$pointer = document.createElement('div')
    this.$pointer.classList.add('handsfree-pointer')
    this.$pointer.style.display = 'block'
    document.body.appendChild(this.$pointer)
    this.pointer = { x: -20, y: -20 }
  },

  // Map the palms pixel within the 640x480 video to a point on a 1280x960 screen
  onFrame ({handpose}) {
    if (!handpose.annotations) return
    
    let x = this.handsfree.normalize(
      // Get the current x within the video
      handpose.annotations.palmBase[0][0],
      // The maximum value is the video width
      this.handsfree.debug.$video.videoWidth
    )

    let y = this.handsfree.normalize(
      // Get the current y within the video
      handpose.annotations.palmBase[0][1],
      // The maximum value is the video height
      this.handsfree.debug.$video.videoHeight
    )

    // Now that x and y is between 0 and 1 (a percentage), we map it to the window
    x *= window.outerWidth
    y *= window.outerHeight

    // Flip x
    x = window.outerWidth - x
    
    // Position the pointer
    this.$pointer.style.left = `${x}px`
    this.$pointer.style.top = `${y}px`
    
    // Store this in the handpose models data so that it can be used in other plugins
    handpose.pointer = {x, y}
  }
})
```