import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

import Stats from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/libs/dat.gui.module.js';

import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';

let container, stats, clock, gui, mixer, actions, activeAction, previousAction;
let camera, scene, renderer, model, face;

const api = { state: 'Standing' };

export function init() {
    /* Assembles the robot on the DOM using Three.js, and adds a GUI to 
     * manually edit its emotions, trigger specific actions, 
     * or change its state from walking to sitting, idle, etc.
     * 
     * For face tracking, we initialize the global face variable (declared above),
     * in the createGUI function,
     * so that it is accessible via window.face.
     * 
     * @return {null}
     */

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 );
    camera.position.set( - 5, 3, 10 );
    camera.lookAt( new THREE.Vector3( 0, 2, 0 ) );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xe0e0e0 );
    scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 );

    clock = new THREE.Clock();

    // A: lights

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 20, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 20, 10 );
    scene.add( dirLight );

    // B: ground

    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    scene.add( mesh );

    const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );

    // C: model
    const loader = new GLTFLoader();
    loader.load( '../models/RobotExpressive.glb', ( gltf ) => {
        // 1. once the model is loaded, add it to the DOM
        model = gltf.scene;
        scene.add( model );
        // 2. add the GUI & initialize the global face variable
        face = createGUI( model, gltf.animations );

    }, 
    undefined, // 3. this "function" happens while the loading is in progress
    function ( e ) {
        // 4. this happens in case there is an error in loading the model
        console.error( e );
    } );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize );

    // D: stats
    stats = new Stats();
    container.appendChild( stats.dom );
}

function createGUI( model, animations ) {

    const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
    const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];

    gui = new GUI();

    // ANIMATING the robot
    mixer = new THREE.AnimationMixer( model );

    actions = {};

    for ( let i = 0; i < animations.length; i ++ ) {

        const clip = animations[ i ];
        const action = mixer.clipAction( clip );
        actions[ clip.name ] = action;

        if ( emotes.indexOf( clip.name ) >= 0 || states.indexOf( clip.name ) >= 4 ) {

            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;

        }

    }

    /* STATES = super IMPORTANT for animating the robot! */
    const statesFolder = gui.addFolder( 'States' );

    const clipCtrl = statesFolder.add( api, 'state' ).options( states );

    clipCtrl.onChange( function () {

        fadeToAction( api.state, 0.5 );

    } );

    statesFolder.open();

    // emotes

    const emoteFolder = gui.addFolder( 'Emotes' );

    function createEmoteCallback( name ) {

        api[ name ] = function () {

            fadeToAction( name, 0.2 );

            mixer.addEventListener( 'finished', restoreState );

        };

        emoteFolder.add( api, name );

    }

    function restoreState() {

        mixer.removeEventListener( 'finished', restoreState );

        fadeToAction( api.state, 0.2 );

    }

    for ( let i = 0; i < emotes.length; i ++ ) {

        createEmoteCallback( emotes[ i ] );

    }

    emoteFolder.open();

    /* Expressions - THIS is what we need to control via web cam */

    let face = model.getObjectByName( 'Head_4' );
    // console.log(face.parent);
    // Lists the expression that the robot can have on the GUI panel
    const expressions = Object.keys( face.morphTargetDictionary );
    const expressionFolder = gui.addFolder( 'Expressions' );
    // gives the expressions on the panel their initial values
    for ( let i = 0; i < expressions.length; i ++ ) {
        // the params for the .add function: (values array, index (of values array), min, max, step_size)
        expressionFolder.add( face.morphTargetInfluences, i, 0, 1, 0.01 ).name( expressions[ i ] );

    }
    // sets the robot in it's default action
    activeAction = actions[ 'Standing' ];
    activeAction.play();
    // collapses the "Expressions" tab on the GUI
    expressionFolder.open();
    // RETURN THE FACE, so we can maninpulate it using the user's expression
    window.face = face;
    return face
}

function fadeToAction( name, duration ) {
        // TODO: figure out the unit of time on the duration arg

    previousAction = activeAction;
    activeAction = actions[ name ];

    if ( previousAction !== activeAction ) {

        previousAction.fadeOut( duration );

    }

    activeAction
        .reset()
        .setEffectiveTimeScale( 1 )
        .setEffectiveWeight( 1 )
        .fadeIn( duration )
        .play();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

async function alterExpression(video, faceapi) {
    /* Moves the robot's eyes and eyebrows to mimic those of the user.
     * @param: {HTMLVideoElement} video: this is where we retrieve the user's face.
     * @param: {module} faceapi: this is how we'll detect emotions (using face-api.js)
     * @return {undefined}
     */
    // A: detect emotions
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
    // B: Animate the robot's expression to the mixture of anger, suprise, and sadness on the user
    if (window.face !== undefined && detections.length > 0) {
        // C: only change if new detections are different from existing values
        const newEmotionValues = [
            detections[0].expressions.angry,
            detections[0].expressions.surprised,
            detections[0].expressions.sad
        ];
        if (newEmotionValues != window.face.morphTargetInfluences) {
            TweenMax.to(window.face.morphTargetInfluences, 0.475, newEmotionValues);
        }
    }
    return detections;
}

export function animate(faceapi) {
    /* Controls the render loop of the robot, in effect
     * creating the appearance of movement on the HTML document.
     * @param: {module} faceapi: this is how we'll detect emotions (using face-api.js)
     * @return {undefined}
     */

    // A: detect user emotions
    const video = document.getElementById('faceStream');
    // B: Animate the Robot
    const dt = clock.getDelta();

    if ( mixer ) mixer.update( dt );

    // C: change the DOM
    requestAnimationFrame(() => {
            // include changes to the user's facial expression
            alterExpression(video, faceapi);
            // on to the next frame
            animate(faceapi);
        }
    );

    renderer.render( scene, camera );

    stats.update();
    
}
