---
next: /ref/util/
prev: /ref/plugin/
---
# 🧬 Properties

Each of the following are accessed through your instance, for example:

```js
const handsfree = new Handsfree({hands: true})

// Checking the current version
console.log(handsfree.version)
```

- [config](/ref/prop/config/) - Contains the sanitized object you passed into `new Handsfree(config)`
- [data](/ref/prop/data/) - Contains data for all the active models
- [debug](/ref/prop/debug/) - Contains references to the video and canvas elements that contain the webcam stream and skeleton and keypoint overlays
- [id](/ref/prop/id) - The ID for the current `Handsfree` instance
- [isLooping](/ref/prop/isLooping) - Whether the main loop is looping
- [model](/ref/prop/model) - A collection of all the models
- [plugin](/ref/prop/plugin) - A collection of all the plugins
- [taggedPlugins](/ref/prop/taggedPlugins) - A collection of all tagged plugins by tag
- [version](/ref/prop/version/) - Your version of Handsfree.js