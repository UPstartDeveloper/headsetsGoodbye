//import * as THREE from './node_modules/three/build/three.module.js';
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';


// The code for picking on this page is modified from the tutorial on Object Picking on the 
// Three.js Fundamentals page: https://threejsfundamentals.org/threejs/lessons/threejs-picking.html

function getCanvasRelativePosition(event) {
      // TODO:
    }


// resize the canvas to prevent poor resolution
const resizeRendererToDisplaySize = (renderer, canvas) => {
    /*
     * NOTE that there must be a div that nests the 
     * canvas, used to initialize the view variable,
     * on the DOM for this function to work!
     */
    // get the current dimensions of the canvas
    const view = canvas.parentElement;
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

const objects = [];
const spread = 15;

const addObject = (x, y, obj) => {
  /* adding objects to the scene (must be outside scope) */
  obj.position.x = x * spread;
  obj.position.y = y * spread;
  scene.add(obj);
  objects.push(obj);
}

const createMaterial = () => {
  /* instantiates a material with a random color */
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
  });
  // coloring the material
  const hue = Math.random();
  const saturation = 1;
  const luminance = 0.5;
  material.color.setHSL(hue, saturation, luminance);

  return material;
}

/* creating objects */
const addSolidGeometry = (x, y, geometry) => {
  /* params:
   * x, y = the x and y coordinates
   * geometry: the primitive (usually a shape) we 
   *           want the mesh for the object to have
   */
  // create a mesh for the new object
  const mesh = new THREE.Mesh(geometry, createMaterial());
  // add the 
  addObject(x, y, mesh);
}

export const makeCamera = () => {
    // C: instantiate the camera
    const fov = 40;  // fov = "field of view"
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // move the camera to look down on the box
    camera.position.z = 8;
    return camera;
}

/* rendering the scene */
export const renderCubes = (camera) => {
    // A: get the canvas element (what we'll be drawing upon)
    const canvas = document.querySelector("#c");
    // B: instaniate the renderer (to do the drawing)
    const renderer = new THREE.WebGLRenderer({canvas});
    // D: instantiate a scene - anything we want to draw gets added to it
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);  // black
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
    // CLASS for OBJECT-PICKING
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
          // set the cube's emissive color to flashing red/yellow
          this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
        }
      }
    }
    // init picker's location
    const pickPosition = {x: 0, y: 0};
    clearPickPosition();
    
    // EVENT-HANDLERS - these make sure we do pick object that are actually intersected by the raycaster
    function getCanvasRelativePosition(event) {
      // get the bounding box of the place where the pinch happened
      const rect = canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * canvas.width  / rect.width,
        y: (event.clientY - rect.top ) * canvas.height / rect.height,
      };
    }
    
    function setPickPosition(event) {
      const pos = getCanvasRelativePosition(event);
      // set the raycaster's position to the place where the pinch happened
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
    // TODO: add event handlers for mobile?
    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);

    // BACK to setting up the scene
    // I: add a directional light
    const color = 0xFFFFFF;  // just use white light for now
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
    // J: now render the scene!
    const render = time => {
        // convert time to seconds
        time *= 0.001; 
        // resize the canvas if needed, to prevent poor resolution
        if (resizeRendererToDisplaySize(renderer, canvas)) {
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
        // render the cube in one orientation
        renderer.render(scene, camera);
        // and see the cube again in rapid succession to create movement
        requestAnimationFrame(render);
    }
    // render the scene
    requestAnimationFrame(render);
}
