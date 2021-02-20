/**
 * Handle messages from background script
 */
chrome.runtime.onMessage.addListener(function (message) {
  switch (message.action) {
    case 'handsfree-getConfig':
      chrome.runtime.sendMessage({
        action: 'handsfree-updateBackgroundConfig',
        config: handsfree.config
      })
      return
  }
})
