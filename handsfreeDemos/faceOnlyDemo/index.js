import { makeCamera, renderCubes } from '../faceAndHands/environments/cubes.js';


export function startHandsAndThree() {
    // A: hide the cover card
    let card = document.getElementById("cover");
    card.classList.add('disappear');
    // B: add a div to the DOM before Three.js is loaded, to nest the canvas inside
    let canvasParent = document.createElement("div");
    canvasParent.id = "view";
    document.body.appendChild(canvasParent); // adds to the body element
    // C: make the view element at least long enough to fill the viewport
    canvasParent.style.minHeight = "100vh";
    // D: add the canvas
    let canvas = document.createElement('canvas');
    canvas.id = 'c';
    canvasParent.appendChild(canvas); // parents the canvas to the div created above
    // E: add the loading screen:
    /* the structure we are making below looks like the following HTML:
     *  <div id="loading">
     *     <div> 
     *       <div>...loading...</div>
     *     </div>
     *  </div>
     */
    let container = document.getElementsByClassName('container')[0];
    let loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading'; // using the CSS to style the progress bar
    container.appendChild(loadingDiv);
    // E: add the inner divs of the progress bar
    let innerDivOne = document.createElement('div');
    loadingDiv.appendChild(innerDivOne);
    let loadingText = document.createElement('div');
    loadingText.innerHTML = "...loading...";
    innerDivOne.appendChild(loadingText);
    // F: init handsfree object  
    window.handsfree = new Handsfree({
        facemesh: true,
        showDebug: true, // TODO: resize the debug video and canvas dynamically
    });
    window.handsfree.start();
    // G: activate face tracking
    document.addEventListener('handsfree-facemeshModelReady', () => {
        // A: make the loading element go away first
        loadingText.classList.add('disappear');
        // B: plugin to add face track functionality
        let camera = makeCamera();
        trackFace(window.handsfree, camera);
        // C: set up the Three.js environment, 
        renderCubes(camera);
    })
}

const trackFace = (handsfree, camera) => {
    // Create a new "plugin" to hook into the main loop
    // @see https://handsfree.js.org/guide/the-loop
    handsfree.use('lookHandsfree', ({facemesh}) => {
    if (!weboji?.degree?.[0]) return

    // Calculate rotation - adding because we assume camera is below eye level,
    // like on a laptop
    const rot = weboji.degree
    rot[0] -= 15

    // Calculate new position
    const pos = {
        // * -1 aligns the camera with head movement
        x: (weboji.translation[0] - .3) * 5, 
        y: (weboji.translation[1] - .3) * 5, 
        z: (weboji.translation[2]) + 8  
    }

    // Tween this values
    TweenMax.to(camera.position, .95, {
        x: pos.x,
        y: pos.y,
        z: pos.z
    })
    // console.log("position new " + pos.x + ", " + pos.y + ", " + pos.z)

    })
}

const trackHand = handsfree => {
    /* The following plugin adapted from Oz Ramos' code on Glitch: 
     * https://glitch.com/edit/#!/handsfree-jenga?path=handsfree%2FpinchClick.js%3A84%3A0 
     */
    handsfree.use('consoleLogger', (data) => {
        console.log(data.handpose);
    })
}

/****** DRIVER CODE *******/
// start the game when the user clicks "Start webcam"
const startBtn = document.getElementById("start-button");
startBtn.addEventListener("click", startHandsAndThree);