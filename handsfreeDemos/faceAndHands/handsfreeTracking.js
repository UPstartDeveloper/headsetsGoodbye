// import { Handsfree } from "https://unpkg.com/handsfree@8.4.2/build/lib/handsfree.js";
import { setupRace } from './index.js';
import { renderCubes } from './environments/cubes.js';


export function startHandsAndThree() {
    // hide the cover card
    let card = document.getElementById("cover");
    card.classList.add('disappear');
    // start handsfree face tracking
    window.handsfree = new Handsfree({weboji: true});
    handsfree.start();
    // add the div to the DOM before Three.js is loaded, nest the canvas inside
    let canvasParent = document.createElement("div");
    canvasParent.id = "view";
    document.body.appendChild(canvasParent); // adds to the body element
    // make the view element at least long enough to fill the viewport
    canvasParent.style.minHeight = "100vh";
    // add the canvas
    let canvas = document.createElement('canvas');
    canvas.id = 'c';
    canvasParent.appendChild(canvas); // parents the canvas to the div created above
    // add the the progress bar before Three.js is loaded
    /* the structure we are making below looks like the following HTML:
     *  <div id="loading">
     *     <div> 
     *       <div>...loading...</div>
     *       <div class="progress">
     *          <div id="progressbar"></div>
     *       </div>
     *     </div>
     *  </div>
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
    */ 
    // set up the Three.js environment
    // setupRace(trackFace, window.handsfree);
    renderCubes();
}

const trackFace = (handsfree, camera) => {
    // Used to hold initial position values
    let tween = {
        yaw: 0, 
        pitch: 0, 
        roll: 0, 
        x: camera.position.x, 
        y: camera.position.y, 
        z: camera.position.z
    }
    console.log("position original " + tween.x + ", " + tween.y + ", " +tween.z)

    // Create a new "plugin" to hook into the main loop
    // @see https://handsfree.js.org/guide/the-loop
    handsfree.use('lookHandsfree', ({weboji}) => {
    if (!weboji?.degree?.[0]) return

    // Calculate rotation
    const rot = weboji.degree
    rot[0] -= 15

    // Calculate new position
    const pos = {
        x: normalize(
            weboji.translation[0], 0, 0
        ), 
        y: normalize(weboji.translation[1], 5, 40), 
        z: normalize(weboji.translation[2], 40, 80)
    }

    // Tween this values
    TweenMax.to(camera.position, 2, {
        x: pos.x,
        y: pos.y,
        z: pos.z
    })
    console.log("position new " + pos.x + ", " + pos.y + ", " + pos.z)
    })
}

const normalize = (original, lower, upper) => {
    // ensures that a given values falls within a specified range
    return (original + upper - lower) 
}

/****** DRIVER CODE *******/
// start the game when the user clicks "Start webcam"
const startBtn = document.getElementById("start-button");
startBtn.addEventListener("click", startHandsAndThree);