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
    // D: instantiate the viewing scene - anything we want to draw gets added to it
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");
    // create the picking scene
    const pickingScene = new THREE.Scene();
    pickingScene.background = new THREE.Color(0);
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
   const loader = new THREE.TextureLoader();
   const texture = loader.load('resources/images/frame.png');
    // these cubes will be mapped to an id (GPU-based picking)
    const idToObject = {};
    const numObjects = 100;
    for (let i = 0; i < numObjects; ++i) {
      const id = i + 1;
      const material = new THREE.MeshPhongMaterial({
        color: randomColor(),
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.1
      });
    
      // add the cube to the viewing scene
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      // map it to its id
       idToObject[id] = cube;
      
      cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
      cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
      cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
      // add a corresponding cube to in the same location, in the 2nd scene
      const pickingMaterial = new THREE.MeshPhongMaterial({
          emissive: new THREE.Color(id),
          color: new THREE.Color(0, 0, 0),
          specular: new THREE.Color(0, 0, 0),
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          alphaTest: 0.5,
          blending: THREE.NoBlending,
        });
      const pickingCube = new THREE.Mesh(geometry, pickingMaterial);
      pickingScene.add(pickingCube);
      pickingCube.position.copy(cube.position);
      pickingCube.rotation.copy(cube.rotation);
      pickingCube.scale.copy(cube.scale);
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
    class GPUPickHelper {
      constructor() {
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;
        // create a 1x1 pixel render target
        this.pickingTexture = new THREE.WebGLRenderTarget(1, 1);
        this.pixelBuffer = new Uint8Array(4);
      }
      pick(cssPosition, scene, camera, time) {
        const {pickingTexture, pixelBuffer} = this;
        // restore the color if there is a picked object
        if (this.pickedObject) {
          this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
          this.pickedObject = undefined;
        }
        // set the view offset to represent just a single pixel under the mouse
        const pixelRatio = renderer.getPixelRatio();
        camera.setViewOffset(
            renderer.getContext().drawingBufferWidth,   // full width
            renderer.getContext().drawingBufferHeight,  // full top
            cssPosition.x * pixelRatio | 0,             // rect x
            cssPosition.y * pixelRatio | 0,             // rect y
            1,                                          // rect width
            1,                                          // rect height
        );
        // render the scene
        renderer.setRenderTarget(pickingTexture)
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);
 
        // clear the view offset so rendering returns to normal
        camera.clearViewOffset();
        //read the pixel
        renderer.readRenderTargetPixels(
            pickingTexture,
            0,   // x
            0,   // y
            1,   // width
            1,   // height
            pixelBuffer);
    
        const id =
            (pixelBuffer[0] << 16) |
            (pixelBuffer[1] <<  8) |
            (pixelBuffer[2]      );
          
        const intersectedObject = idToObject[id];
        if (intersectedObject) {
          // pick the first object. It's the closest one
          this.pickedObject = intersectedObject;
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
      /*
       * CPU-based picking: requires raycasting
       * GPU-based picking: not required, use the pixel pos itself
       */
      pickPosition.x = pos.x;
      pickPosition.y = pos.y;
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
    const pickHelper = new GPUPickHelper();
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
        pickHelper.pick(pickPosition, pickingScene, camera, time);
        // render the cubes in one orientation
        renderer.render(scene, camera);
        // and see the cubes again in rapid succession to create movement
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();