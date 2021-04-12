/* The following script was modified from a project originally
 * created by Aniket Eknath Kudale:
 * https://www.opensourceforu.com/2020/06/building-a-facial-expression-recognition-app-using-tensorflow-js/
 */

import "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/dist/face-api.js";

export function startVideo(init, animate) {
    /* Turns on the webcam, 
     * then passes the video stream to the emotion tracking AI
     */
    const constraints = {video: true};
    navigator.mediaDevices.getUserMedia(constraints)
    .then(videoStream => {
        // pass the video stream, as well as the robot setup functions
        trackExpressions(videoStream, init, animate);
    })
    .catch(error => {
        console.error('Error accessing camera devices.', error);
    });
}

const trackExpressions = (videoStream, init, animate) => {
    /* Continuously animate the robot w/ expressions found on the user */
    // 1. make a video from the web cam stream
    console.log(videoStream)
    const video = document.getElementById('faceStream');
    video.srcObject = videoStream;
    // 2. detect emotions
    let face = null;
    video.addEventListener('play', () => {
        setInterval(async() => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
            console.log(detections);
            // 3. init the face, if it hasn't already been
            if (face === null) {
                console.log("init the robot!")
                face = init();
                console.log(typeof face);
                animate();
                // face = model.getObjectByName( 'Head_4' );
            }
            // 4. otherwise animate the robot's angry, surprised, and sad expressions
            else if (face) {
                // console.log(typeof face);
                face.morphTargetInfluences[0] = detections[0].expressions.angry;
                face.morphTargetInfluences[1] = detections[0].expressions.surprised;
                face.morphTargetInfluences[2] = detections[0].expressions.sad;
            }
        }, 100);
    })
    // activate the detections
    video.play();
}
