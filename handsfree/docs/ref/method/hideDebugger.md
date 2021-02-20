# Method: `handsfree.hideDebugger()`

```js
handsfree.hideDebugger()
```

Hides the debugger (the element containing the webcam feed and model canvases) and adds `body.handsfree-hide-debugger`. You can then use one of the debugger helper classes to automatically show or hide other elements based on this state:

```css
.handsfree-show-when-debugging
.handsfree-hide-when-debugging

.handsfree-show-when-not-debugging
.handsfree-hide-when-not-debugging
```

## Example

Here's an example of implementing debugger on/off buttons:

```html
<div>
  <button class="handsfree-show-when-not-debugging" onclick="handsfree.showDebugger()">
    Show Debugger
  </button>
  <button class="handsfree-show-when-debugging" onclick="handsfree.hideDebugger()">
    Hide Debugger
  </button>
</div>
```

## See Also

- [handsfree.showDebugger()](/ref/method/showDebugger/)
- [Helper Classes](/ref/util/classes/)