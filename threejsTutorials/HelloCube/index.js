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

// generating a single random number in a specified range
const rand = (min, max) => {
  // returns a random number between max and min
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min + (max - min) * Math.random();
}
 
const randomColor = () => {
  // defines the hue and saturation for the color randomly
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
// rendering the scene
const renderCubes = () => {
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
    /* F: 
        * this function abstracts the steps for making a box, w/ different
        * materials and geometries
        */
    const makeInstance = (geometry, color, x) => {
        // set color on the material (can just use CSS)
        const material = new THREE.MeshPhongMaterial({ color });
        // instantiate the box
        const cube = new THREE.Mesh(geometry, material);
        // add it to the scene, and set its x position
        scene.add(cube);
        cube.position.x = x;
        // end the function by returning the box
        return cube;
    }
    // G: add 3 different cubes
    const cubes = [
        makeInstance(geometry, 0x44aa88, -2),
        makeInstance(geometry, 0xaa8844, 0),
        makeInstance(geometry, 0x8844aa, 2),
    ];
    // F: add a directional light
    const color = 0xFFFFFF;  // just use white light for now
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
    // put the light on the camera, so the light will moves with it
    camera.add(light);
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
         // change the cube orientation
        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });
        // spin the camera pole
        cameraPole.rotation.y = time * .1;
        // render the cubes in one orientation
        renderer.render(scene, camera);
        // and see the cubes again in rapid succession to create movement
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
renderCubes();