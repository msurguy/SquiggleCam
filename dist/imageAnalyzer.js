/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 467);
/******/ })
/************************************************************************/
/******/ ({

/***/ 467:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(468);


/***/ }),

/***/ 468:
/***/ (function(module, exports) {

/**
 * imageAnalyzer Web Worker accepts image data and configuration parameters
 * and returns array of x,y coordinates to draw squiggles
 *
 * It analyzes pixels for their average brightness and if brightness is closer to 0 -> makes lines less
 *  squiggly, if closer to 255 -> more squiggly
 *
 * This script runs in a webWorker thread in order to speed up processing of the image and
 * to detach the processing from the UI updates
 *
 * Majority of the logic in this script is taken from https://github.com/gwygonik/SquiggleDraw for the following exceptions:
 * - I implemented contrast adjustment that can be helpful in certain light conditions
 * - I increased the processing speed by removing unnecessary assignments and moving variable
 *    declarations out of the processing loop
 */

self.addEventListener('message', function (e) {
  // Gather all necessary data from the main thread
  var config = e.data.config;
  var imagePixels = e.data.data;
  var width = e.data.config.WIDTH;
  var height = e.data.config.HEIGHT;

  // Create some defaults for squiggle-point array
  var squiggleData = [];
  var r = 5;
  var a = 0;
  var b = void 0;
  var z = void 0;
  var currentCoordinates = []; // create empty array for storing x,y coordinate pairs
  var currentVerticalPixelIndex = 0;
  var currentHorizontalPixelIndex = 0;
  var contrastFactor = 259 * (config.CONTRAST_ADJUSTMENT + 255) / (255 * (259 - config.CONTRAST_ADJUSTMENT)); // This was established through experiments
  var horizontalLineSpacing = Math.floor(height / config.LINE_COUNT); // Number of pixels to advance in vertical direction

  // Iterate line by line (top line to bottom line) in increments of horizontalLineSpacing
  for (var y = 0; y < height; y += horizontalLineSpacing) {
    a = 0;
    currentCoordinates = [];
    currentCoordinates.push([0, y]); // Start the line

    currentVerticalPixelIndex = y * width; // Because Image Pixel array is of length width * height,
    // starting pixel for each line will be this

    // Loop through pixels from left to right within the current line, advancing by increments of config.SPACING
    for (var x = 1; x < width; x += config.SPACING) {
      currentHorizontalPixelIndex = x + currentVerticalPixelIndex; // Get array position of current pixel

      // When there is contrast adjustment, the calculations of brightness values are a bit different
      if (config.CONTRAST_ADJUSTMENT !== 0) {
        // Determine how bright a pixel is, from 0 to 255 by summing three channels (R,G,B) multiplied by some coefficients
        b = 0.2125 * (contrastFactor * (imagePixels.data[4 * currentHorizontalPixelIndex] - 128) + 128 + config.BRIGHTNESS_ADJUSTMENT) + 0.7154 * (contrastFactor * (imagePixels.data[4 * (currentHorizontalPixelIndex + 1)] - 128) + 128 + config.BRIGHTNESS_ADJUSTMENT) + 0.0721 * (contrastFactor * (imagePixels.data[4 * (currentHorizontalPixelIndex + 2)] - 128) + 128 + config.BRIGHTNESS_ADJUSTMENT);
      } else {
        b = 0.2125 * (imagePixels.data[4 * currentHorizontalPixelIndex] + config.BRIGHTNESS_ADJUSTMENT) + 0.7154 * (imagePixels.data[4 * (currentHorizontalPixelIndex + 1)] + config.BRIGHTNESS_ADJUSTMENT) + 0.0721 * (imagePixels.data[4 * (currentHorizontalPixelIndex + 2)] + config.BRIGHTNESS_ADJUSTMENT);
      }

      b = Math.max(config.MIN_BRIGHTNESS, b); // Set minimum line curvature to value set by the user
      z = Math.max(config.MAX_BRIGHTNESS - b, 0); // Set maximum line curvature to value set by the user

      // The magic of the script, determines how high / low the squiggle goes
      r = config.AMPLITUDE * z / config.LINE_COUNT;

      a += z / config.FREQUENCY;
      currentCoordinates.push([x, y + Math.sin(a) * r]);
    }
    squiggleData.push(currentCoordinates);
  }
  self.postMessage(squiggleData);
}, false);

/***/ })

/******/ });