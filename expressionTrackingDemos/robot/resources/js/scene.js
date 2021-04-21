/* The following script was modified from a project originally
 * created by Aniket Eknath Kudale:
 * https://www.opensourceforu.com/2020/06/building-a-facial-expression-recognition-app-using-tensorflow-js/
 */

// import function for robot setup
import { animate, init } from "./robot.js";
// import objects needed for expression tracking
import "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/dist/face-api.js";


export const loadComputerVision = () => {
    /*  Load in the neural networks for identifying and analyzing faces. */
    // A: Load in the neural nets
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('./weights'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./weights'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./weights'),
        faceapi.nets.faceExpressionNet.loadFromUri('./weights')
    // B: turn on the webcam, and setup the robot
    ]).then(startVideo(init, animate));
}

export function startVideo(init, animate) {
    /* Turns on the webcam, then passes the video stream 
     * to the emotion tracking AI.
     * @param {function} init: this assembles the robot scene using Three.js.
     * @param {function} animate: this enables the rendering loop for the robot.
     */
    // A: get the webcam
    const constraints = {video: true};
    navigator.mediaDevices.getUserMedia(constraints)
    // B: pass the video stream, as well as the robot setup functions to the AI
    .then(videoStream => {
        trackExpressions(videoStream, init, animate);
    })
    // C: log errors
    .catch(error => {
        console.error('Error accessing camera devices.', error);
    });
}

const trackExpressions = (videoStream, init, animate) => {
    /* Continuously animate the robot w/ expressions found on the user 
     * @param {MediaStream} videoStream: the video of the user's face
     * @param {function} init: this assembles the robot scene using Three.js.
     * @param {function} animate: this enables the rendering loop for the robot.
     */
    // A: go to the make a video from the web cam stream,
    console.log(videoStream)
    const video = document.getElementById('faceStream');
    video.srcObject = videoStream;
    // B: Add the robot to the scene
    init();
    // C: detect emotions
    video.addEventListener('play', () => {
         // D: Animate the robot!
        animate(faceapi);
    })
    // E: activate the detections
    video.play();
}


/********** Driver code **************/
const main = () => {
    // A: Load in the neural networks
    loadComputerVision();
    // B: Remove the loading screen
    let loadingContainer = document.getElementById("loading");
    loadingContainer.classList.add("hidden");
    // C: make the stop button visible
    let stopBtnContainer = document.getElementById("stopBtn");
    stopBtnContainer.classList.remove("hidden");
}
main();