/* The following script was modified from a project originally
 * created by Aniket Eknath Kudale:
 * https://www.opensourceforu.com/2020/06/building-a-facial-expression-recognition-app-using-tensorflow-js/
 */

import "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/dist/face-api.js";

const startVideo = () => {
    /* Turns on the webcam, 
     * then passes the video stream to the emotion tracking AI
     */
    const constraints = {video: true};
    navigator.mediaDevices.getUserMedia(constraints)
    .then(videoStream => {
        trackExpressions(videoStream);
    })
    .catch(error => {
        console.error('Error accessing camera devices.', error);
    });
}

const trackExpressions = videoStream => {
    /* Continuously animate the robot w/ expressions found on the user */
    // 1. make a video from the web cam stream
    console.log(videoStream)
    const video = document.createElement('video');
    video.srcObject = videoStream;
    // 2. detect emotions
    setInterval(async() => {
        // const detections = await new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
        .then(detections => {
            console.log(detections);
            // TODO: 3. animate the robot
        });
    }, 100);
}

// A: Load in the neural net for identifying and analyzing faces
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('./weights')
// B: turn on the webcam
]).then(startVideo);