//import * as THREE from './node_modules/three/build/three.module.js';
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import { DragControls } from "https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/jsm/controls/DragControls.js";

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
    const makeInstance = (geometry, color, x) => {
      /** F: 
        * this function abstracts the steps for making a box, w/ different
        * materials and geometries
        */
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
    // H: make the cubes draggable
    const controls = new DragControls(cubes, camera, renderer.domElement);
    const raycaster = new THREE.Raycaster();  // this lets us drag individual cubes 
    const group = new THREE.Group();  // group objects being dragged?
		scene.add( group );
    function onClick( event ) {
        /** uses the raycaster to select an individual cube to drag */
        // get the objects currently pointed at by the mouse
				//event.preventDefault();
        const draggableObjects = controls.getObjects();
        draggableObjects.length = 0;
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, camera );
        const intersections = raycaster.intersectObjects( objects, true );
        // selects the first object being intersected by the ray
        if ( intersections.length > 0 ) {
          const object = intersections[0].object;
          // extra stuff to change the object's color?
          if ( group.children.includes( object ) === true ) {
            object.material.emissive.set( 0x000000 );
            scene.attach( object );
          } else {
            object.material.emissive.set( 0xaaaaaa );
            group.attach( object );

          }
          controls.transformGroup = true;
          draggableObjects.push( group );
        }
        if ( group.children.length === 0 ) {
          controls.transformGroup = false;
          draggableObjects.push( ...objects );
        } 
      render();
		}
    // controls.addEventListener( 'drag', render );
    // document.addEventListener( 'click', onClick );
    // I: make sure the cubes flash while being dragged
    function startFlashing(event) {
      /** ma */
	    startColor = event.object.material.color.getHex();
	    event.object.material.color.setHex(0x000000);
    }

    function endFlashing(event) {
	    event.object.material.color.setHex(startColor);
    }

	  // controls.addEventListener( 'dragstart', startFlashing);
	  // controls.addEventListener( 'dragend', endFlashing);
    // CLASS for OBJECT-PICKING
    // class PickHelper {
    //   constructor() {
    //     this.raycaster = new THREE.Raycaster();
    //     this.pickedObject = null;
    //     this.pickedObjectSavedColor = 0;
    //   }
    //   pick(normalizedPosition, scene, camera, time) {
    //     // restore the color if there is a picked object
    //     if (this.pickedObject) {
    //       this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
    //       this.pickedObject = undefined;
    //     }

    //     // cast a ray through the frustum
    //     this.raycaster.setFromCamera(normalizedPosition, camera);
    //     // get the list of objects the ray intersected
    //     const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    //     if (intersectedObjects.length) {
    //       // pick the first object. It's the closest one
    //       this.pickedObject = intersectedObjects[0].object;
    //       // save its color
    //       this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
    //       // set the cube's emissive color to flashing red/yellow
    //       this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
    //     }
    //   }
    // }
    // // init picker location and instantiate it
    // const pickPosition = {x: 0, y: 0};
    // clearPickPosition();
    // const pickHelper = new PickHelper();
    
    // // EVENT-HANDLERS - these make sure we do pick object that are actually intersected by the raycaster
    // function getCanvasRelativePosition(event) {
    //   // get the bounding box of the place where the pinch happened
    //   const rect = canvas.getBoundingClientRect();
    //   return {
    //     x: (event.clientX - rect.left) * canvas.width  / rect.width,
    //     y: (event.clientY - rect.top ) * canvas.height / rect.height,
    //   };
    // }
    
    // function setPickPosition(event) {
    //   const pos = getCanvasRelativePosition(event);
    //   // set the raycaster's position to the place where the pinch happened
    //   pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
    //   pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
    // }
    
    // function clearPickPosition() {
    //   // For now we just pick a value
    //   // unlikely to pick something - "out of frame location"
    //   pickPosition.x = -100000;
    //   pickPosition.y = -100000;
    // }

    // function followPickPosition(event) {
    //   /** if the cube is selected, make it move along with the user's mouse */
    //   if (pickHelper && pickHelper.pickedObject) {
    //     console.log("current pos : (" + pickHelper.pickedObject.position.x + ", " + pickHelper.pickedObject.position.y + ", " + pickHelper.pickedObject.position.z + ")");
    //     // tween the cube's location, making sure it doesn't go in the "out of frame location"
    //     if (pickPosition.x !== -100000 && pickPosition.y !== -100000) {
    //       console.log("next pos: (" + pickPosition.x + ", " + pickPosition.y + ")");
    //       TweenMax.to(pickHelper.pickedObject.position, .95, {
    //         x: pickPosition.x,
    //         y: pickPosition.y,
    //         z: pickHelper.pickedObject.position.z // z coordinate stays the same
    //       })

    //       console.log("new pos : (" + pickHelper.pickedObject.position.x + ", " + pickHelper.pickedObject.position.y + ", " + pickHelper.pickedObject.position.z + ")");
    //     }
    //   }
    // }
    // TODO: add event handlers for mobile?
    // window.addEventListener('mousedown', setPickPosition);
    // window.addEventListener('mouseup', clearPickPosition);
    // window.addEventListener('mousemove', followPickPosition);
    // window.addEventListener('mouseleave', clearPickPosition);

    // BACK to setting up the scene
    // I: add a directional light
    const color = 0xFFFFFF;  // just use white light for now
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
    // J: add event-handlers to enable dragging; and render the scene!
    const mouse = new THREE.Vector2(); // this is the pointer we'll drag objects with
    // controls.addEventListener( 'drag', render );
    document.addEventListener( 'click', onClick );
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
        // perform any picking needed
        // pickHelper.pick(pickPosition, scene, camera, time);
        // render the cube in one orientation
        renderer.render(scene, camera);
        // and see the cube again in rapid succession to create movement
        requestAnimationFrame(render);
    }
    // make sure to render changes made by dragging
    // controls.addEventListener( 'drag', render );
    // render the scene
    requestAnimationFrame(render);
}
