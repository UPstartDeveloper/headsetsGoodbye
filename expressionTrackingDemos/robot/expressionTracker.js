/* The following script was modified from a project originally
 * created by Aniket Eknath Kudale:
 * https://www.opensourceforu.com/2020/06/building-a-facial-expression-recognition-app-using-tensorflow-js/
 */

import "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/dist/face-api.js";
// import * as neuralNets from "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights";

// A: Laod in the neural net for identifying and analyzing faces
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('./weights')
]).then(startVideo);

function startVideo() {
    /* Turns on the webcam
     * TODO: make sure to ask the user for consent!
     */
    navigator.mediaDevices.getUserMedia({ video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    ).then(trackExpressions(video));
}

const trackExpressions = () => {
    // Continuously animate the robot w/ expressions found on the user
    // const canvas = faceapi.createCanvasFromMedia(video)
    // document.body.append(canvas)
    // const displaySize = { width: video.width, height: video.height }
    // faceapi.matchDimensions(canvas, displaySize)
    setInterval(async() => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        console.log(detections);
        // const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100);
}