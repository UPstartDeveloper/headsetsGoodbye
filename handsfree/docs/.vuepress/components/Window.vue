<template lang="pug">
.window.window-component.mb-md(ref='window')
  .title-bar(v-if='hasTitlebar')
    .title-bar-text(v-if='title') {{title}}
    .title-bar-controls(v-if='hasTitlebarControls')
      button(v-if='minimize' aria-label='Minimize' @click='onMinimize')
      button(v-if='maximize || minimize' aria-label='Restore' @click='onRestore')
      button(v-if='maximize' aria-label='Maximize' @click='onMaximize')
  .window-body
    slot
</template>

<script>
export default {
  name: 'Window',

  props: ['title', 'maximize', 'minimize'],

  computed: {
    hasTitlebar () {
      return this.hasTitlebarControls || this.title
    },
    hasTitlebarControls () {
      return this.maximize || this.minimize
    }
  },

  data: () => ({
    isMinimized: false,
    isMaximized: false,
  }),

  methods: {
    /**
     * Handle window resize
     */
    onMinimize () {
      this.$refs.window.classList.add('minimized')
      this.$refs.window.classList.remove('maximized')
      this.isMinimized = true
      this.isMaximized = false
    },

    onMaximize () {
      this.$refs.window.classList.add('maximized')
      this.$refs.window.classList.remove('minimized')
      this.isMinimized = false
      this.isMaximized = true
    },
    
    onRestore () {
      this.$refs.window.classList.remove('maximized', 'minimized')
      this.isMinimized = false
      this.isMaximized = false      
    },
  }
}
</script>