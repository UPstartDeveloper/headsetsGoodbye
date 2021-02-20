/*
          ✨
          (\.   \      ,/)
            \(   |\     )/
            //\  | \   /\\
          (/ /\_#oo#_/\ \)
            \/\  ####  /\/
                \`##'


          🧙‍♂️ Presenting 🧙‍♀️

              Handsfree.js
                8.4.0

  Docs:       https://handsfree.js.org
  Repo:       https://github.com/midiblocks/handsfree
  Discord:    https://discord.gg/JeevWjTEdu
  Newsletter: http://eepurl.com/hhD7S1

  /////////////////////////////////////////////////////////////
  ///////////////////// Table of Contents /////////////////////
  /////////////////////////////////////////////////////////////

  Use "CTRL+F + #n" to hop around in this file
  
  #1 Setup
  #2 Loop
  #3 Plugins
  #4 Gestures
  #5 Events
  #6 Helpers
  #7 Debugger

*/

import HandsModel from './model/hands'
import FacemeshModel from './model/facemesh'
import PoseModel from './model/pose'
import HandposeModel from './model/handpose'
import WebojiModel from './model/weboji'
import PluginBase from './Plugin/base.js'
import GestureFingerpose from './Gesture/Fingerpose.js'
import defaultConfig from './defaultConfig.js'

import merge from 'lodash/merge'
import throttle from 'lodash/throttle'
import {TweenMax} from 'gsap/TweenMaxBase'

// Plugins
import pluginFacePointer from './plugin/weboji/facePointer'
import pluginFaceClick from './plugin/weboji/faceClick'
import pluginFaceScroll from './plugin/weboji/faceScroll'

import pluginPinchScroll  from './plugin/hands/pinchScroll'
import pluginPinchers  from './plugin/hands/pinchers'
import pluginPalmPointers  from './plugin/hands/palmPointers'

const corePlugins = {
  facePointer: pluginFacePointer,
  faceClick: pluginFaceClick,
  faceScroll: pluginFaceScroll,
  pinchScroll: pluginPinchScroll,
  pinchers: pluginPinchers,
  palmPointers: pluginPalmPointers,
}


/* ////////////////////////// #1 SETUP /////////////////////////

              ███████╗███████╗████████╗██╗   ██╗██████╗ 
              ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
              ███████╗█████╗     ██║   ██║   ██║██████╔╝
              ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝ 
              ███████║███████╗   ██║   ╚██████╔╝██║     
              ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     

///////////////////////////////////////////////////////////// */

// Used to separate video, canvas, etc ID's
let id = 0

/**
 * The Handsfree class
 */
class Handsfree {
  /**
   * Let's do this 🖐
   * @see https://handsfree.js.org/ref/prop/config
   * 
   * @param {Object} config The initial config to use
   */
  constructor (config = {}) {
    // Helpers
    this.throttle = throttle
    this.TweenMax = TweenMax
    
    // Assign the instance ID
    this.id = ++id
    this.version = '8.4.0'
    this.data = {}

    // Dependency management
    this.dependencies = {
      loading: [],
      loaded: []
    }
    // List of mediapipe models (by name) that are warming up
    this.mediapipeWarmups = {
      isWarmingUp: false,
      hands: false,
      pose: false,
      facemesh: false
    }

    // Plugins
    this.plugin = {}
    this.taggedPlugins = {
      untagged: []
    }

    // Gestures
    this.gesture = {}
    this.taggedGestures = {
      untagged: []
    }
    
    // Clean config and set defaults
    this.config = this.cleanConfig(config)

    // Setup
    this.setupDebugger()
    this.prepareModels()
    this.loadCorePlugins()

    // Start tracking when all models are loaded
    this.hasAddedBodyClass = false
    this.isUpdating = false
    this.numModelsLoaded = 0
    
    this.on('modelReady', () => {
      let numActiveModels = 0
      Object.keys(this.model).forEach(modelName => {
        this.model[modelName].enabled && ++numActiveModels
      })
      
      if (++this.numModelsLoaded === numActiveModels) {
        document.body.classList.remove('handsfree-loading')
        document.body.classList.add('handsfree-started')
        this.hasAddedBodyClass = true

        if (!this.config.isClient
          && (!this.isUpdating || 
            (this.isUpdating && this.config.autostart))) {
          this.isLooping = true
          this.loop()
        }
      }
    })

    this.emit('init', this)
  }

  /**
   * Prepares the models
   */
  prepareModels () {
    this.model = {
      weboji: {},
      hands: {},
      facemesh: {},
      pose: {},
      handpose: {}
    }
    this.model.weboji = new WebojiModel(this, this.config.weboji)
    this.model.hands = new HandsModel(this, this.config.hands)
    this.model.pose = new PoseModel(this, this.config.pose)
    this.model.facemesh = new FacemeshModel(this, this.config.facemesh)
    this.model.handpose = new HandposeModel(this, this.config.handpose)
  }

  /**
   * Cleans and sanitizes the config, setting up defaults
   * @see https://handsfree.js.org/ref/method/cleanConfig
   * 
   * @param config {Object} The config object to use
   * @param defaults {Object} (Optional) The defaults to use.
   *    If null, then the original Handsfree.js defaults will be used
   * 
   * @returns {Object} The cleaned config
   */
  cleanConfig (config, defaults) {
    // Set default
    if (!defaults) defaults = Object.assign({}, defaultConfig)
    
    defaults.setup.wrap.$parent = document.body

    // Map model booleans to objects
    if (typeof config.weboji === 'boolean') {
      config.weboji = {enabled: config.weboji}
    }
    if (typeof config.hands === 'boolean') {
      config.hands = {enabled: config.hands}
    }
    if (typeof config.facemesh === 'boolean') {
      config.facemesh = {enabled: config.facemesh}
    }
    if (typeof config.pose === 'boolean') {
      config.pose = {enabled: config.pose}
    }
    if (typeof config.handpose === 'boolean') {
      config.handpose = {enabled: config.handpose}
    }

    // Map plugin booleans to objects
    config.plugin && Object.keys(config.plugin).forEach(plugin => {
      if (typeof config.plugin[plugin] === 'boolean') {
        config.plugin[plugin] = {enabled: config.plugin[plugin]}
      }
    })

    // Map gesture booleans to objects
    config.gesture && Object.keys(config.gesture).forEach(gesture => {
      if (typeof config.gesture[gesture] === 'boolean') {
        config.gesture[gesture] = {enabled: config.gesture[gesture]}
      }
    })

    return merge({}, defaults, config)
  }

  /**
   * Updates the instance, loading required dependencies
   * @see https://handsfree.js.org./ref/method/update
   * 
   * @param {Object} config The changes to apply
   * @param {Function} callback Called after
   */
  update (config, callback) {
    this.config = this.cleanConfig(config, this.config)
    this.isUpdating = true

    // Run enable/disable methods on changed models
    ;['hands', 'facemesh', 'pose', 'handpose', 'weboji'].forEach(model => {
      let wasEnabled = this.model[model].enabled
      this.config[model] = this.model[model].config = merge({}, this.model[model].config, config[model])

      if (wasEnabled && !this.config[model].enabled) this.model[model].disable()
      else if (!wasEnabled && this.config[model].enabled) this.model[model].enable(false)
    })

    // Enable plugins
    config.plugin && Object.keys(config.plugin).forEach(plugin => {
      if (typeof config.plugin[plugin].enabled === 'boolean') {
        if (config.plugin[plugin].enabled) {
          this.plugin[plugin].enable()
        } else {
          this.plugin[plugin].disable()
        }
      }
    })

    // Enable gestures
    config.gesture && Object.keys(config.gesture).forEach(gesture => {
      if (typeof config.gesture[gesture].enabled === 'boolean') {
        if (config.gesture[gesture].enabled) {
          this.gesture[gesture].enable()
        } else {
          this.gesture[gesture].disable()
        }
      }
    })
    
    // Start
    if (!this.config.isClient && this.config.autostart) {
      this.start(callback)
    } else {
      callback && callback()
    }
  }




/* /////////////////////////// #2 LOOP /////////////////////////

                  ██╗      ██████╗  ██████╗ ██████╗ 
                  ██║     ██╔═══██╗██╔═══██╗██╔══██╗
                  ██║     ██║   ██║██║   ██║██████╔╝
                  ██║     ██║   ██║██║   ██║██╔═══╝ 
                  ███████╗╚██████╔╝╚██████╔╝██║     
                  ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝     
  
/////////////////////////////////////////////////////////////// */


  

  /**
   * Starts the trackers
   * @see https://handsfree.js.org/ref/method/start
   * 
   * @param {Function} callback The callback to run before the very first frame
   */
  start (callback) {
    // Cleans any configs since instantiation (particularly for boolean-ly set plugins)
    this.config = this.cleanConfig(this.config, this.config)
    this.isUpdating = false

    // Start loading
    document.body.classList.add('handsfree-loading')
    this.emit('loading', this)

    // Call the callback once things are loaded
    if (callback) {
      this.on('modelReady', callback, {once: true})
    }
    
    // Load dependencies
    this.numModelsLoaded = 0
    Object.keys(this.model).forEach(modelName => {
      const model = this.model[modelName]
      
      if (model.enabled && !model.dependenciesLoaded) {
        model.loadDependencies()
      } else if (model.enabled) {
        this.emit('modelReady', model)
        this.emit(`${modelName}ModelReady`, model)
      }
    })

    // Enable initial plugins
    Object.keys(this.config.plugin).forEach(plugin => {
      if (typeof this.config.plugin?.[plugin]?.enabled === 'boolean' && this.config.plugin[plugin].enabled) {
        this.plugin[plugin].enable()
      }
    })

    // Enable initial gestures
    Object.keys(this.config.gesture).forEach(gesture => {
      if (typeof this.config.gesture?.[gesture]?.enabled === 'boolean' && this.config.gesture[gesture].enabled) {
        this.gesture[gesture].enable()
      }
    })
  }

  /**
   * Stops tracking
   * - Currently this just stops the tracker
   * 
   * @see https://handsfree.js.org/ref/method/stop
   */
  stop () {
    location.reload()
  }

  /**
   * Pauses inference to free up resources but maintains the
   * webcam stream so that it can be unpaused instantly
   * 
   * @see https://handsfree.js.org/ref/method/pause
   */
  pause () {
    this.isLooping = false
  }

  /**
   * Resumes the loop from an unpaused state
   * 
   * @see https://handsfree.js.org/ref/method/pause
   */
  unpause () {
    if (!this.isLooping) {
      this.isLooping = true
      this.loop()
    }
  }

  /**
   * Called on every webcam frame
   * @see https://handsfree.js.org/ref/method/loop
   */
  loop () {
    // Get model data
    Object.keys(this.model).forEach(modelName => {
      const model = this.model[modelName]
      if (model.enabled && model.dependenciesLoaded) {
        model.getData()
      }
    })

    // Emit data
    this.emit('data', this.data)

    // Run untagged plugins
    this.taggedPlugins.untagged?.forEach(pluginName => {
      this.plugin[pluginName].enabled && this.plugin[pluginName]?.onFrame(this.data)
    })

    // Render video behind everything else
    // - Note: Weboji uses its own camera
    if (this.isDebugging) {
      const isUsingCamera = ['hands', 'pose', 'handpose', 'facemesh'].find(model => {
        if (this.model[model].enabled) {
          return model
        }
      })

      if (isUsingCamera) {
        this.debug.context.video.drawImage(this.debug.$video, 0, 0, this.debug.$canvas.video.width, this.debug.$canvas.video.height)
      }
    }

    this.isLooping && requestAnimationFrame(() => this.isLooping && this.loop())
  }

  
  


/* //////////////////////// #3 PLUGINS /////////////////////////

      ██████╗ ██╗     ██╗   ██╗ ██████╗ ██╗███╗   ██╗███████╗
      ██╔══██╗██║     ██║   ██║██╔════╝ ██║████╗  ██║██╔════╝
      ██████╔╝██║     ██║   ██║██║  ███╗██║██╔██╗ ██║███████╗
      ██╔═══╝ ██║     ██║   ██║██║   ██║██║██║╚██╗██║╚════██║
      ██║     ███████╗╚██████╔╝╚██████╔╝██║██║ ╚████║███████║
      ╚═╝     ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝

  /////////////////////////////////////////////////////////////*/

  /**
   * Adds a callback (we call it a plugin) to be called after every tracked frame
   * @see https://handsfree.js.org/ref/method/use
   *
   * @param {String} name The plugin name
   * @param {Object|Function} config The config object, or a callback to run on every fram
   * @returns {Plugin} The plugin object
   */
  use (name, config) {
    // Make sure we have an options object
    if (typeof config === 'function') {
      config = {
        onFrame: config
      }
    }

    config = merge({},
      {
        // Stores the plugins name for internal use
        name,
        // The model to apply this plugin to
        models: [],
        // Plugin tags for quickly turning things on/off
        tags: [],
        // Whether the plugin is enabled by default
        enabled: true,
        // A set of default config values the user can override during instanciation
        config: {},
        // (instance) => Called on every frame. The callback is mapped to this
        onFrame: null,
        // (instance) => Called when the plugin is first used
        onUse: null,
        // (instance) => Called when the plugin is enabled
        onEnable: null,
        // (instance) => Called when the plugin is disabled
        onDisable: null
      },
      config
    )

    // Sanitize
    if (typeof config.models === 'string') {
      config.models = [config.models]
    }

    // Setup plugin tags
    if (typeof config.tags === 'string') {
      config.tags = [config.tags]
    }
    config.tags.forEach(tag => {
      if (!this.taggedPlugins[tag]) this.taggedPlugins[tag] = []
      this.taggedPlugins[tag].push(name)
    })
    
    // Create the plugin
    this.plugin[name] = new PluginBase(config, this)
    this.plugin[name].onUse && this.plugin[name].onUse()

    // Store a reference to the plugin to simplify things
    if (config.models.length) {
      config.models.forEach(modelName => {
        this.model[modelName].plugins.push(name)
      })
    } else {
      this.taggedPlugins.untagged.push(name)
    }
  
    return this.plugin[name]
  }

  /**
   * Enable plugins by tags
   * @see https://handsfree.js.org/ref/method/enablePlugins
   * 
   * @param {string|object} tags (Optional) The plugins with tags to enable. Enables all if null
   */
  enablePlugins (tags) {
    // Sanitize
    if (typeof tags === 'string') tags = [tags]
    if (!tags) tags = Object.keys(this.taggedPlugins)

    tags.forEach(tag => {
      this.taggedPlugins[tag].forEach(pluginName => {
        this.plugin[pluginName].enable()
      })
    })
  }

  /**
   * Disable plugins by tags
   * @see https://handsfree.js.org/ref/method/disablePlugins
   * 
   * @param {string|object} tags (Optional) The plugins with tags to disable. Disables all if null
   */
  disablePlugins (tags) {
    // Sanitize
    if (typeof tags === 'string') tags = [tags]
    if (!tags) tags = Object.keys(this.taggedPlugins)

    tags.forEach(tag => {
      this.taggedPlugins[tag].forEach(pluginName => {
        this.plugin[pluginName].disable()
      })
    })
  }

  /**
   * Run plugins manually
   * @param {Object} data The data to run
   */
  runPlugins (data) {
    this.data = data

    // Add start class to body
    if (this.config.isClient && !this.hasAddedBodyClass) {
      document.body.classList.add('handsfree-started')
      this.hasAddedBodyClass = true
    }
    
    // Run model plugins
    Object.keys(this.model).forEach(name => {
      this.model[name].data = data?.[name]
      this.model[name].runPlugins()
    })
    
    // Run untagged plugins
    this.taggedPlugins.untagged?.forEach(pluginName => {
      this.plugin[pluginName].enabled && this.plugin[pluginName]?.onFrame(this.data)
    })
  }

  
  


/* //////////////////////// #4 GESTURES /////////////////////////

 ██████╗ ███████╗███████╗████████╗██╗   ██╗██████╗ ███████╗███████╗
██╔════╝ ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗██╔════╝██╔════╝
██║  ███╗█████╗  ███████╗   ██║   ██║   ██║██████╔╝█████╗  ███████╗
██║   ██║██╔══╝  ╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝  ╚════██║
╚██████╔╝███████╗███████║   ██║   ╚██████╔╝██║  ██║███████╗███████║
 ╚═════╝ ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝
                                                                   
  /////////////////////////////////////////////////////////////*/

  /**
   * Adds a callback to be called whenever a gesture is detected
   * @see https://handsfree.js.org/ref/method/useGesture
   * 
   * @param {Object} config The config object
   * @returns {Gesture} The gesture object
   */
  useGesture (config) {
    config = merge({},
      {
        // Stores the gestures name for internal use
        name: 'untitled',
        // The description
        description: [],
        // The model this gesture works with
        models: [],
        // Gesture tags for quickly turning them on/off
        tags: [],
        // Whether the gesture is enabled or not
        enabled: true,
      },
      config
    )

    // Sanitize
    if (typeof config.models === 'string') {
      config.models = [config.models]
    }

    // Setup gesture tags
    if (typeof config.tags === 'string') {
      config.tags = [config.tags]
    }
    config.tags.forEach(tag => {
      if (!this.taggedGestures[tag]) this.taggedGestures[tag] = []
      this.taggedGestures[tag].push(config.name)
    })

    // Create the gesture
    switch (config.algorithm) {
      case 'fingerpose':
        this.gesture[config.name] = new GestureFingerpose(config, this)
        break
    }

    // Store a reference to the gesture to simplify things
    if (config.models.length) {
      config.models.forEach(modelName => {
        this.model[modelName].gestures.push(config.name)
        this.model[modelName].updateGestureEstimator()
      })
    } else {
      this.taggedGestures.untagged.push(config.name)
    }

    return this.gesture[config.name]
  }

  /**
   * Enable gestures by tags
   * @see https://handsfree.js.org/ref/method/enableGestures
   * 
   * @param {string|object} tags (Optional) The gestures with tags to enable. Enables all if null
   */
  enableGestures (tags) {
    // Sanitize
    if (typeof tags === 'string') tags = [tags]
    if (!tags) tags = Object.keys(this.taggedGestures)

    tags.forEach(tag => {
      this.taggedGestures[tag].forEach(gestureName => {
        this.gesture[gestureName].enable()
      })
    })
  }

  /**
   * Disable Gestures by tags
   * @see https://handsfree.js.org/ref/method/disableGestures
   * 
   * @param {string|object} tags (Optional) The Gestures with tags to disable. Disables all if null
   */
  disableGestures (tags) {
    // Sanitize
    if (typeof tags === 'string') tags = [tags]
    if (!tags) tags = Object.keys(this.taggedGestures)

    tags.forEach(tag => {
      this.taggedGestures[tag].forEach(gestureName => {
        this.gesture[gestureName].disable()
      })
    })
  }




/* ///////////////////////// #5 EVENTS /////////////////////////

      ███████╗██╗   ██╗███████╗███╗   ██╗████████╗███████╗
      ██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
      █████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   ███████╗
      ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ╚════██║
      ███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   ███████║
      ╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
                                                    
///////////////////////////////////////////////////////////// */
  


  /**
   * Triggers a document event with `handsfree-${eventName}`
   * @see https://handsfree.js.org/ref/method/emit
   * 
   * @param {String} eventName The name of the event
   * @param {*} detail (optional) Data to send with the event
   */
  emit (eventName, detail = null) {
    const event = new CustomEvent(`handsfree-${eventName}`, {detail})
    document.dispatchEvent(event)
  }

  /**
   * Calls a callback on `document` when an event is triggered
   * @see https://handsfree.js.org/ref/method/on
   *
   * @param {String} eventName The `handsfree-${eventName}` to listen to
   * @param {Function} callback The callback to call
   * @param {Object} opts The options to pass into addEventListener (eg: {once: true})
   */
  on (eventName, callback, opts) {
    document.addEventListener(`handsfree-${eventName}`, (ev) => {
      callback(ev.detail)
    }, opts)
  }



/* //////////////////////// #6 HELPERS /////////////////////////

    ██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ ███████╗
    ██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗██╔════╝
    ███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝███████╗
    ██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║
    ██║  ██║███████╗███████╗██║     ███████╗██║  ██║███████║
    ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝
                                                              
  /////////////////////////////////////////////////////////////*/



  /**
   * Helper to normalze a value within a max range
   * @see https://handsfree.js.org/ref/method/normalize
   * 
   * @param {Number} value The value to normalize
   * @param {Number} max The maximum value to normalize to, or the upper bound
   * @param {Number} min The minimum value to normalize to, or the lower bound
   */
  normalize (value, max, min = 0) {
    return (value - min) / (max - min)
  }

  /**
   * Gets the webcam media stream into handsfree.debug.$video
   * @see https://handsfree.js.org/ref/method/getUserMedia
   * 
   * @param {Object} callback The callback to call after the stream is received
   */
  getUserMedia (callback) {
    // Start getting the stream and call callback after
    if (!this.debug.stream && !this.debug.isGettingStream) {
      // Use the weboji stream if already active
      if (this.model.weboji?.api?.get_videoStream) {
        this.debug.$video = this.model.weboji.api.get_video()
        this.debug.$video.srcObject = this.debug.stream = this.model.weboji.api.get_videoStream()
        this.emit('gotUserMedia', this.debug.stream)
        callback && callback()

      // Create a new media stream
      } else {
        this.debug.isGettingStream = true
        navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: {
              facingMode: 'user',
              width: this.debug.$video.width,
              height: this.debug.$video.height
            }
          })
          .then((stream) => {
            this.debug.$video.srcObject = this.debug.stream = stream
            this.debug.$video.onloadedmetadata = () => {
              this.debug.$video.play()
              this.emit('gotUserMedia', stream)
              callback && callback()
            }
          })
          .catch((err) => {
            console.error(`Error getting user media: ${err}`)
          })
          .finally(() => {
            this.debug.isGettingStream = false
          })
      }

    // If a media stream is getting gotten then run the callback once the media stream is ready
    } else if (!this.debug.stream && this.debug.isGettingStream) {
      callback && this.on('gotUserMedia', callback)
    
    // If everything is loaded then just call the callback
    } else {
      this.debug.$video.play()
      this.emit('gotUserMedia', this.debug.stream)
      callback && callback()
    }
  }

  /**
   * Loads all the core plugins (see #6)
   */
  loadCorePlugins () {
    Object.keys(corePlugins).forEach(name => {
      this.use(name, corePlugins[name])
    })    
  }


/* //////////////////////// #7 DEBUGGER ////////////////////////

██████╗ ███████╗██████╗ ██╗   ██╗ ██████╗  ██████╗ ███████╗██████╗ 
██╔══██╗██╔════╝██╔══██╗██║   ██║██╔════╝ ██╔════╝ ██╔════╝██╔══██╗
██║  ██║█████╗  ██████╔╝██║   ██║██║  ███╗██║  ███╗█████╗  ██████╔╝
██║  ██║██╔══╝  ██╔══██╗██║   ██║██║   ██║██║   ██║██╔══╝  ██╔══██╗
██████╔╝███████╗██████╔╝╚██████╔╝╚██████╔╝╚██████╔╝███████╗██║  ██║
╚═════╝ ╚══════╝╚═════╝  ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝
                                                                   
  /////////////////////////////////////////////////////////////*/



  /**
   * Sets up the video and canvas elements
   */
  setupDebugger () {
    this.debug = {}
    
    // debugger wrap
    if (!this.config.setup.wrap.$el) {
      const $wrap = document.createElement('DIV')
      $wrap.classList.add('handsfree-debugger')
      this.config.setup.wrap.$el = $wrap
    }
    this.debug.$wrap = this.config.setup.wrap.$el

    // Create video element
    if (!this.config.setup.video.$el) {
      const $video = document.createElement('VIDEO')
      $video.setAttribute('playsinline', true)
      $video.classList.add('handsfree-video')
      $video.setAttribute('id', `handsfree-video-${this.id}`)
      this.config.setup.video.$el = $video
    }
    this.debug.$video = this.config.setup.video.$el
    this.debug.$video.width = this.config.setup.video.width
    this.debug.$video.height = this.config.setup.video.height
    this.debug.$wrap.appendChild(this.debug.$video)

    // Context 2D canvases
    this.debug.$canvas = {}
    this.debug.context = {}
    this.config.setup.canvas.video = {
      width: this.debug.$video.width,
      height: this.debug.$video.height
    }

    // The video canvas is used to display the video
    ;['video', 'weboji', 'facemesh', 'pose', 'hands', 'handpose'].forEach(model => {
      this.debug.$canvas[model] = {}
      this.debug.context[model] = {}
      
      let $canvas = this.config.setup.canvas[model].$el
      if (!$canvas) {
        $canvas = document.createElement('CANVAS')
        this.config.setup.canvas[model].$el = $canvas
      }
      
      // Classes
      $canvas.classList.add('handsfree-canvas', `handsfree-canvas-${model}`, `handsfree-hide-when-started-without-${model}`)
      $canvas.setAttribute('id', `handsfree-canvas-${model}-${this.id}`)

      // Dimensions
      this.debug.$canvas[model] = this.config.setup.canvas[model].$el
      this.debug.$canvas[model].width = this.config.setup.canvas[model].width
      this.debug.$canvas[model].height = this.config.setup.canvas[model].height
      this.debug.$wrap.appendChild(this.debug.$canvas[model])

      // Context
      if (['weboji', 'handpose'].includes(model)) {
        this.debug.$canvas[model].classList.add('handsfree-canvas-webgl')
      } else {
        this.debug.context[model] = this.debug.$canvas[model].getContext('2d')  
      }
    })
    
    // Append everything to the body
    this.config.setup.wrap.$parent.appendChild(this.debug.$wrap)

    // Add classes
    if (this.config.showDebug) {
      this.showDebugger()
    } else {
      this.hideDebugger()
    }
  }

  /**
   * Shows the debugger
   */
  showDebugger () {
    this.isDebugging = true
    document.body.classList.add('handsfree-show-debug')
    document.body.classList.remove('handsfree-hide-debug')
  }

  /**
   * Hides the debugger
   */
  hideDebugger () {
    this.isDebugging = false
    document.body.classList.remove('handsfree-show-debug')
    document.body.classList.add('handsfree-hide-debug')
  }
}

export default Handsfree