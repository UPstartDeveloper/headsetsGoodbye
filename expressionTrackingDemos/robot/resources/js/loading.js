// import function for robot setup
import { animate, init } from "./robot.js";
// import objects needed for expression tracking
import "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/dist/face-api.js";
import { startVideo } from "./scene.js";

/********** STARTING THE EXPRESSION TRACKING FUNCTIONALITY **************/
export const loadComputerVision = () => {
    // A: Load in the neural net for identifying and analyzing faces
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('./weights'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./weights'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./weights'),
        faceapi.nets.faceExpressionNet.loadFromUri('./weights')
    // B: turn on the webcam, and setup the robot
    ]).then(startVideo(init, animate));
}

loadComputerVision();