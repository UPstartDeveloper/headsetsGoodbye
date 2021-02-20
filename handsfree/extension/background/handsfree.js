/**
 * Setup Handsfree.js and the message bus
 */
const configOverrides = {
  assetsPath: '/build/lib/assets',
  showDebug: true
}
const handsfree = new Handsfree({
  weboji: true,
  hands: false,
  ...configOverrides
})

/**
 * Stream the canvases
 */
// This will receive the layers and stream
const $pipCanvas = document.createElement('CANVAS')
document.body.appendChild($pipCanvas)
const pipContext = $pipCanvas.getContext('2d')
pipContext.globalAlpha = .2

// This will be the video we pip
const $videoPip = document.createElement('VIDEO')
document.body.appendChild($videoPip)

handsfree.use('canvasUpdater', {
  onFrame () {
    // Merge all active models into a single layer
    pipContext.drawImage(handsfree.debug.$video, 0, 0, $pipCanvas.width, $pipCanvas.height)
    Object.keys(handsfree.model).forEach(name => {
      if (handsfree.model[name].enabled) {
        pipContext.drawImage(handsfree.debug.$canvas[name], 0, 0, $pipCanvas.width, $pipCanvas.height)
      }
    })
  }
})

/**
 * Send data to content scripts
 */
handsfree.use('contentScriptBus', {
  onFrame (data) {
    // Send data to content
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      for (var i = 0; i < tabs.length; ++i) {
        chrome.tabs.sendMessage(tabs[i].id, {action: 'handsfree-data', data})
      }
    })
  }
})

/**
 * Override requestAnimationFrame, which doesn't work in background script
 */
_requestAnimationFrame = requestAnimationFrame
requestAnimationFrame = newRequestAnimationFrame = function (cb) {
  setTimeout(function () {
    cb()
  }, 1000 / 30)
}

// Get handsfree config on tab change
chrome.tabs.onActivated.addListener(function (tabInfo) {
  chrome.tabs.sendMessage(tabInfo.tabId, {action: 'handsfree-getConfig'})
})

// Get handsfree config on page load
chrome.tabs.onUpdated.addListener(function (tabId) {
  chrome.tabs.sendMessage(tabId, {action: 'handsfree-getConfig'})
})

/**
 * Handle Handsfree events
 */
chrome.runtime.onMessage.addListener(function (message, sender, respond) {
  switch (message.action) {
    /**
     * Update the background script instance of handsfree
     */
    case 'handsfree-updateBackgroundConfig':
      const config = {
        ...message.config,
        ...configOverrides
      }
      const newConfig = {}
      const keys = Object.keys(config).filter(key => ['weboji', 'hands', 'facemesh', 'pose', 'handpose'].indexOf(key) >= 0)
      keys.forEach(key => newConfig[key] = config[key])
      
      newConfig.autostart = !!handsfree.isLooping
      handsfree.update(newConfig)
      return
    
    /**
     * Start Handsfree
     * - Starts picture in picture
     */
    case 'handsfreeStart':
      // Setup the picture in picture
      handsfree.on('data', () => {
        $pipCanvas.width = $videoPip.width = handsfree.debug.$video.width
        $pipCanvas.height = $videoPip.height = handsfree.debug.$video.height
        $videoPip.srcObject = $pipCanvas.captureStream()
        $videoPip.onloadedmetadata = () => {
          $videoPip.play()
        }
        $videoPip.onplay = () => {
          $videoPip.requestPictureInPicture()
        }
      }, {once: true})
      
      // Start Handsfree and set the badge
      chrome.storage.local.set({isHandsfreeStarted: true}, function () {
        handsfree.start()
        chrome.browserAction.setBadgeBackgroundColor({
          color: '#f00'
        })
        chrome.browserAction.setBadgeText({
          text: 'ON'
        })
      })
      return

    /**
     * Stop Handsfree
     */
    case 'handsfreeStop':
      chrome.storage.local.set({isHandsfreeStarted: false}, () => {
        handsfree.stop()
        chrome.browserAction.setBadgeText({text: ''})
      })
      return

    /**
     * Load a dependency into the current tab
     */
    case 'handsfreeLoadDependency':
      chrome.tabs.executeScript({file: message.file}, () => {
        Promise.resolve('').then(respond)
      })
      return true
  }
})

/**
 * Open the Options Page to prompt to capture the webcam feed
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['hasCapturedStream'], (data) => {
    chrome.storage.local.set({isHandsfreeStarted: false}, () => {
      if (!data.hasCapturedStream) {
        chrome.runtime.openOptionsPage()
      }
    })
  })
})
