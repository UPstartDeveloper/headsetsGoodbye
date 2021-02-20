import merge from 'lodash/merge'

/**
 * The base plugin class
 * - When you do `handsfree.use()` it actually extends this class
 */
export default class Plugin {
  constructor(plugin, handsfree) {
    // Props
    this.plugin = plugin
    this.handsfree = handsfree

    // Copy properties and methods from plugin into class
    Object.keys(plugin).forEach((prop) => {
      this[prop] = plugin[prop]
    })

    // handsfree.config.plugin[name] overwrites plugin.config
    let handsfreePluginConfig = handsfree.config?.plugin?.[plugin.name]
    if (typeof handsfreePluginConfig === 'boolean') {
      handsfreePluginConfig = { enabled: handsfreePluginConfig }
    }

    // Disable plugins via new Handsfree(config)
    if (typeof handsfreePluginConfig === 'object') {
      merge(this.config, handsfreePluginConfig)
      if (typeof handsfreePluginConfig.enabled === 'boolean') {
        this.enabled = handsfreePluginConfig.enabled
      }
    }
  }

  /**
   * Toggle plugins
   */
  enable () {
    !this.enabled && this.onEnable && this.onEnable(this.handsfree)
    this.enabled = true
  }
  disable () {
    this.enabled && this.onDisable && this.onDisable(this.handsfree)
    this.enabled = false
  }
}
