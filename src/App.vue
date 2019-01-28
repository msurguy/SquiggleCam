<template>
  <div id="app">
    <div class="wrapper">
      <div class="container">
        <aside id="panel">
          <div class="header">
            <button class="btn btn-primary btn-circle"><i class="fa fa-angle-left"></i></button>
            <h2>SquiggleCam</h2>
          </div>

          <image-chooser @selected="onInputSelected"></image-chooser>

          <div class="image-upload" v-if="this.inputType === 'upload'">
            <croppa v-model="myCroppa" :width="settings.width/2" :height="settings.height/2" :preventWhiteSpace="true" :quality="2"></croppa>
            <button class="btn btn-primary btn-block" style="display:block;" @click="uploadCroppedImage">Use Image</button>
          </div>

          <div class="image-webcam" v-if="this.inputType === 'webcam'">
            <div class="video-controls">
              <select v-model="webcam.camera">
                <option>- Select Device: -</option>
                <option v-for="device in webcam.devices"
                        :key="device.deviceId"
                        :value="device.deviceId">{{ device.label }}</option>
              </select>
              <button v-if="webcam.streaming"
                      type="button"
                      class="btn btn-sm"
                      @click="onStop"><svg width="12" height="12"><rect width="12" height="12" style="fill:rgb(255,0,0)" />
              </svg></button>
              <button type="button"
                      class="btn btn-sm"
                      v-if="!webcam.streaming"
                      @click="onStart">Start</button>
            </div>

            <webcam ref="webcam"
                    :device-id="webcam.deviceId"
                    :width="settings.width"
                    :height="settings.height"
                    @started="onStarted"
                    @stopped="onStopped"
                    @error="onError"
                    @cameras="onCameras"
                    @camera-change="onCameraChange" />

            <button type="button"
                    class="btn btn-record"
                    v-if="webcam.streaming"
                    @click="onCapture">
              <svg height="48" width="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="23" stroke="white" stroke-width="1" fill="#D41616" />
              </svg>
            </button>
          </div>

          <div class="section-title">
            Squiggle Controls:
          </div>

          <div class="slider">
        <span class="label">
          Width
        </span>
            <input type="range" min="200" max="500" v-model="settings.width">
            <div class="output">{{ settings.width }}</div>
          </div>

          <div class="slider">
        <span class="label">
          Height
        </span>
            <input type="range" min="200" max="500" v-model="settings.height">
            <div class="output">{{ settings.height }}</div>
          </div>

          <div class="slider">
        <span class="label">
          Min brightness
        </span>
            <input type="range" min="0" max="255" v-model="settings.minBrightness">
            <div class="output">{{ settings.minBrightness }}</div>
          </div>

          <div class="slider">
        <span class="label">
          Max brightness
        </span>
            <input type="range" min="0" max="255" v-model="settings.maxBrightness">
            <div class="output">{{ settings.maxBrightness }}</div>
          </div>

          <div class="slider">
        <span class="label">
          Frequency
        </span>
            <input type="range" min="5" max="256" v-model="settings.frequency">
            <div class="output">{{ settings.frequency }}</div>
          </div>
          <div class="slider">
        <span class="label">
          Line Count
        </span>
            <input type="range" min="10" max="200" v-model="settings.lineCount">
            <div class="output">{{ settings.lineCount }}</div>
          </div>
          <div class="slider">
            <span class="label">
              Amplitude
            </span>
            <input type="range" min="0.1" max="5" step="0.1" v-model="settings.amplitude">
            <div class="output">{{ settings.amplitude }}</div>
          </div>

          <div class="slider">
            <span class="label">
              Smoothing
            </span>
            <input type="range" min="0" max="0.5" step="0.05" v-model="line.smoothing">
            <div class="output">{{ line.smoothing}}</div>
          </div>

          <div class="slider">
            <span class="label">
              Flattening
            </span>
            <input type="range" min="0" max="1" step="0.01" v-model="line.flattening">
            <div class="output">{{ line.flattening }}</div>
          </div>

          <div class="section-title">
            Download:
          </div>
          <div class="actions">

            <button class="btn" @click="downloadSVG">
              SVG
            </button>
          </div>

        </aside>
        <main>
          <div v-if="canvasData" class="svg-container" style="padding: 10px;" ref="container">
            <svg-chart ref="svgResult" :lines="lines" :options="line" :width="settings.width" :height="settings.height"></svg-chart>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
  import ImageChooser from './components/ImageChooser'
  import WebCam from './components/WebCam'
  import svgChart from './components/svgChart';

  export default {
  name: 'App',
  components: {
    imageChooser: ImageChooser,
    webcam: WebCam,
    svgChart: svgChart
  },
  data() {
    return {
      myCroppa: {},
      dataUrl: '',
      line: {
        smoothing: 0.25,
        flattening: 0.5
      },
      lines: [],
      inputType: "upload",
      settings: {
        frequency: 150,
        amplitude: 1,
        lineCount: 54,
        brightness: 0,
        contrast: 0,
        minBrightness: 0,
        maxBrightness: 255,
        spacing: 1,
        width: 500,
        height: 500
      },
      canvasData: null,
      webcam: {
        img: null,
        camera: null,
        deviceId: null,
        device: null,
        devices: [],
        streaming: false
      },
    };
  },

  watch: {
    'webcam.camera': function(id) {
      this.webcam.deviceId = id;
    },
    'webcam.devices': function() {
      // Once we have a list select the first one
      let first = this.webcam.devices[0];
      if (first) {
        this.webcam.camera = first.deviceId;
        this.webcam.deviceId = first.deviceId;
      }
    },
    'settings.frequency': function(){
      this.processImage();
    },
    'settings.lineCount': function(){
      this.processImage();
    },
    'settings.amplitude': function(){
      this.processImage();
    },
    'canvasData': function(){
      this.processImage();
    }
  },

  methods: {
    downloadSVG(){
      const svgDoctype = '<?xml version="1.0" standalone="no"?>'
        + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

      // serialize our SVG XML to a string.
      const svgString = (new XMLSerializer()).serializeToString(this.$refs.svgResult.$el);
      const blob = new Blob([svgDoctype + svgString], {type: 'image/svg+xml;charset=utf-8'});

      /* This portion of script saves the file to local filesystem as a download */
      const svgUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "squiggleCam_" + Date.now() + ".svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },
    uploadCroppedImage() {
      this.myCroppa.generateBlob((blob) => {
        let canvas = document.createElement("canvas");
        canvas.width = this.settings.width;
        canvas.height = this.settings.height;
        //   const ctx = canvas.getContext("2d");
        //   this.canvasData = ctx.getImageData(0, 0, 500, 500);

        const ctx = canvas.getContext('2d');
        let img = new Image();

        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          this.canvasData = ctx.getImageData(0, 0, this.settings.width, this.settings.height);
        };

        img.src = URL.createObjectURL(blob);
      }, 'image/jpeg', 1)
    },
    processImage() {
      this.$worker.run((data) => {
        // Gather all necessary data from the main thread
        let config = data.config;
// context.getImageData(0, 0, config.WIDTH, config.HEIGHT);
        let imagePixels = data.image;
        let width = parseInt(config.width);
        let height = parseInt(config.height);

// Create some defaults for squiggle-point array
        let squiggleData = [];
        let r = 5;
        let a = 0;
        let b;
        let z;
        let currentLine = []; // create empty array for storing x,y coordinate pairs
        let currentVerticalPixelIndex = 0;
        let currentHorizontalPixelIndex = 0;
        let contrastFactor = (259 * (config.contrast + 255)) / (255 * (259 - config.contrast)); // This was established through experiments
        let horizontalLineSpacing = Math.floor(height/parseInt(config.lineCount)); // Number of pixels to advance in vertical direction
        //console.log(horizontalLineSpacing);

// Iterate line by line (top line to bottom line) in increments of horizontalLineSpacing
        //let tmpCounter = 0;
        for (let y = 0; y < height; y+= horizontalLineSpacing) {
          a = 0;
          currentLine = [];
          currentLine.push([0, y]); // Start the line

          currentVerticalPixelIndex = y*width;  // Because Image Pixel array is of length width * height,
                                                // starting pixel for each line will be this

          // Loop through pixels from left to right within the current line, advancing by increments of config.SPACING
          //console.log(config.spacing, width);
          for (let x = config.spacing; x < width; x += config.spacing ) {

            currentHorizontalPixelIndex = x + currentVerticalPixelIndex; // Get array position of current pixel

            // When there is contrast adjustment, the calculations of brightness values are a bit different
            if (config.contrast !== 0) {
              // Determine how bright a pixel is, from 0 to 255 by summing three channels (R,G,B) multiplied by some coefficients
              b = (0.2125 * ((contrastFactor * (imagePixels.data[4 * currentHorizontalPixelIndex] - 128) + 128 )
                + config.brightness)) + (0.7154 * ((contrastFactor * (imagePixels.data[4 * (currentHorizontalPixelIndex + 1)] - 128) + 128)
                + config.brightness)) + (0.0721 * ((contrastFactor*(imagePixels.data[4*(currentHorizontalPixelIndex+2)]-128)+128) + config.brightness));
            } else {
              b = (0.2125 * (imagePixels.data[4*currentHorizontalPixelIndex] + config.brightness)) + (0.7154 * (imagePixels.data[4*(currentHorizontalPixelIndex + 1)]+ config.brightness)) + (0.0721 * (imagePixels.data[4*(currentHorizontalPixelIndex + 2)] + config.brightness));
            }

            b = Math.max(config.minBrightness,b);    // Set minimum line curvature to value set by the user
            z = Math.max(config.maxBrightness-b,0);  // Set maximum line curvature to value set by the user

            // The magic of the script, determines how high / low the squiggle goes
            r = config.amplitude * z / config.lineCount;

            a += z / config.frequency;
            currentLine.push([x,y + Math.sin(a)*r]);
            //currentLine.push([x,y + 10 * (tmpCounter%2 ? -1 : 1)]);
            //tmpCounter++;
          }
          currentLine.push([config.width, y]);
          squiggleData.push(currentLine);
        }

        return squiggleData;
      }, [{
        config: Object.assign({}, this.settings),
        image: this.canvasData
      }])
        .then(result => {
          this.lines = [];

          result.forEach( line => {
            this.lines.push({values: line});
          })
        })
        .catch(e => {
          console.error(e)
        })
    },
    onCapture() {
      this.webcam.img = this.$refs.webcam.capture();
      this.canvasData = this.$refs.webcam.getCanvasRaw();
    },
    onStarted(stream) {
      this.webcam.streaming = true;
      //console.log("On Started Event", stream);
    },
    onStopped(stream) {
      this.webcam.streaming = false;
      //console.log("On Stopped Event", stream);
    },
    onStop() {
      this.$refs.webcam.stop();
    },
    onStart() {
      this.$refs.webcam.start();
    },
    onError(error) {
      //console.log("On Error Event", error);
    },
    onCameras(cameras) {
      this.webcam.devices = cameras;
      //console.log("On Cameras Event", cameras);
    },
    onCameraChange(deviceId) {
      this.webcam.deviceId = deviceId;
      this.webcam.camera = deviceId;
      //console.log("On Camera Change Event", deviceId);
    },
    onInputSelected(type) {
      this.inputType = type;
    }
  }
}
</script>

<style lang="scss">
  @import './styles/index.scss';

  /*.cropper-header {*/
    /*background-color: #666;*/
    /*height: 3rem;*/
    /*overflow: hidden;*/
    /*padding-left: 1rem;*/
    /*padding-right: 1rem;*/
    /*position: relative;*/
    /*z-index: 1;*/
  /*}*/
  /*@media (min-width: 768px) {*/
    /*.cropper-header {*/
      /*padding-left: 1.5rem;*/
      /*padding-right: 1.5rem;*/
    /*}*/
  /*}*/
  .title {
    color: #fff;
    display: block;
    float: left;
    font-size: 1.125rem;
    line-height: 3rem;
  }
</style>
