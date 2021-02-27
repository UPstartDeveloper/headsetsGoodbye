import { main } from './index';


export default function startHandsAndThree() {
    // start handsfree face tracking
    handsfree.start();
    // add the canvas before Three.js is loaded
    let canv = document.createElement('canvas');
    canv.id = 'c';
    document.body.appendChild(canv); // adds the canvas to the body element
    // add the the progress bar before Three.js is loaded
    let container = document.getElementsByClassName('container')[0];
    let loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading'; // using the CSS to style the progress bar
    container.appendChild(loadingDiv);
    // add the inner divs of the progress bar
    let innerDivOne = document.createElement('div');
    loadingDiv.appendChild(innerDivOne);
    let loadingText = document.createElement('div');
    loadingText.innerHTML = "...loading...";
    innerDivOne.appendChild(loadingText);
    // show the actual progress bar
    let progressDiv = document.createElement('div');
    progressDiv.className = "progress";
    innerDivOne.appendChild(progressDiv);
    let progressBar = document.createElement('div');
    progressBar.id = "progressbar";
    progressDiv.appendChild(progressBar);

    /* the structure we are making looks like the following:
     *   <div id="loading">
     *       <div> // innerDivOne
     *          <div>...loading...</div>
     *          <div class="progress">
     *              <div id="progressbar"></div>
     *          </div>
     *     </div>
     *  </div>
     */ 
    // set up the Three.js environment
    main();
}
