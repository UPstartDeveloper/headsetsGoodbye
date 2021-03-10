
export const startVisualDebugger = handsfree => {
    /**
     * Start the media stream, given a Handsfree object
     */
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    })
    .then(() => {
        // Add a canvas element on the DOM to receive the layers and stream 
        const $pipCanvas = document.createElement('CANVAS');
        $pipCanvas.id = "videoStreamer";
        document.body.appendChild($pipCanvas);
        console.log("Canvas is: " + $pipCanvas);
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
                        pipContext.drawImage(
                            handsfree.debug.$canvas[name], 
                            0, 0, $pipCanvas.width, $pipCanvas.height)
                        }
                    })
                }
            })
        })
    .catch((err) => {
        alert(`🚨 ${err} Please fix the error above and try again.`)
    })
}