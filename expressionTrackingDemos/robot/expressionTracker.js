/* The following script was modified from a project originally
 * created by Aniket Eknath Kudale:
 * https://www.opensourceforu.com/2020/06/building-a-facial-expression-recognition-app-using-tensorflow-js/
 */

import "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/dist/face-api.js";
// import * as neuralNets from "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights";

const startVideo = () => {
    /* Turns on the webcam
     * TODO: make sure to ask the user for consent!
     */
    const constraints = { video: {} };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(videoStream => {
        trackExpressions(videoStream);
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });
}

// A: Load in the neural net for identifying and analyzing faces
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('./weights')
]).then(startVideo);

const trackExpressions = videoStream => {
    /* Continuously animate the robot w/ expressions found on the user */
    // 1. make a video from the web cam stream
    console.log(videoStream)
    const video = document.createElement('video');
    // video.src = videoStream.getVideoTracks()[0];
    // video.src = videoStream;
    // 2. detect emotions
    setInterval(async() => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        console.log(detections);
        // const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100);
        // 3. play corresponding robot animations
}