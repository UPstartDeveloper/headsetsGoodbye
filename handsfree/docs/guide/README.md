---
prev: /
next: /example/
---
# 📋 Guides

## Detailed Guides

The following is a collection of guides focusing on a specific feature or workflow of Handsfree.js and are recommended:

- [🔌 Plugins and the main loop](/guide/the-loop/) - Learn how to hook into the main loop to work with the model data
- [🎭 Updating configs and switching models](/guide/updating-config/) - Learn how to swap out and combine models and configs in real time

<br>

<Content :page-key="$site.pages.find(p => p.path === '/guide/misc/').key"/>


<style lang="stylus">
  // Fixes issue where home link pagers shows up as just "/" instead of "🏠 Home"
  .prev[href='/']
    color transparent
    &:after
      color $link
      content '🏠 Home'
      position relative
      left -.85em

  .page > div .content__default h1
    font-size 1.65rem
</style>
