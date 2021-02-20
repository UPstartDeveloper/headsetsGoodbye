---
next: /ref/plugin/
---

# Method: `handsfree.useGesture()`

```js
handsfree.useGesture(gestureName, description, config)
```

This method adds a new gesture to Handsfree.js.

## Parameters

gestureName: String
: (required) The name of the `gesture` to create. If the name is taken then this will overwrite the existing gesture

description: Object
: (required) A JSON object which describes the gesture

config: Object
: (required) An object containing the gesture configuration