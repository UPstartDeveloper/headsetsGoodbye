/**
 * The following are all the defaults
 * 
 * @see https://handsfree.js.org/ref/prop/config
 */
export default {
  // Whether to automatically start or not
  // This works both during instantiation or with .update()
  autostart: false,
  
  // Use CDN by default
  assetsPath: 'https://unpkg.com/handsfree@8.4.0/build/lib/assets',
  
  // This will load everything but the models. This is useful when you want to use run inference
  // on another device or context but run the plugins on the current device
  isClient: false,

  // Gesture config
  gesture: {},

  // Setup config. Ignore this to have everything done for you automatically
  setup: {
    // The canvas element to use for rendering debug info like skeletons and keypoints
    canvas: {
      weboji: {
        // The canvas element to hold the skeletons and keypoints for weboji model
        $el: null,
        width: 1280,
        height: 720
      },
      hands: {
        // The canvas element to hold the skeletons and keypoints for hand model
        $el: null,
        width: 1280,
        height: 720
      },
      handpose: {
        // The canvas element to hold the skeletons and keypoints for hand model
        $el: null,
        width: 1280,
        height: 720
      },
      pose: {
        // The canvas element to hold the skeletons and keypoints for pose model
        $el: null,
        width: 1280,
        height: 720
      },
      facemesh: {
        // The canvas element to hold the skeletons and keypoints for facemesh model
        $el: null,
        width: 1280,
        height: 720
      }
    },
    // The video source to use. If not present, one will be created to capture webcam
    video: {
      // The video element to hold the webcam stream
      $el: null,
      width: 1280,
      height: 720
    },
    // The wrapping element
    wrap: {
      // The element to put the video and canvas inside of
      $el: null,
      // The parent element
      $parent: null
    }
  },

  // Weboji model
  weboji: {
    enabled: false,
    throttle: 0,

    videoSettings: {
      // The video, canvas, or image element
      // Omit this to auto create a <VIDEO> with the webcam
      videoElement: null,

      // ID of the device to use
      // Omit this to use the system default
      deviceId: null,

      // Which camera to use on the device
      // Possible values: 'user' (front), 'environment' (back)
      facingMode: 'user',

      // Video dimensions
      idealWidth: 320,
      idealHeight: 240,
      minWidth: 240,
      maxWidth: 1280,
      minHeight: 240,
      maxHeight: 1280
    },

    // Thresholds needed before these are considered "activated"
    // - Ranges from 0 (not active) to 1 (fully active)
    morphs: {
      threshold: {
        smileRight: 0.7,
        smileLeft: 0.7,
        browLeftDown: 0.8,
        browRightDown: 0.8,
        browLeftUp: 0.8,
        browRightUp: 0.8,
        eyeLeftClosed: 0.4,
        eyeRightClosed: 0.4,
        mouthOpen: 0.3,
        mouthRound: 0.8,
        upperLip: 0.5
      }
    }
  },

  // Hands model
  hands: {
    enabled: false,
    // The maximum number of hands to detect [0 - 4]
    maxNumHands: 2,

    // Minimum confidence [0 - 1] for a hand to be considered detected
    minDetectionConfidence: 0.5,

    // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
    // Higher values are more robust at the expense of higher latency
    minTrackingConfidence: 0.5
  },

  // Facemesh model
  facemesh: {
    enabled: false,
    // The maximum number of faces to detect [1 - 4]
    maxNumFaces: 1,

    // Minimum confidence [0 - 1] for a face to be considered detected
    minDetectionConfidence: 0.5,
    
    // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
    // Higher values are more robust at the expense of higher latency
    minTrackingConfidence: 0.5
  },

  // Pose model
  pose: {
    enabled: false,
    
    // Outputs only the top 25 pose landmarks if true,
    // otherwise shows all 33 full body pose landmarks
    // - Note: Setting this to true may result in better accuracy 
    upperBodyOnly: false,

    // Helps reduce jitter over multiple frames if true
    smoothLandmarks: true,

    // Minimum confidence [0 - 1] for a person detection to be considered detected
    minDetectionConfidence: 0.5,

    // Minimum confidence [0 - 1] for the pose tracker to be considered detected
    // Higher values are more robust at the expense of higher latency
    minTrackingConfidence: 0.5
  },

  handpose: {
    enabled: false,

    // The backend to use: 'webgl' or 'wasm'
    // 🚨 Currently only webgl is supported
    backend: 'webgl',

    // How many frames to go without running the bounding box detector. 
    // Set to a lower value if you want a safety net in case the mesh detector produces consistently flawed predictions.
    maxContinuousChecks: Infinity,

    // Threshold for discarding a prediction
    detectionConfidence: 0.8,

    // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]
    iouThreshold: 0.3,

    // A threshold for deciding when to remove boxes based on score in non-maximum suppression.
    scoreThreshold: 0.75
  },

  plugin: {}
}