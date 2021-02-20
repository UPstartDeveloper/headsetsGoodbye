# 🖖 Gestures

::: warning 🚧 Work in progress
The gesture API is still experimental. 
:::

## How it works

How it works

<div class="row align-top">
  <div class="col-6"></div>
  <div class="col-6">
    <Window title="Demo: Try Hand Gestures">
      <p>
        <span class="gesture-emoji" gesture="callMe">🤙</span>
        <span class="gesture-emoji" gesture="fist">👊</span>
        <span class="gesture-emoji" gesture="horns">🤘</span>
        <span class="gesture-emoji" gesture="love">🤟</span>
        <span class="gesture-emoji" gesture="ok">👌</span>
        <span class="gesture-emoji" gesture="pointUp">👆</span>
        <span class="gesture-emoji" gesture="pointRight">👉</span>
        <span class="gesture-emoji" gesture="pointDown">👇</span>
        <span class="gesture-emoji" gesture="pointDown">👈</span>
        <span class="gesture-emoji" gesture="spock">🖖</span>
        <span class="gesture-emoji" gesture="stop">🖐</span>
        <span class="gesture-emoji" gesture="thumbDown">👎</span>
        <span class="gesture-emoji" gesture="thumbUp">👍</span>
        <span class="gesture-emoji" gesture="victory">✌</span>
      </p>
      <div>
        <HandsfreeToggle class="full-width handsfree-hide-when-started-without-hands" text-off="Try Gesture Demo" text-on="Stop Hands Model" :opts="demoOpts" />
        <button class="handsfree-show-when-started-without-hands handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
        <button class="handsfree-show-when-started-without-hands handsfree-hide-when-loading" @click="startDemo"><Fa-Video /> Try Gesture Demo</button>
      </div>      
    </Window>
  </div>
</div>


<script>
import Demo from './'
export default Demo
</script>

<!-- Demo styles -->
<style lang="stylus">
  /* Emojis */
  .gesture-emoji
    font-size 28px
    display inline-block
    margin-right 10px
    margin-bottom 10px
    opacity 0.2

  .gesture-emoji.active
    opacity 1
</style>