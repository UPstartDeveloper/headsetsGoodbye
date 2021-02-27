// import { Handsfree } from "https://unpkg.com/handsfree@8.4.2/build/lib/handsfree.js";
import { setupRace } from './index.js';


export function startHandsAndThree() {
    // hide the cover card
    let card = document.getElementById("cover");
    card.classList.add('disappear');
    // start handsfree face tracking
    window.handsfree = new Handsfree({weboji: true});
    handsfree.start();
    // add the canvas before Three.js is loaded
    /* the structure we are making below looks like the following HTML:
     *  <div id="loading">
     *     <div> 
     *       <div>...loading...</div>
     *       <div class="progress">
     *          <div id="progressbar"></div>
     *       </div>
     *     </div>
     *  </div>
     */
    let canvas = document.createElement('canvas');
    canvas.id = 'c';
    document.body.appendChild(canvas); // adds the canvas to the body element
    // add the the progress bar before Three.js is loaded
    let container = document.getElementsByClassName('container')[0];
    let loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading'; // using the CSS to style the progress bar
    container.appendChild(loadingDiv);
    // add the inner divs of the progress bar
    let innerDivOne = document.createElement('div');
    loadingDiv.appendChild(innerDivOne);
    let loadingText = document.createElement('div');
    loadingText.innerHTML = "...loading...";
    innerDivOne.appendChild(loadingText);
    // show the actual progress bar
    let progressDiv = document.createElement('div');
    progressDiv.className = "progress";
    innerDivOne.appendChild(progressDiv);
    let progressBar = document.createElement('div');
    progressBar.id = "progressbar";
    progressDiv.appendChild(progressBar); 
    // set up the Three.js environment
    camera = setupRace();
    // initialize Handsfree face tracking
    trackFace(window.handsfree, camera);
}

const trackFace = (handsfree, camera) => {
    // Used to hold tween values (without this things will be jerky)
    let tween = {yaw: 0, pitch: 0, roll: 0, x: 0, y: 0, z: 0}

    // Create a new "plugin" to hook into the main loop
    // @see https://handsfree.js.org/guide/the-loop
    handsfree.use('lookHandsfree', ({weboji}) => {
    if (!weboji?.degree?.[0]) return

    // Calculate rotation
    const rot = weboji.degree
    rot[0] -= 15

    // Calculate position
    const pos = {
        x: (weboji.translation[0] - .5) * 10,
        y: (weboji.translation[1] - .5) * 5,
        z: 5 - weboji.translation[2] * 30
    }

    // Tween this values
    TweenMax.to(tween, 1, {
        yaw: -rot[0] * 1.5,
        pitch: -rot[1] * 1.5,
        roll: rot[2] * 1.5,
        x: pos.x,
        y: pos.y,
        z: pos.z
    })

    // Use the tweened values instead of the actual current values from webcam
    camera.setAttribute('rotation', `${tween.yaw} ${tween.pitch} ${tween.roll}`)
    camera.setAttribute('position', `${tween.x} ${tween.y} ${tween.z}`)
    })
}

// start the game when the user clicks "Start webcam"
const startBtn = document.getElementById("start-button");
startBtn.addEventListener("click", startHandsAndThree);