let video = document.getElementById('start-and-stop'), 
    vendorUrl = window.URL || window.webkitURL; 
if (navigator.mediaDevices.getUserMedia) { 
    navigator.mediaDevices.getUserMedia({ video: true }) 
        .then(function (stream) { 
            video.srcObject = stream; 
        }).catch(function (error) { 
            console.log("Something went wrong!"); 
        }); 
} 