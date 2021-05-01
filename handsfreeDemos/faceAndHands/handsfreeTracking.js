// import { Handsfree } from "https://unpkg.com/handsfree@8.4.2/build/lib/handsfree.js";
import { makeCamera, renderCubes } from './environments/cubes.js';
import HandposeCPU from './HandposeCPU.js';


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
        handpose: true,
    });
    window.handsfree.start();
    // G: activate face tracking
    let camera;
    document.addEventListener('handsfree-facemeshModelReady', () => {
        // A: make the loading element go away first
        loadingText.classList.add('disappear');
        // B: plugin to add face track functionality
        camera = makeCamera();
        trackFaceMesh(window.handsfree, camera);
        // C: set up the Three.js environment, 
        renderCubes(camera);
    })
    // H: activate hand tracking
     document.addEventListener('handsfree-handposeModelReady', () => {
        // window.handsfree.update({handpose: true, showDebug: true, weboji: false});
        // C: set up the Three.js environment -- TODO: REMOVE if we are doing both hand and face tracking
        // loadingText.classList.add('disappear'); // loading text disappears
        // let camera = makeCamera();
        // let camera = makeCamera();
        // renderCubes(camera);
        // line below is what loads dependencies for handpose (and slows the app BIG TIME)
        // window.handsfree.model.handpose.enable(); 
        // TODO: fix hand tracking integration
        trackHand(window.handsfree);
        console.log("Added handpose model:" + window.handsfree.model.handpose);
    })
}

const trackFaceMesh = (handsfree, camera) => {
    // Create a new "plugin" to hook into the main loop
    // @see https://handsfree.js.org/guide/the-loop
    handsfree.use('logger', data => {
        // validate that we have face data
        if (!data.facemesh || !data.facemesh.multiFaceLandmarks) return
      
        // otherwise, calculate new position for the camera (1-face)
        const pos = {
            // * -1 aligns the camera with head movement
            x: (data.facemesh.multiFaceLandmarks[0][0].x -.5) * -5, 
            y: (data.facemesh.multiFaceLandmarks[0][0].y - .6) * -5, 
            z:  8  
        }

        // console.log(data.facemesh.multiFaceLandmarks[0][0]);

        // Tween this values
        TweenMax.to(camera.position, .95, {
            x: pos.x,
            y: pos.y,
            z: pos.z
        })
    })
}

const trackFaceWeboji = (handsfree, camera) => {
    // Create a new "plugin" to hook into the main loop
    // @see https://handsfree.js.org/guide/the-loop
    handsfree.use('lookHandsfree', ({weboji}) => {
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
    handsfree.use('moveCube', {
        config: {
            // Number of pixels that the finger/thumb tips must be within to trigger a click
            // Too low a value will not work due to errors
            pinchDistance: 40,

            // Number of frames after a release is detected to still consider as a drag (helps with tracking errors)
            numErrorFrames: 5
        },

        // Are the fingers pinched?
        pinched: false,
        // Have the fingers been released?
        released: false,
        // Whether the finger/thumb are considered pinched
        pinchThresholdMet: false,
        // Number of frames after a click is NOT detected to actually release the click (helps with errors)
        numErrorFrames: 5,

        /**
         * Detect click state and trigger a real click event
         * - This is the only method required for a plugin to work
         */
        onFrame({ hand }) {
            // Bail if no detection
            if (!hand || !hand.annotations) return

            // Detect if the thumb and indexFinger are pinched together
            const a = hand.annotations.indexFinger[3][0] - hand.annotations.thumb[3][0]
            const b = hand.annotations.indexFinger[3][1] - hand.annotations.thumb[3][1]
            const c = Math.sqrt(a*a + b*b)
            this.pinchThresholdMet = c < this.config.pinchDistance

            // Count number of frames since last pinch to help with errors
            if (this.pinchThresholdMet) {
            this.numErrorFrames = 0
            } else {
            ++this.numErrorFrames
            }

            // Simulate a mousemove (moving the block)
            if (this.pinched && this.numErrorFrames < this.config.numErrorFrames) {
            hand.pointer.state = 'mousemove'
            }

            // Simulate a mousedown (selecting a block)
            if (this.pinchThresholdMet && !this.pinched) {
            this.pinched = true
            this.released = false
            document.body.classList.add('handsfree-clicked')
            hand.pointer.state = 'mousedown'
            }

            // Simulate a mouseup (unpinch)
            if (!this.pinchThresholdMet && !this.released && this.numErrorFrames < this.config.numErrorFrames) {
            this.pinched = false
            this.released = true
            document.body.classList.remove('handsfree-clicked')
            hand.pointer.state = 'mouseup'
            }

            // Dispatch events
            window.renderer && hand.pointer.state && this.dispatchEvent(hand)
        },

        /**
         * The actual click method, this is what gets throttled
         */
        dispatchEvent(hand) {
            const $el = document.elementFromPoint(hand.pointer.x, hand.pointer.y)
            if ($el) {
            console.log("Cube selected: " + $el);
            window.renderer.domElement.dispatchEvent(
                new MouseEvent(hand.pointer.state, {
                    bubbles: true,
                    cancelable: true,
                    clientX: hand.pointer.x,
                    clientY: hand.pointer.y,
                    cube: $el // the cube itself
                })
            )
            hand.pointer.$target = $el
            }
        }
    })
}

/****** DRIVER CODE *******/
// start the game when the user clicks "Start webcam"
const startBtn = document.getElementById("start-button");
startBtn.addEventListener("click", startHandsAndThree);