//import * as THREE from './node_modules/three/build/three.module.js';
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

/* global Split */

// This code is only related to handling the split.
// Our three.js code has not changed
Split(['#view', '#controls'], {  // eslint-disable-line new-cap
  sizes: [75, 25],
  minSize: 100,
  elementStyle: (dimension, size, gutterSize) => {
    return {
      'flex-basis': `calc(${size}% - ${gutterSize}px)`,
    };
  },
  gutterStyle: (dimension, gutterSize) => {
    return {
      'flex-basis': `${gutterSize}px`,
    };
  },
});


// rendering the scene
const main = () => {
    // A: get the canvas element (what we'll be drawing upon)
    const canvas = document.querySelector("#c");
    // B: instaniate the renderer (to do the drawing)
    const renderer = new THREE.WebGLRenderer({canvas});
    // C: instantiate the camera
    const fov = 60;  // fov = "field of view"
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 200;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // move the camera to look down on the box
    camera.position.z = 30;
    // D: instantiate a scene - anything we want to draw gets added to it
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");
    // parent the camera to a pole - this pole is our selfie-stick,
    // so we can spin the pole around the scene to move the camera
    const cameraPole = new THREE.Object3D();
    scene.add(cameraPole);
    cameraPole.add(camera);
    // E: make the geometry for a box
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    // F: Adding 100 random cubes to the scene
    // generating a single random number in a specified range
    const rand = (min, max) => {
      // returns a random number between max and min
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return min + (max - min) * Math.random();
    }
    // defines the hue and saturation for the color randomly
    const randomColor = () => {
      return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
    }
    /* Generating 100 cubes with random colors, positions, orientations,
    * and scales. 
    */
    const numObjects = 100;
    for (let i = 0; i < numObjects; ++i) {
      const material = new THREE.MeshPhongMaterial({
        color: randomColor(),
      });
    
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
    
      cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
      cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
      cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
    }
    // resize the canvas to prevent poor resolution
    const resizeRendererToDisplaySize = renderer => {
        // get the current dimensions of the canvas (on the HTML document)
        const view = document.querySelector("#view");
        // calculate the canvas' pixel area, account for HD-DPI pixel ratios
        const pixelRatio = window.devicePixelRatio;
        const width = view.clientWidth * pixelRatio | 0;
        const height = view.clientHeight * pixelRatio | 0;
        // determine if the canvas' (pixel area) needs to be resized
        const needResize = canvas.width !== width || canvas.height !== height;
        // resize the canvas to the same area as currently seen on the screen
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }
    /* this class encapsulates all we need to manage "picking" */
    class PickHelper {
      constructor() {
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;
      }
      pick(normalizedPosition, scene, camera, time) {
        // restore the color if there is a picked object
        if (this.pickedObject) {
          this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
          this.pickedObject = undefined;
        }
    
        // cast a ray through the frustum
        this.raycaster.setFromCamera(normalizedPosition, camera);
        // get the list of objects the ray intersected
        const intersectedObjects = this.raycaster.intersectObjects(scene.children);
        if (intersectedObjects.length) {
          // pick the first object. It's the closest one
          this.pickedObject = intersectedObjects[0].object;
          // save its color
          this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
          // set its emissive color to flashing red/yellow
          this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
        }
      }
    }
    // init the position of the object we're picking
    const pickPosition = {x: 0, y: 0};
    clearPickPosition();
    
    function getCanvasRelativePosition(event) {
      // get the x and y coordinates of the user's pointer
      const rect = canvas.getBoundingClientRect();
      return {
        // normalize the coordinates
        x: (event.clientX - rect.left) * canvas.width  / rect.width,
        y: (event.clientY - rect.top ) * canvas.height / rect.height,
      };
    }
    
    function setPickPosition(event) {
      // find the position of the object to pick
      const pos = getCanvasRelativePosition(event);
      pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
      pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
    }
    
    function clearPickPosition() {
      // unlike the mouse which always has a position
      // if the user stops touching the screen we want
      // to stop picking. For now we just pick a value
      // unlikely to pick something
      pickPosition.x = -100000;
      pickPosition.y = -100000;
    }
    
    // WEB: track the mouse's movement - so we know which object is being picked
    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);
    // MOBILE: track the movement of fingers
    window.addEventListener('touchstart', (event) => {
      // prevent the window from scrolling
      event.preventDefault();
      setPickPosition(event.touches[0]);
    }, {passive: false});
    window.addEventListener('touchmove', (event) => {
      setPickPosition(event.touches[0]);
    });
    window.addEventListener('touchend', clearPickPosition);
    // F: add a directional light
    const color = 0xFFFFFF;  // just use white light for now
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
    // put the light on the camera, so the light will moves with it
    camera.add(light);
    // instantiate an object picker, so we can change object colors
    const pickHelper = new PickHelper();
    // I: now render the scene!
    const render = time => {
        // convert time to seconds
        time *= 0.001; 
        // resize the canvas if needed, to prevent poor resolution
        if (resizeRendererToDisplaySize(renderer)) {
            // also prevent the cubes being "stretched" - sync aspect ratios of canvas and camera
            const canvas = renderer.domElement;  // this line works but isn't needed, b/c we only have one canvas
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        } 
        // spin the camera pole
        cameraPole.rotation.y = time * .1;
        // pick the object that the user might be pointer at (change it's colors)
        pickHelper.pick(pickPosition, scene, camera, time);
        // render the cubes in one orientation
        renderer.render(scene, camera);
        // and see the cubes again in rapid succession to create movement
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();