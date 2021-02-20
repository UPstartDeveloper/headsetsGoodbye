---
sidebarDepth: 2
---
# 🖖 Create Gesture

<div class="row align-top">
  <div class="col-6">
    <div class="custom-block tip">
      <p class="custom-block-title">TIP</p>
      <p>Video and documentation coming soon!</p>
    </div>
  </div>
  <div class="col-6">
    <Window title="Step 1: Choose a model">
      <section>
        <p>To begin, select a model below:</p>
        <p>
          <select ref="modelSelector" class="full-width" @change="updateModel">
            <option value="hands">🖐 MediaPipe Hands</option>
          </select>
        </p>
        <div class="model-button-container model-button-container-hands">
          <HandsfreeToggle class="full-width handsfree-hide-when-started-without-hands" text-off="Start Hands" text-on="Stop Hands Model" :opts="demoOpts.hands" />
          <button class="handsfree-show-when-started-without-hands handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
          <button class="handsfree-show-when-started-without-hands handsfree-hide-when-loading" @click="startDemo('hands')"><Fa-Video /> Start Hands</button>
        </div>
        <div class="model-button-container model-button-container-handpose hidden">
          <HandsfreeToggle class="full-width handsfree-hide-when-started-without-handpose" text-off="Start Handpose" text-on="Stop Handpose Model" :opts="demoOpts.handpose" />
          <button class="handsfree-show-when-started-without-handpose handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
          <button class="handsfree-show-when-started-without-handpose handsfree-hide-when-loading" @click="startDemo('handpose')"><Fa-Video /> Start Handpose</button>
        </div>
      </section>
    </Window>
  </div>
</div>

<Window title="Step 2: Collect samples">
  <div class="row align-top">
    <div class="col-6">
      <fieldset>
        <legend>Current Shape</legend>
        <!-- @fixme use textarea -->
        <ul ref="currentShapeBox" class="mt-0 mb-0 tree-view" style="min-height: 220px;">
          <li>&nbsp;</li>
          <li>&nbsp;</li>
          <li>&nbsp;</li>
          <li>&nbsp;</li>
          <li>&nbsp;</li>
          <li>&nbsp;</li>
          <li>&nbsp;</li>
        </ul>
      </fieldset>
    </div>
    <div class="col-6">
      <ol>
        <li>Select the number of hands required for this gesture to work</li>
        <li>Click the button below to record landmarks for 3 seconds</li>
        <li>Move your hands around slightly to capture subtle variations</li>
      </ol>
      <p>
        <fieldset>
          <legend>Number of hands</legend>
          <div class="field-row">
            <input id="radio-1-hands" type="radio" name="radio-number-hands" checked>
            <label for="radio-1-hands">1 Hand</label>
          </div>
          <div class="field-row">
            <input id="radio-2-hands" disabled type="radio" name="radio-number-hands">
            <label for="radio-2-hands">2 Hands</label>
          </div>
        </fieldset>
      </p>
      <div>
        <button ref="recordLandmarks" class="handsfree-hide-when-loading full-width" @click="startRecordingShapes">Record landmarks</button>
        <button disabled class="handsfree-show-when-loading"><Fa-Spinner spin /> Loading...</button>
      </div>
    </div>
  </div>
</Window>

<Window title="Step 3: Clean Data">
  <p>Click on any of the frames below that don't look right to remove them. The final gesture description does not use a neural network, so the number of samples isn't as important as the quality!</p>
  <div ref="recordingCanvasContainer" class="row align-top">
  </div>
</Window>

<Window title="Step 4: Gesture Description">
  <div class="row align-top">
    <div class="col-6">
      <fieldset>
        <legend>Gesture Description</legend>
        <textarea readonly ref="gestureDescriptionJSON" style="width: 100%" rows=20 :value="gesture | prettyPrintJSON"></textarea>
      </fieldset>
    </div>
    <div class="col-6">
      <div class="field-row-stacked">
        <label for="input-gesture-name"><strong>Gesture Name (no spaces):</strong></label>
        <input id="input-gesture-name" type="text" v-model="gesture.name" @input="onGestureNameUpdate" />
      </div>
      <br>
      <fieldset>
        <legend>Emphasize Fingers</legend>
        <div class="field-row">
          <input id="finger-weight-thumb" type="checkbox" name="radio-number-hands" v-model="fingerWeights.Thumb" @change="generateGestureDescription">
          <label for="finger-weight-thumb">Thumb</label>
        </div>
        <div class="field-row">
          <input id="finger-weight-index" type="checkbox" name="radio-number-hands" v-model="fingerWeights.Index" @change="generateGestureDescription">
          <label for="finger-weight-index">Index</label>
        </div>
        <div class="field-row">
          <input id="finger-weight-middle" type="checkbox" name="radio-number-hands" v-model="fingerWeights.Middle" @change="generateGestureDescription">
          <label for="finger-weight-middle">Middle</label>
        </div>
        <div class="field-row">
          <input id="finger-weight-ring" type="checkbox" name="radio-number-hands" v-model="fingerWeights.Ring" @change="generateGestureDescription">
          <label for="finger-weight-ring">Ring</label>
        </div>
        <div class="field-row">
          <input id="finger-weight-pinky" type="checkbox" name="radio-number-hands" v-model="fingerWeights.Pinky" @change="generateGestureDescription">
          <label for="finger-weight-pinky">Pinky</label>
        </div>
      </fieldset>
      <br>
      <fieldset>
        <legend>Confidence: <span v-html="gesture.confidence"></span></legend>
        <div class="field-row">
          <label for="range-confidence">0</label>
          <input id="range-confidence" type="range" step="0.25" min="0" max="10" value="7.5" @change="generateGestureDescription" v-model="gesture.confidence" />
          <label for="range-confidence">10</label>
        </div>
      </fieldset>
      <br>
      <fieldset>
        <legend>Mirroring</legend>
        <div class="field-row">
          <input id="mirror-horiz" type="checkbox" @change="generateGestureDescription" v-model="mirror.horiz" />
          <label for="mirror-horiz">Mirror horizontally</label>
        </div>
        <div class="field-row">
          <input id="mirror-vert" type="checkbox" @change="generateGestureDescription" v-model="mirror.vert" />
          <label for="mirror-vert">Mirror vertically</label>
        </div>
      </fieldset>
    </div>
  </div>
</Window>

<div class="row align-top">
  <div class="col-6">
    <Window title="Predicted Gesture">
      <div><strong>Name:</strong> <span v-html="currentGesture.name"></span></div>
      <div><strong>Confidence:</strong> <span v-html="currentGesture.confidence"></span></div>
    </Window>
  </div>
  <div class="col-6">
    <Window title="Clear and reset">
      <button @click="reset" class="full-width">Start a new gesture</button>
    </Window>
  </div>
</div>


<!-- Code -->
<script>
import CreateGesture from './create-gesture.js'
export default CreateGesture
</script>

<!-- Styles -->
<style lang="stylus">
.gesture-emoji
  font-size 30px
  display inline-block
  margin-right 10px
  margin-bottom 10px
  opacity 0.2

  &.active
    opacity 1

.landmark-canvas-wrap
  padding 3px
  box-sizing border-box
  
.landmark-canvas
  background #222
  width 100%
  transform scale(-1, 1)
  cursor pointer

  &:hover
    opacity 0.5
    background #666
  
  &.removed
    opacity 0.35
    background #999
</style>