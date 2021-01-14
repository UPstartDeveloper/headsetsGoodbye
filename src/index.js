// hand-tracking function
const trackHands = () => {
  // Credit to the Getting Started tutorial on Digital Ocean: https://www.digitalocean.com/community/tutorials/front-and-rear-camera-access-with-javascripts-getusermedia,
  // for providing great info on asking permission from the user for the camera 
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    // Credit to the Getting Started tutorial on Handsfree.js: https://handsfree.js.org/guide/misc/intro.html#getting-started
    handsfree = new Handsfree({
      showDebug: true,

      // Use the hand model with custom config
      hands: {
          // Always make sure to enable them
          enabled: true,

          // Let's track up to 4 hands
          maxNumHands: 4,
      }
    })
    // start hand tracking    
    handsfree.start();
    }
}

trackHands();