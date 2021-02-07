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
 
function init() {
  // TODO: main function
  // hide the loading bar
  const loadingElem = document.querySelector('#loading');
  loadingElem.style.display = 'none';
}

const manager = new THREE.LoadingManager();
manager.onLoad = init;
 
// show a progress bar go from 0-100% of the page width as the models load
const progressbarElem = document.querySelector('#progressbar');
manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  progressbarElem.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
};