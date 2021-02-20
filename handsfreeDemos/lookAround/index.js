$rig = document.querySelector('#rig')

// Let's use weboji. See: https://handsfree.js.org/ref/model/weboji
window.handsfree = new Handsfree({weboji: true})

// Used to hold tween values (without this things will be jerky)
tween = {yaw: 0, pitch: 0, roll: 0, x: 0, y: 0, z: 0}

// Create a new "plugin" to hook into the main loop
// @see https://handsfree.js.org/guide/the-loop
handsfree.use('lookHandsfree', ({weboji}) => {
  if (!weboji?.degree?.[0]) return

  // Calculate rotation
  const rot = weboji.degree
  rot[0] -= 15

  // Calculate position
  const pos = {
    x: (weboji.translation[0] - .5) * 10,
    y: (weboji.translation[1] - .5) * 5,
    z: 5 - weboji.translation[2] * 30
  }

  // Tween this values
  TweenMax.to(tween, 1, {
    yaw: -rot[0] * 1.5,
    pitch: -rot[1] * 1.5,
    roll: rot[2] * 1.5,
    x: pos.x,
    y: pos.y,
    z: pos.z
  })

  // Use the tweened values instead of the actual current values from webcam
  $rig.setAttribute('rotation', `${tween.yaw} ${tween.pitch} ${tween.roll}`)
  $rig.setAttribute('position', `${tween.x} ${tween.y} ${tween.z}`)
})
