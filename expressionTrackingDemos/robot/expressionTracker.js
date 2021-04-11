/* The following script was modified from a project originally
 * created by Aniket Eknath Kudale:
 * https://www.opensourceforu.com/2020/06/building-a-facial-expression-recognition-app-using-tensorflow-js/
 */

import "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/dist/face-api.js";

// A: Laod in the neural net for identifying and analyzing faces
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

function startVideo() {
    /* Turns on the webcam
     * TODO: make sure to ask the user for consent!
     */
    navigator.getUserMedia({ video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    );
}


setInterval(async() => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
    console.log(detections);
    // const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
}, 100);