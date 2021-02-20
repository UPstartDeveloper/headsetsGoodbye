# 🖐👀🖐 Introducing Handsfree.js - Integrate hand, face, and pose gestures to your frontend

::: tip Blog post
This intro was [originally written on Dev.to](https://dev.to/midiblocks/introducing-handsfree-js-integrate-hand-face-and-pose-gestures-to-your-frontend-4g3p)
:::

![Handsfree.js](https://media1.giphy.com/media/BBcnSU1IJ5tpQbwXDI/giphy.gif)

Hello and thank you for checking out this introductory post, I'm so excited to share Handsfree.js with you! Handsfree.js is a client side library that helps you add hand, face, and pose estimation to your front end projects in a snap ✨👌

Since this is an introductory post, I'll start by sharing some of the things I've made with it so that you can get an idea of what's possible. Once I've hopefully hyped you up a bit I'll then show you how to get started!

Handsfree.js can help you do quite a bit, and I'm using it to completely and totally handsfree-ify the web and therefore entire world around us. You can see how I plan to do that in my [Master Plan](https://handsfree.js.org/about/#master-plan) or you can see me actually doing it on [Twitter @Midiblocks](https://twitter.com/midiblocks).

OK! Let me show you what you can do with Handsfree.js ✨

---

## Examples

### Use it to trigger events

Just yesterday I released the [Pincher Plugin](https://handsfree.js.org/ref/plugin/pinchers.html) which emits 24+ pinching events with 3 states - `start`, `held`, `released` - for pinching with your index, middle, ring, and pinky fingers. It's modelled after the Mouse Events and you can listen to them similarly with `document.addEventListener()`: https://handsfree.js.org/ref/plugin/pinchers.html

![Pincher Plugin](https://media3.giphy.com/media/IHcXdVDrnpVnZqwq4z/giphy.gif)

### Use it to scroll pages handsfree

Here's a Browser Extension I'm working on that helps you scroll websites handsfree. It uses the [MediaPipe Hands model](https://handsfree.js.org/ref/model/hands.html) to track your hands. This GIF was actually really easy to make with the built in `pinchScroll plugin`, which enables this customizable functionality in a single line of code: https://handsfree.js.org/ref/plugin/pinchScroll.html

![Handsfree Browser Extension](https://media0.giphy.com/media/BSkodGjuwBPAEwxjGv/giphy.gif)

### Use it to create new kinds of Assistive Technologies

This is one of my favorites, and it uses the ["Face Pointer" plugin](https://handsfree.js.org/ref/plugin/facePointer.html) to allow you to move a pointer with your face, scroll pages, and click on things. It's powered by the [Jeeliz Weboji model](https://handsfree.js.org/ref/model/weboji.html) and a few face plugins.

![Face Pointers](https://media0.giphy.com/media/Iv2aSMS0QTy2P5JNCX/giphy.gif)

### Use it to control desktop games

Here's me playing "Into the Breach" on my desktop with Face Pointers and Hand Pointers. These are super easy to make too, all I did was use the Face and Hand Pointer plugins and then stream them over to my desktop with [Robot.js](https://robotjs.io/) to trigger native mouse events:

![Face Pointers Into the Breah](https://media1.giphy.com/media/eABiZprIEtouRZIc75/giphy.gif)

![Hand Pointers Into the Breach](https://media0.giphy.com/media/pdDOkUpnRbzMk8r0L4/giphy.gif)

![Handsfree Solitaire](https://media2.giphy.com/media/YATR9GZSSHKeNw3fht/giphy.gif)

### Use it to make your own games

But why just play games when you can make them too!? Here are a few games I've made, which I plan on grouping together into a "Mario Party" like game where you roll dice to move on a board and then play these minigames with your friends at the end of each round.

Here is "DuckFace Hunt", "Flappy Pose", and "Handsfree Jenga":

![DuckFace Hunt](https://media2.giphy.com/media/MWvfeCGV2MYmaRzvkP/giphy.gif)

![Flappy Pose](https://media2.giphy.com/media/hwNj7nfkDljmlnaNRA/giphy.gif)

![Handsfree Jenga](https://media4.giphy.com/media/brC1Ow2v62htVmpfLh/giphy.gif)

### Use it to control robots and drones

Of course, you're not limited to controlling things on the web or even desktop. With WebSockets you control anything connected to your computer, like this Universal Robot which I tried to puppeteer with my own head:

![Handsfree robot](https://media2.giphy.com/media/azwwFNLRXmZ1WnRzFT/giphy.gif)

![Handsfree UR5](https://media4.giphy.com/media/BHdfIcCsGCNlIAnKD7/giphy.gif)

### Use it for art, music, and other experiences

There's so much more that you can do! Here are some other experiments like my upcoming "Diffusionist" app designed to help you make trippy art to the beat of music ([check out my brand new Instagram for the audio version](https://www.instagram.com/p/CJbuxr_hpLH/)). I'm also making a WebXR DevTools Chrome Extension so that you can work on WebXR apps handsfree without XR equipment:

![Diffusionist](https://media0.giphy.com/media/erAsyoAJukeBfS9ila/giphy.gif)

![Handsfree A-Frame](https://media0.giphy.com/media/YOPrRX6vTy6tb3frgt/giphy.gif)

![Handsfree WebXR](https://media2.giphy.com/media/w3JUFtNyXNafLVrh6F/giphy.gif)

---

## Getting Started

Great! So now that I've shown you a little of what you can do, let me show you how. Don't worry if this is overwhelming at first, it's more of an overview. I'll have lots of shorter and more focused tutorials coming soon 🙏

If you [clone my repo](https://github.com/midiblocks/handsfree) (and please give it a star 🤗) you can find a boilerplate in `/boilerplate/cdn.html`. I'll have many more soon 😊

### Initializing and starting Handsfree

The easiest way to get started is with a CDN. If you'd like, you can create an HTML file and copy/paste this in without the need for a server:

```html
<head>
  <!-- Import helper classes and styles -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/handsfree@8.1.1/build/lib/assets/handsfree.css" />
</head>
<body>
  <!-- Import Handsfree.js in body (as it adds body classes) -->
  <script src="https://unpkg.com/handsfree@8.1.1/build/lib/handsfree.js"></script>

  <script>
    // Use the hand with defaults (and show the webcam with wireframes)
    handsfree = new Handsfree({
      showDebug: true,
      hands: true
    })

    // Start webcam and tracking (personally, I always like to ask first)
    handsfree.start()
  </script>
</body>
```

You can also import with NPM. By default this will still load the models from a CDN as they are quite large (some are over 10Mb), but I have instructions for ejecting the models into your assets folder here: [https://handsfree.js.org/#hosting-the-models-yourself](https://handsfree.js.org/#hosting-the-models-yourself)

```bash
npm i handsfree
```

```js
handsfree = new Handsfree({
  showDebug: true,
  
  // Use the hand model with custom config
  hands: {
    // Always make sure to enable them
    enabled: true,
    
    // Let's track up to 4 hands. It's best to be kind and ask permission first tho!
    maxNumHands: 4,
  }
})

// Start webcam and tracking (personally, I always like to ask first)
handsfree.start()
```

![basic demo](https://media2.giphy.com/media/xdcx0TLI7D7nS2SBTS/giphy.gif)

For the full list of config options you can pass into Handsfree, see: https://handsfree.js.org/ref/prop/config.html#the-full-list

### Working with the data

Of course that'll just show the wireframes over your hands, but it won't actually do anything yet. There are two main ways to work with Handsfree.js, and my preferred way is by creating plugins using [handsfree.use(newPluginName, callback)](https://handsfree.js.org/ref/method/use.html). I call them plugins because they "plug into" the main webcam loop that's started when you run `handsfree.start()`.

Plugins run their `callback` on every webcam frame and receive all the data from all the running computer vision models. Here's a very simple plugin that simply console logs data. I'll call it "logger":

```js
// Let's use our hands again
handsfree = new Handsfree({showDebug: true, hands: true})
handsfree.start()

// Let's create a plugin called "logger" to console.log the data
handsfree.use('logger', (data) => {
  // I like to always bail if there's no data,
  // which might happen if you swap out hands for the face later on
  if (!data.hands) return

  // Log the data  
  console.log(data.hands)

  // Do something if we are pinching with left [0] pinky [3]
  if (data.hands.pinchState[0][3] === 'held') {
    console.log('pinching with left pinky')
  }
})
```

Once you create a plugin, it becomes available at `handsfree.plugin.pluginName` and comes with a few methods and properties. Most importantly, they get a `.disable()` and `.enable()` method:

```js
handsfree.plugin.logger.enable()
handsfree.plugin.logger.disable()

// This is what the callback gets mapped to,
// and is what gets called on every frame that this plugin is enabled
handsfree.plugin.logger.onFrame
```

If you need more advanced functionality then you can pass an object with specific hooks that'll run during various phases of the plugin. For example:

```js
handsfree.use('advancedLogger', {
  // True by default
  enabled: true,

  // A list of strings for tagging this plugin.
  // Later you can bulk disable/enable these with: handsfree.enablePlugins(['tag1', 'tag2'])
  tags: [],
  
  // This special property can be adjusted later (or even before!) in various ways
  config: {},
  
  // Called immediately after the plugin is added, even if disabled
  // The `this` context is the plugin itself: handsfree.plugin.advancedLogger
  // If you need to create DOM elements or other setup, this is the method to do it in
  onUse () {},
  
  // Called when you .enable() this plugin
  onEnabled () {},
  // Called when you .disable() this plugin
  onEnabled () {}
})
```

### Using data without plugins

Sometimes you may only want to track just one frame, or use an image, canvas, or video element instead of a webcam, or you might be in a part of your app where you don't easily have access to your `handsfree` (like in node module). In these cases, you can just listen to events on the `document`.

Because these are events, the data you want is always in `ev.detail.data`

```js
// This will get called on every frame
document.addEventListener('handsfree-data', ev => console.log(ev.detail.data))

// Listen to when the thumb and index (0) are pinched on any hand
document.addEventListener('handsfree-finger-pinched-0')

// Listen to when the right (1) thumb and pinky (3) are pinched
document.addEventListener('handsfree-finger-pinched-1-3')
```

Also, know that you can always access the data directly on your `handsfree` instance:

```js
console.log(handsfree.data.hands)
```

---

## Updating models and plugins

The real magic of Handsfree.js is in its ability to _instantly_ swap out models and plugins. This is useful if different routes in your app have different handsfree user experiences. This is where the very powerful [handsfree.update(config)](https://handsfree.js.org/ref/method/update.html) comes into play. I use this everywhere on Handsfree.js.org to allow you to try out different demos without restarting the webcam.

`handsfree.use` takes in the same [Config Object](https://handsfree.js.org/ref/prop/config.html#the-full-list) as when you instantiate Handsfree, but it does a few extra things:

- It **stacks** changes, so if you only pass in `handsfree.update({facemesh: true})` while you have hands turned on then you'll end up with both
- It automatically handles loading in any required models and dependencies
- Gives you the ability to also configure plugins, or turn them off completely

Here's an example

```js
// Start with hands
const handsfree = new Handsfree({hands: true})
handsfree.start()

// Add facemesh
handsfree.update({facemesh: true})

// Replace both with pose
handsfree.update({
  hands: false,
  facemesh: false,
  pose: true
})

// Use Weboji and enable the Face Pointer plugins
handsfree.update({
  hands: false, facemesh: false, pose: false,
  weboji: true,

  plugin: {
    // Enable some plugins
    faceClick: true
    faceScroll: true,
    // Update the special .config properties of the plugins (this is so magical!)
    facePointer: {
      speed: {
        x: 2,
        y: 2
      }
    },
  }
})
```

You can also bulk disable and enable plugins, even by tag:

```js
// Disable and enable them all
handsfree.disablePlugins()
handsfree.enablePlugins()

// Disable all the "core" tagged plugins
handsfree.disablePlugins('core')

// Enable handsfree "browser" tagged plugins
handsfree.enablePlugins('browser')
```

Each of the [current plugins](https://handsfree.js.org/ref/plugin/) has a set of configs that you can update in real time. Just access their `.config` by name:

```js
// Change the Face Pointer speed
handsfree.plugin.facePointer.config.speed.x = 2
handsfree.plugin.facePointer.config.speed.y = 2

// Set the threshold for how much you have to smile to click (0 - 1)
handsfree.plugin.faceClick.config.morphs[0] = .25
```

---

## Classes

Anytime something happens within Handsfree.js, a class is added to the `document.body`. This makes styling your app or showing and hiding elements based on the state super easy. Here are where you can find them:

- Generic classes: https://handsfree.js.org/ref/util/classes.html
- Pinching states: https://handsfree.js.org/ref/plugin/pinchers.html#classes

---

## Thanks for reading 🙏

So that about covers the basics! I know that might have been overwhelming, but one of my New Year Resolutions is to write more and so I'll be releasing smaller, more focused tutorials about once a week covering one specific topic at a time.

I start my 2nd residency at the [STUDIO for Creative Inquiry](https://studioforcreativeinquiry.org/) this month where I'll be exploring new ways to apply Handsfree.js. It's my full time thing so please leave me a comment below or [stop by my Discord](https://discord.gg/JeevWjTEdu) so that I can help you integrate Handsfree.js in new and creative ways. 

If you'd like to learn a little bit about my story and what inspired me on this path 3 years ago, do check out my [GitHub Sponsors](https://github.com/sponsors/midiblocks). Thank you so much for reading this introduction, I can't wait to see what you do with [Handsfree.js](https://handsfree.js.org) 🖐👀🖐