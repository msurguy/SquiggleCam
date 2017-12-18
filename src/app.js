import * as d3 from "d3";
import Renderer from "./Renderer";
import rangesliderJs from 'rangeslider-js';

let worker = new Worker('imageAnalyzer.js');
let imagePixels = [];

// get the canvas and video elements
const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');

const video = document.querySelector('video');

// HTML Elements for the sliders
const lineCountValueEl = document.getElementById('lineCountValue');
const amplitudeValueEl = document.getElementById('amplitudeValue');
const lineSpacingValueEl = document.getElementById('lineSpacingValue');
const frequencyValueEl = document.getElementById('frequencyValue');
const brightnessValueEl = document.getElementById('brightnessValue');
const contrastValueEl = document.getElementById('contrastValue');
const lineCountValue = document.getElementById('lineCount');
const amplitudeValue = document.getElementById('amplitude');
const lineSpacingValue = document.getElementById('lineSpacing');
const frequencyValue = document.getElementById('frequency');
const brightnessValue = document.getElementById('brightness');
const contrastValue = document.getElementById('contrast');
const captureButton = document.getElementById('captureButton');
const drawButton = document.getElementById('drawButton');

const config = {
  LINE_COUNT: 90,
  AMPLITUDE: 1.2,
  SPACING: 1,
  FREQUENCY: 135,
  LINE_WIDTH: 2,
  BRIGHTNESS_ADJUSTMENT: 0,
  CONTRAST_ADJUSTMENT: 0,
  MIN_BRIGHTNESS : 0,
  MAX_BRIGHTNESS: 255,
  WIDTH: 550, // Resulting SVG width, in pixels
  HEIGHT: 550 // Resulting SVG height, in pixels
};

// Create empty SVG structure
const svgContainer = d3.select("#svg-placeholder").append("svg")
  .attr("version", 1.1)
  .attr("width", config.WIDTH)
  .attr("height", config.HEIGHT)
  .attr("viewBox", "0 0 "+ config.WIDTH + " "+config.HEIGHT)
  .attr("xmlns", "http://www.w3.org/2000/svg");

// Create renderer instance
const renderer = new Renderer({
  element: svgContainer,
  data: [],
  thickness : config.LINE_WIDTH
});

// Define what kind of media you want to acquire (type, resolution, etc)
// according to getUserMedia API
const mediaConstraints = {
  audio: false,
  video: {
    width: config.WIDTH,
    aspectRatio: {
      exact: config.WIDTH / config.HEIGHT
    }
  }
};

// Capture media from Webcam
navigator.mediaDevices.getUserMedia(mediaConstraints)
  .then((mediaStream) => {
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e) {
      video.play();
    };
  })
  .catch((err) => {
    console.log(err.name + ": " + err.message);
  });


// When worker posts a message, process it
worker.addEventListener('message', function(e) {
  renderer.setData(e.data); // pass the received data to the renderer instance
}, false);

worker.onerror = function(error) {
  console.log('Worker error: ' + error.message + '\n');
  throw error;
};

// When image needs to be turned into squiggles, we need to post the image pixel data
// and the config to the worker
function processImage() {
  worker.postMessage({ data: imagePixels, config: config});
}

// Attach click even to "Capture" button
captureButton.addEventListener('click', () => {
  drawButton.style.display = 'inline-block';

  // Set the video and canvas width / height to the target size of our SVG
  video.setAttribute('width', config.WIDTH);
  video.setAttribute('height', config.HEIGHT);
  canvas.width = config.WIDTH;
  canvas.height = config.HEIGHT;
  // Clear the canvas
  context.clearRect(0, 0, config.WIDTH, config.HEIGHT);
  context.drawImage(video, 0, 0, config.WIDTH, config.HEIGHT);
  // Retrieve all pixels from the image
  imagePixels = context.getImageData(0, 0, config.WIDTH, config.HEIGHT);
  // Send the pixels to the worker
  processImage();
});

drawButton.addEventListener('click', () => {
  drawButton.classList.add('disabled');

  const svgDoctype = '<?xml version="1.0" standalone="no"?>'
    + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

  // serialize our SVG XML to a string.
  let svgString = (new XMLSerializer()).serializeToString(d3.select('svg').node());

  // reduce the SVG path by cutting off floating point values after the first digit beyond floating point (~50% less MBs)
  svgString = svgString.replace(/([\-+]?\d{1,}\.\d{3,}([eE][\-+]?\d+)?)/g, function (x) {
    return (+x).toFixed(1)
  });

  const blob = new Blob([svgDoctype + svgString], {type: 'image/svg+xml;charset=utf-8'});

  console.log(blob);
  /*
  // If you wanted to upload the image instead, use something like this:

  const oReq = new XMLHttpRequest();
  oReq.open("POST", serverIPAddress + ':3000/upload', true);
  oReq.onload = function (oEvent) {
    console.log('uploaded!', oEvent);
  };

  oReq.onreadystatechange = () => {
    if (oReq.readyState === 4 && oReq.status === 200) {
      drawButton.classList.remove('disabled');
    }
  };

  oReq.send(blob);*/
});


// Attach listener to each of the range sliders
rangesliderJs.create(lineCountValue, {
  onSlideEnd: (val) => {
    lineCountValueEl.innerHTML = val;
    config.LINE_COUNT = val;
    processImage();
  },
  onSlide: (val) => {
    lineCountValueEl.innerHTML = val;
  }
});

rangesliderJs.create(amplitudeValue, {
  onSlideEnd: (val) => {
    amplitudeValueEl.innerHTML = val;
    config.AMPLITUDE = val;
    processImage();
  },
  onSlide: (val) => {
    amplitudeValueEl.innerHTML = val;
  }
});

rangesliderJs.create(lineSpacingValue, {
  onSlideEnd: (val) => {
    lineSpacingValueEl.innerHTML = val;
    config.SPACING = val;
    processImage();
  },
  onSlide: (val) => {
    lineSpacingValueEl.innerHTML = val;
  }
});

rangesliderJs.create(frequencyValue, {
  onSlideEnd: (val) => {
    frequencyValueEl.innerHTML = val;
    config.FREQUENCY = val;
    processImage();
  },
  onSlide: (val) => {
    frequencyValueEl.innerHTML = val;
  }
});

rangesliderJs.create(brightnessValue, {
  onSlideEnd: (val) => {
    brightnessValueEl.innerHTML = val;
    config.BRIGHTNESS_ADJUSTMENT = val;
    processImage();
  },
  onSlide: (val) => {
    brightnessValueEl.innerHTML = val;
  }
});

rangesliderJs.create(contrastValue, {
  onSlideEnd: (val) => {
    contrastValueEl.innerHTML = val;
    config.CONTRAST_ADJUSTMENT = val;
    processImage();
  },
  onSlide: (val) => {
    contrastValueEl.innerHTML = val;
  }
});



