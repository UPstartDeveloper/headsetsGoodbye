<template lang="pug">
div.block-children
  button.handsfree-show-when-stopped.handsfree-hide-when-loading(@click='start')
    Fa-Video
    span {{textOff}}
  button.handsfree-show-when-loading(disabled)
    Fa-Spinner(:spin='true')
    span Loading...
  button.handsfree-hide-when-loading.handsfree-show-when-started.negative(@click='stop')
    Fa-VideoSlash
    span {{textOn}}
</template>

<script>
/**
 * @emits started Called when Handsfree.js has been started from this component
 */
export default {
  name: 'HandsfreeToggle',

  props: ['textOff', 'textOn', 'opts'],

  methods: {
    start () {
      this.$root.handsfree.update(this.$props.opts, () => {
        this.$emit('started')
      })
    },

    stop () {
      if (this.$listeners?.stop) {
        this.$emit('stop')
      } else {
        this.$root.handsfree.stop()
      }
    }
  }
}
</script>