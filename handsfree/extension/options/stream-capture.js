/**
 * Start the media stream
 */
document.querySelector('#handsfree-approve').addEventListener('click', function () {
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  })
  .then(() => {
    chrome.storage.local.set({hasCapturedStream: true})
    window.close()
  })
  .catch((err) => {
    chrome.storage.local.set({hasCapturedStream: false})
    alert(`🚨 ${err}
    
Please fix the error above and try again.`)
  })
})