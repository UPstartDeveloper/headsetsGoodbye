import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core";
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
// import fingerpose from "https://cdn.jsdelivr.net/gh/andypotato/fingerpose/src/index.js";
import BaseModel from "https://cdn.jsdelivr.net/gh/MIDIBlocks/handsfree/src/model/base.js";
// imports for the fingerpose objects
import GestureEstimator from 'https://cdn.jsdelivr.net/gh/andypotato/fingerpose/src/GestureEstimator.js';
import GestureDescription from 'https://cdn.jsdelivr.net/gh/andypotato/fingerpose/src/GestureDescription.js';
import { Finger, FingerCurl, FingerDirection } from 'https://cdn.jsdelivr.net/gh/andypotato/fingerpose/src/FingerDescription.js';
import * as Gestures from 'https://cdn.jsdelivr.net/gh/andypotato/fingerpose/src/gestures';

/* Subclassing the Handpose model so that it performs faster by using more of the CPU
 * Most of this implementation comes from the original HandposeModel:
 * https://github.com/MIDIBlocks/handsfree/blob/master/src/model/handpose.js
 * 
 * We simply add 1 line of code to activate the CPU backend for TF.js,
 * at the bottom of the loadDependencies method:
 * tf.ENV.set("WEBGL_CPU_FORWARD", true);
 * 
 */
export default class HandposeCPU extends BaseModel {
  constructor (handsfree, config) {
    super(handsfree, config)
    this.name = 'handpose'

    // Various THREE variables
    this.three = {
      scene: null,
      camera: null,
      renderer: null,
      meshes: []
    }

    this.normalized = []

    // landmark indices that represent the palm
    // 8 = Index finger tip
    // 12 = Middle finger tip
    this.palmPoints = [0, 1, 2, 5, 9, 13, 17]
    this.gestureEstimator = new fingerpose.GestureEstimator([])
  }

  loadDependencies (callback) {
    this.loadDependency(`${this.handsfree.config.assetsPath}/three/three.min.js`, () => {
      this.loadDependency(`${this.handsfree.config.assetsPath}/@tensorflow/tf-core.js`, () => {
        this.loadDependency(`${this.handsfree.config.assetsPath}/@tensorflow/tf-converter.js`, () => {
          this.loadDependency(`${this.handsfree.config.assetsPath}/@tensorflow/tf-backend-${this.handsfree.config.handpose.backend}.js`, () => {
            this.loadDependency(`${this.handsfree.config.assetsPath}/@tensorflow-models/handpose/handpose.js`, () => {
              this.handsfree.getUserMedia(async () => {
                await tf.setBackend(this.handsfree.config.handpose.backend)
                this.api = await handpose.load(this.handsfree.config.handpose.model)
          
                this.setup3D()
          
                callback && callback(this)
                this.dependenciesLoaded = true
                this.handsfree.emit('modelReady', this)
                this.handsfree.emit('handposeModelReady', this)
                document.body.classList.add('handsfree-model-handpose')
              })
            })
          })
        })
      }, !!tf)
    }, !!THREE)
    // Activating the CPU backend:
    tf.ENV.set("WEBGL_CPU_FORWARD", true);
  }

  /**
   * Runs inference and sets up other data
   */
  async getData () {
    if (!this.handsfree.debug.$video) return

    const predictions = await this.api.estimateHands(this.handsfree.debug.$video)

    this.handsfree.data.handpose = this.data = {
      ...predictions[0],
      normalized: this.normalized,
      meshes: this.three.meshes
    }

    if (predictions[0]) {
      this.updateMeshes(this.data)
    }
    
    this.three.renderer.render(this.three.scene, this.three.camera)
    return this.data
  }

  /**
   * Sets up the 3D environment
   */
  setup3D () {
    // Setup Three
    this.three = {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(90, window.outerWidth / window.outerHeight, 0.1, 1000),
      renderer: new THREE.WebGLRenderer({
        alpha: true,
        canvas: this.handsfree.debug.$canvas.handpose
      }),
      meshes: []
    }
    this.three.renderer.setSize(window.outerWidth, window.outerHeight)
    this.three.camera.position.z = this.handsfree.debug.$video.videoWidth / 4
    this.three.camera.lookAt(new THREE.Vector3(0, 0, 0))

    // Camera plane
    this.three.screen = new THREE.Mesh(
      new THREE.BoxGeometry(window.outerWidth, window.outerHeight, 1),
      new THREE.MeshNormalMaterial()
    )
    this.three.screen.position.z = 300
    this.three.scene.add(this.three.screen)

    // Camera raycaster
    this.three.raycaster = new THREE.Raycaster()
    this.three.arrow = new THREE.ArrowHelper(this.three.raycaster.ray.direction, this.three.raycaster.ray.origin, 300, 0xff0000)
    this.three.scene.add(this.three.arrow)

    // Create model representations (one for each keypoint)
    for (let i = 0; i < 21; i++){
      const {isPalm} = this.getLandmarkProperty(i)
    
      const obj = new THREE.Object3D() // a parent object to facilitate rotation/scaling
    
      // we make each bone a cylindrical shape, but you can use your own models here too
      const geometry = new THREE.CylinderGeometry(isPalm ? 5 : 10, 5, 1)
    
      let material = new THREE.MeshNormalMaterial()
    
      const mesh = new THREE.Mesh(geometry, material)
      mesh.rotation.x = Math.PI / 2
    
      obj.add(mesh)
      this.three.scene.add(obj)
      this.three.meshes.push(obj)

      // uncomment this to help identify joints
      // if (i === 4) {
      //   mesh.material.transparent = true
      //   mesh.material.opacity = 0
      // }
    }

    // Create center of palm
    const obj = new THREE.Object3D()
    const geometry = new THREE.CylinderGeometry(5, 5, 1)
    let material = new THREE.MeshNormalMaterial()
  
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = Math.PI / 2
  
    this.three.centerPalmObj = obj
    obj.add(mesh)
    this.three.scene.add(obj)
    this.three.meshes.push(obj)    
    this.three.screen.visible = false
  }

  // compute some metadata given a landmark index
  // - is the landmark a palm keypoint or a finger keypoint?
  // - what's the next landmark to connect to if we're drawing a bone?
  getLandmarkProperty (i) {
    const palms = [0, 1, 2, 5, 9, 13, 17] //landmark indices that represent the palm

    const idx = palms.indexOf(i)
    const isPalm = idx != -1
    let next // who to connect with?

    if (!isPalm) { // connect with previous finger landmark if it's a finger landmark
      next = i - 1
    }else{ // connect with next palm landmark if it's a palm landmark
      next = palms[(idx + 1) % palms.length]
    }

    return {isPalm, next}
  }

  /**
   * update threejs object position and orientation from the detected hand pose
   * threejs has a "scene" model, so we don't have to specify what to draw each frame,
   * instead we put objects at right positions and threejs renders them all
   * @param {*} hand 
   */
  updateMeshes (hand) {
    for (let i = 0; i < this.three.meshes.length - 1 /* palmbase */; i++) {
      const {next} = this.getLandmarkProperty(i)
  
      const p0 = this.webcam2space(...hand.landmarks[i])  // one end of the bone
      const p1 = this.webcam2space(...hand.landmarks[next])  // the other end of the bone
  
      // compute the center of the bone (midpoint)
      const mid = p0.clone().lerp(p1, 0.5)
      this.three.meshes[i].position.set(mid.x, mid.y, mid.z)
      this.normalized[i] = [
        this.handsfree.normalize(p0.x, this.handsfree.debug.$video.videoWidth / -2, this.handsfree.debug.$video.videoWidth / 2),
        this.handsfree.normalize(p0.y, this.handsfree.debug.$video.videoHeight / -2, this.handsfree.debug.$video.videoHeight / 2),
        this.three.meshes[i].position.z
      ]
  
      // compute the length of the bone
      this.three.meshes[i].scale.z = p0.distanceTo(p1)

      // compute orientation of the bone
      this.three.meshes[i].lookAt(p1)

      if (i === 8) {
        this.three.arrow.position.set(mid.x, mid.y, mid.z)
        const direction = new THREE.Vector3().subVectors(p0, mid)
        this.three.arrow.setDirection(direction.normalize())
        this.three.arrow.setLength(800)
        this.three.arrow.direction = direction
      }
    }

    this.updateCenterPalmMesh(hand)
  }

  /**
   * Update the palm
   */
  updateCenterPalmMesh (hand) {
    let points = []
    let mid = {
      x: 0,
      y: 0,
      z: 0
    }

    // Get position for the palm
    this.palmPoints.forEach((i, n) => {
      points.push(this.webcam2space(...hand.landmarks[i]))
      mid.x += points[n].x
      mid.y += points[n].y
      mid.z += points[n].z
    })

    mid.x = mid.x / this.palmPoints.length
    mid.y = mid.y / this.palmPoints.length
    mid.z = mid.z / this.palmPoints.length
    
    this.three.centerPalmObj.position.set(mid.x, mid.y, mid.z)
    this.three.centerPalmObj.scale.z = 10
    this.three.centerPalmObj.rotation.x = this.three.meshes[12].rotation.x - Math.PI / 2
    this.three.centerPalmObj.rotation.y = -this.three.meshes[12].rotation.y
    this.three.centerPalmObj.rotation.z = this.three.meshes[12].rotation.z
  }
  
  // transform webcam coordinates to threejs 3d coordinates
  webcam2space (x, y, z) {
    return new THREE.Vector3(
      (x-this.handsfree.debug.$video.videoWidth / 2),
      -(y-this.handsfree.debug.$video.videoHeight / 2), // in threejs, +y is up
      -z
    )
  }

  /**
   * Updates the gesture estimator
   */
  updateGestureEstimator () {
    const activeGestures = []
    const gestureDescriptions = []
    
    // Build the gesture descriptions
    this.gestures.forEach(name => {
      this.handsfree.gesture[name].enabled && activeGestures.push(name)
      
      // Loop through the description and compile it
      if (!this.handsfree.gesture[name].compiledDescription && this.handsfree.gesture[name].enabled) {
        const description = new fingerpose.GestureDescription(name)

        this.handsfree.gesture[name].description.forEach(pose => {
          // Build the description
          switch (pose[0]) {
            case 'addCurl':
              description[pose[0]](
                fingerpose.Finger[pose[1]],
                fingerpose.FingerCurl[pose[2]],
                pose[3]
              )
            break
            case 'addDirection':
              description[pose[0]](
                fingerpose.Finger[pose[1]],
                fingerpose.FingerDirection[pose[2]],
                pose[3]
              )
            break
            case 'setWeight':
              description[pose[0]](
                fingerpose.Finger[pose[1]],
                pose[2]
              )
            break
          }
        })

        this.handsfree.gesture[name].compiledDescription = description
      }
    })

    // Create the gesture estimator
    activeGestures.forEach(gesture => {
      gestureDescriptions.push(this.handsfree.gesture[gesture].compiledDescription)
    })

    if (activeGestures.length) {
      this.gestureEstimator = new fingerpose.GestureEstimator(gestureDescriptions)
    }
  }
  
  /**
   * Gets current gesture
   */
  getGesture () {
    let gesture = null

    if (this.data.landmarks && this.gestureEstimator) {
      const estimate = this.gestureEstimator.estimate(this.data.landmarks, 7.5)

      if (estimate.gestures.length) {
        gesture = estimate.gestures.reduce((p, c) => {
          return (p.confidence > c.confidence) ? p : c
        })
      }
    }

    return gesture
  }
}

