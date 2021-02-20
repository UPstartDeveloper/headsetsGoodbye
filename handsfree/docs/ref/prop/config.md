---
prev: /ref/prop/
---

# Prop: `handsfree.config`

Contains a sanitized copy of the object you instantiated Handsfree with:

```js
const config = {}
const handsfree = new Handsfree(config)

// Since you passed an empty object, this will contain all the defaults
console.log(handsfree.config)
```

The sanitization process simply adds default values for any options you specifically did not provide. Passing an empty object will result in `handsfree.config` having all the defaults [listed below](#the-full-list). The recommended way to update this config is with [handsfree.update](/ref/method/update/)

## Setup

### `.assetsPath`

**Default**: `https://unpkg.com/handsfree@8.4.0/build/lib/assets`

In order to keep page loads snappy the models are loaded only when needed, and because Handsfree.js is designed to power webapps they are hosted on a CDN. However, you can click here to [download a zip file containing the models](https://github.com/MIDIBlocks/handsfree/archive/master.zip) and copy over the `/build/lib/assets/` folder into your projects public folder to host them yourself.

With your models extracted, set the `assetsPath` to your folder:

```js
const handsfree = new Handsfree({
  weboji: true,
  assetsPath: '/my/public/assets/'
})

handsfree.start()
```
If there's an error, a [modelError event](/ref/event/modelError/) will be triggered and along with console message which you can use to zero in on the correct folder.

### `.isClient`

**Default:** `false`

Setting this to `true` will cause Handsfree.js to only load the plugins, and disables the loop. This is useful for when you want to run computer vision on another device or context, but run the plugins on the current device or context.

A common use case is to run Handsfree.js in the browser and stream the data to the desktop via websockets, for example, to control the desktop mouse pointer. Another use case is to run Handsfree.js plugins on a low powered device while running the models externally on a device with a GPU.

You'll need to manually call [handsfree.runPlugins(data)](/ref/method/runPlugins/) on the local device/context on each frame as there will be no loop.

### `.setup.canvas[modelName]`

**Default**:
```js
{
  // The canvas element to hold the skeletons and keypoints
  // - Will automatically get created and injected into .setup.wrap if null
  $el: null,

  // These are currently automatically set
  // width: 1280,
  // height: 720
}
```

### `.setup.video`

**Default**:
```js
{
  // The video element to hold the webcam stream
  // - Will automatically get created and injected into .setup.wrap if null
  $el: null,

  // These are currently automatically set by the model (see the model config)
  // width: 1280,
  // height: 720
}
```

### `.setup.wrap`

**Default**:
```js
{
  // The element that holds the video and canvas overlay
  // - Will automatically get created and injected into .setup.wrap if null
  $el: null,

  // The element to inject the setup wrapper into
  $parent: document.body
}
```



## Models

### `.hands` (2D)

See the [Hands Model](/ref/model/hands/#configuration) page

### `.handpose` (3D)

See the [Handpose Model](/ref/model/handpose/#configuration) page

### `.facemesh`

See the [Facemesh Model](/ref/model/facemesh/#configuration) page

### `.pose`

See the [Pose Model](/ref/model/pose/#configuration) page

### `.weboji`

See the [Weboji Model](/ref/model/weboji/#configuration) page


## Plugins

See the [individual plugin pages](/ref/plugin/) for possible configs. Like with models, you can pass in a Boolean to enable/disable them or an object to configure specific properties (don't forget to `.enable` it if you'd like it enabled):

```js
handsfree = new Handsfree({
  hands: true,
  weboji: true,
  
  plugin: {
    // Enable this plugin with defaults
    facePointer: true,

    // Enable this plugin with specific configs
    pinchScroll: {
      enabled: true,
      speed: 1
    }
  }
})
```


## The Full List

The following is a copy of the actual default object used by Handsfree.js. This page will be better organized, but for now please refer to the defaults below:

<<< @/src/defaultConfig.js