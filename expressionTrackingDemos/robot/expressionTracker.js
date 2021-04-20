/* The following script was modified from a project originally
 * created by Aniket Eknath Kudale:
 * https://www.opensourceforu.com/2020/06/building-a-facial-expression-recognition-app-using-tensorflow-js/
 */

import "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/dist/face-api.js";

export function startVideo(init, animate) {
    /* Turns on the webcam, then passes the video stream 
     * to the emotion tracking AI.
     * @param {function} init: this assembles the robot scene using Three.js.
     * @param {function} animate: this enables the rendering loop for the robot.
     */
    // A: get the webcame
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
    // A: make a video from the web cam stream
    console.log(videoStream)
    const video = document.getElementById('faceStream');
    video.srcObject = videoStream;
    // B: detect emotions
    video.addEventListener('play', () => {
         // C: init the face
        init();
        animate(faceapi);
    })
    // E: activate the detections
    video.play();
}
