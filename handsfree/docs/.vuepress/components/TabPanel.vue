<template lang="pug">
section.tab-panel(ref="panel")
  menu(role="tablist")
    li(role="tab" v-for="(tab, n) in tabs" :aria-selected="!n" :data-tab="tab")
      a.cursor-pointer(@click="selectTab(tab)") {{tab}}
  .window(role="tabpanel")
    .window-body
      slot
</template>

<script>
/**
 * Represents a TabPanel
 * 
 * <TabPanel :tabs="[]">
 *   <div data-panel="tabs[0]"></div>
 *   <div data-panel="tabs[1]" class="hidden"></div>
 *   <div data-panel="tabs[1]" class="hidden"></div>
 * </TabPanel>
 * 
 * @property {Array} tabs A list of titles for tabs
 */
export default {
  name: 'Tabs',

  props: ['tabs'],

  data: () => ({
  }),

  methods: {
    /**
     * Focus the selected tab
     */
    selectTab (tab) {
      this.$refs.panel.querySelector('[data-tab][aria-selected=true]').setAttribute('aria-selected', false)
      this.$refs.panel.querySelector(`[data-tab="${tab}"]`).setAttribute('aria-selected', true)
      
      this.$refs.panel.querySelector('[data-panel]:not(.hidden)').classList.add('hidden')
      this.$refs.panel.querySelector(`[data-panel="${tab}"]`).classList.remove('hidden')
    }
  }
}
</script>

<style lang="stylus">
.tab-panel
  margin 0.85rem 0
</style>