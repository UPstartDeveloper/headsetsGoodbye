# Prop: `handsfree.model`

Contains a collection of interfaces for all the models supported by Handsfree (even one's you haven't enabled). Refer to the [individual models](/ref/model/) for more information on what methods and properties are available in each, and [Updating Configs](/guide/updating-configs/) to see how to reconfigure them.


## Toggling models on/off

Each model has a `.enable(callback)` and `.disable()` method allowing you to toggle the model on/off. If you `.enable(callback)` a model that hasn't been initialized yet then it will do so, loading any missing dependencies and running the `callback` once everything is loaded.

This can be used as an alternative to [handsfree.update()](/ref/method/update/) if you don't need to actually configure the model and are OK with [the defaults](/ref/prop/config/#the-full-list).

```js
const handsfree = new Handsfree({handpose: true})

handsfree.model.handpose.disable()
handsfree.model.weboji.enable()
handsfree.model.hands.enable()
```

## Manually getting data

Each model also has a `.getData()` method which can be used to get data for a single frame without a loop. For instance, this can be used to detect a pose on a button press.

```html
<button onclick="getData">Get Data</button>

<script>
const handsfree = new Handsfree({weboji: true})

function getData () {
  handsfree.model.weboji.getData().then(() => {
    console.log(data.rotation)
  })
}
</script>
```

## APIs

Each model can be referenced by name, and the original model APIs can be access through `handsfree.model[modelName].api` once the model has loaded its dependencies, allowing you to work directly with the model.

```js
handsfree.model.weboji.api
handsfree.model.handpose.api
handsfree.model.hands.api
handsfree.model.pose.api
handsfree.model.facemesh.api
```
