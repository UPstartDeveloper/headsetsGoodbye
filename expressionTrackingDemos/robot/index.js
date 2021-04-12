// A: import function for robot setup
import { animate, init } from "./robot.js";
// B: import objects needed for expression tracking
import "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/dist/face-api.js";
import { startVideo } from "./expressionTracker.js";

// C: Load in the neural net for identifying and analyzing faces
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('./weights')
// D: turn on the webcam, and setup the robot
]).then(startVideo(init, animate));