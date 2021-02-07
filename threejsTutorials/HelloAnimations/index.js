import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';
import {SkeletonUtils} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/utils/SkeletonUtils.js';

/* The models come from the Farm Animals Pack, 
 * that was created by Quaternius: https://www.patreon.com/quaternius 
 */


/* load the GLTF models (for the animals) */
const manager = new THREE.LoadingManager();
manager.onLoad = init;
const models = {
  pig:    { url: 'GLTF/pig.gltf' },
  cow:    { url: 'GLTF/cow.gltf' },
  llama:  { url: 'GLTF/llama.gltf' },
  pug:    { url: 'GLTF/pug.gltf' },
  sheep:  { url: 'GLTF/sheep.gltf' },
  zebra:  { url: 'GLTF/zebra.gltf' },
  horse:  { url: 'GLTF/horse.gltf' },
};
{
  const gltfLoader = new GLTFLoader(manager);
  for (const model of Object.values(models)) {
    gltfLoader.load(model.url, (gltf) => {
      model.gltf = gltf;
    });
  }
}
 
/* make the animations in the GLTF models easily accessible */
function prepModelsAndAnimations() {
  Object.values(models).forEach(model => {
    const animsByName = {};
    model.gltf.animations.forEach((clip) => {
      animsByName[clip.name] = clip;
    });
    model.animations = animsByName;
  });
}

// this array will hold our animations
const mixers = [];

/* main function */
function init() {
  // hide the loading bar
  const loadingElem = document.querySelector('#loading');
  loadingElem.style.display = 'none';

  // load the models and their animations
  prepModelsAndAnimations();

  // clone the models just loaded
  Object.values(models).forEach((model, ndx) => {
    const clonedScene = SkeletonUtils.clone(model.gltf.scene);
    // make a new Object3D to "parent" the clone (for positioning)
    const root = new THREE.Object3D();
    root.add(clonedScene);
    scene.add(root);
    root.position.x = (ndx - 3) * 3;

  // play the animation of the first model
  const firstClip = Object.values(model.animations)[0];
  const action = mixer.clipAction(firstClip);
  action.play();
  // add the animations of our first model to the scene
  const mixer = new THREE.AnimationMixer(clonedScene);
  mixers.push(mixer);
  });
}

const manager = new THREE.LoadingManager();
manager.onLoad = init;
 
// show a progress bar go from 0-100% of the page width as the models load
const progressbarElem = document.querySelector('#progressbar');
manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  progressbarElem.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
};

/* render loop */
let then = 0;
function render(now) {
  now *= 0.001;  // convert to seconds
  // computing the time since the last frame
  const deltaTime = now - then;
  then = now;
 
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  // update the animations as we render again
  for (const mixer of mixers) {
    mixer.update(deltaTime);
  }
 
  renderer.render(scene, camera);
 
  requestAnimationFrame(render);
}