# Method: `handsfree.runPlugins()`

```js
handsfree.runPlugins(data)
```

Manually sets [handsfree.data](/ref/prop/data/) and runs all enabled plugins. This method is generally only needed when you aren't using [The Loop](/guide/the-loop/), as is the case when you set [handsfree.config.isClient](/ref/prop/config/#isClient) to `true`. It's useful for when you want to run computer vision on another device or context, but run the plugins on the current device or context.

## Parameters

data: object
: (optional) The data to set. This must follow the data as described in [the models](/ref/model/)

## Example

### On device A

`Device A` has a powerful GPU with an attached webcam. It'll be used to run the computer vision inference and then stream the data to a Smart Watch.

```js
const handsfree = new Handsfree({hands: true})

// This will start a loop
handsfree.start()

// Send the data on each frame
handsfree.use('dataSender', data => {
  // This is a made up function that uses websockets to send data
  sendData(data)
})
```

### On device B

`Device B` is a device that can run JavaScript but doesn't have a webcam or GPU. Instead of running computer vision on this (which we can't) we'll instead receive the data and run our plugins with that.

Since there is no loop we'll need to handle this either by creating our own loop or by, for example, listening to websocket messages.

```js
const handsfree = new Handsfree({
  isclient: true,
  hands: true
})

// This will NOT start a loop, but will still configure the models and plugins
handsfree.start()

// Log the data we recieve
handsfree.use('dataLogger', data => {
  console.log(data)
})

// This is a made up function that uses websockets to receive data
onReceivedData(data => {
  handsfree.runPlugins(data)
})
```