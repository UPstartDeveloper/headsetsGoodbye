import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';
import {SkeletonUtils} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/utils/SkeletonUtils.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 20, 40);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  function addLight(...pos) {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...pos);
    scene.add(light);
    scene.add(light.target);
  }
  addLight(5, 5, 2);
  addLight(-5, 5, 5);

  ///////////   NEW CONCEPTS  //////////////////////////////
  const manager = new THREE.LoadingManager();
  manager.onLoad = init;

  // animate the progress bar moving left to right
  const progressbarElem = document.querySelector('#progressbar');
  manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    progressbarElem.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
  };

  // load the GLTF models
  const models = {
    pig:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Pig.gltf' },
    cow:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Cow.gltf' },
    llama:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Llama.gltf' },
    pug:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Pug.gltf' },
    sheep:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Sheep.gltf' },
    zebra:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Zebra.gltf' },
    horse:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Horse.gltf' },
    knight: { url: 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf' },
  };
  {
    const gltfLoader = new GLTFLoader(manager);
    for (const model of Object.values(models)) {
      gltfLoader.load(model.url, (gltf) => {
        model.gltf = gltf;
      });
    }
  }

  // load in the animations of the models
  function prepModelsAndAnimations() {
    Object.values(models).forEach(model => {
      const animsByName = {};
      model.gltf.animations.forEach((clip) => {
        animsByName[clip.name] = clip;
      });
      model.animations = animsByName;
    });
  }

  // store the animation data
  const mixerInfos = [];

  function init() {
    // hide the loading bar
    const loadingElem = document.querySelector('#loading');
    loadingElem.style.display = 'none';

    prepModelsAndAnimations();

    // load in multiple models by "cloning"
    Object.values(models).forEach((model, ndx) => {
      const clonedScene = SkeletonUtils.clone(model.gltf.scene);
      const root = new THREE.Object3D();
      root.add(clonedScene);
      scene.add(root);
      root.position.x = (ndx - 3) * 3;
      // add all the animations to the scene, for this model
      const mixer = new THREE.AnimationMixer(clonedScene);
      const actions = Object.values(model.animations).map((clip) => {
        return mixer.clipAction(clip);
      });
      // store the AnimationMixer, along with all its AnimationActions
      const mixerInfo = {
        mixer,
        actions,
        actionNdx: -1,
      };
      mixerInfos.push(mixerInfo);
      playNextAction(mixerInfo);
    });
  }

function playNextAction(mixerInfo) {
  /* enable all but one animations for the mixer */
  const {actions, actionNdx} = mixerInfo;
  const nextActionNdx = (actionNdx + 1) % actions.length;
  mixerInfo.actionNdx = nextActionNdx;
  actions.forEach((action, ndx) => {
    const enabled = ndx === nextActionNdx;
    action.enabled = enabled;
    if (enabled) {
      action.play();
    }
  });
}

// allow the user to trigger the animations
window.addEventListener('keydown', (e) => {
  const mixerInfo = mixerInfos[e.keyCode - 49];
  if (!mixerInfo) {
    return;
  }
  playNextAction(mixerInfo);
});

  // render loop
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  let then = 0;
  function render(now) {
    now *= 0.001;  // convert to sections
    const deltaTime = now - then;
    then = now;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    for (const {mixer} of mixerInfos) {
      mixer.update(deltaTime);
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
