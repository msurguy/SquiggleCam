<template>
  <div id="app">
    <div class="wrapper">
      <div class="container">
        <aside id="panel">
          <div class="header">
            <!--<button class="btn btn-primary btn-circle"><i class="fa fa-angle-left"></i></button>-->
            <h2>SquiggleCam</h2>
          </div>

          <div class="accordion">
            <div class="option">
              <input type="checkbox" checked id="toggle1" class="toggle" />
              <label class="title" for="toggle1">
                Image Selection
              </label>
              <div class="content">
                <div class="image-inputs">
                  <image-chooser @selected="onInputSelected"></image-chooser>

                  <div class="image-upload" v-if="this.inputType === 'upload'">
                    <croppa v-model="cropper" :width="settings.width/2" :height="settings.height/2" :preventWhiteSpace="false" :quality="2"></croppa>
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
                </div>
              </div>
            </div>

            <div class="option">
              <input type="checkbox" id="toggle2" class="toggle" />
              <label class="title" for="toggle2">Paper Settings</label>
              <div class="content">
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
              </div>
            </div>

            <div class="option">
              <input type="checkbox" id="toggle3" class="toggle" />
              <label class="title" for="toggle3">Image Adjustments</label>
              <div class="content">
                <div class="slider">
                  <span class="label">
                    Brightness
                  </span>
                  <input type="range" min="-100" max="100" v-model="settings.brightness">
                  <div class="output">{{ settings.brightness }}</div>
                </div>

                <div class="slider">
                  <span class="label">
                    Contrast
                  </span>
                  <input type="range" min="-100" max="100"  v-model="settings.contrast">
                  <div class="output">{{ settings.contrast }}</div>
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

              </div>
            </div>

            <div class="option">
              <input type="checkbox" id="toggle4" class="toggle" />
              <label class="title" for="toggle4">Squiggle Settings</label>
              <div class="content">
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
              </div>
            </div>

          </div>

          <div class="section-title">
            Download:
          </div>
          <div class="actions">

            <button class="btn btn-block" @click="downloadSVG">
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
      cropper: {},
      dataUrl: '',
      lines: [],
      inputType: "upload",
      settings: {
        frequency: 150,
        amplitude: 1,
        lineCount: 50,
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
    'settings.minBrightess': function(){
      this.processImage();
    },
    'settings.maxBrightness': function(){
      this.processImage();
    },
    'settings.brightness': function(){
      this.processImage();
    },
    'settings.contrast': function(){
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
      this.cropper.generateBlob((blob) => {
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
        const imagePixels = data.image;
        const width = parseInt(config.width);
        const height = parseInt(config.height);
        const contrast = parseInt(config.contrast);
        const brightness = parseInt(config.brightness);
        const lineCount = parseInt(config.lineCount);
        const minBrightness = parseInt(config.minBrightness);
        const maxBrightness = parseInt(config.maxBrightness);
        const spacing = parseFloat(config.spacing);

// Create some defaults for squiggle-point array
        let squiggleData = [];
        let r = 5;
        let a = 0;
        let b;
        let z;
        let currentLine = []; // create empty array for storing x,y coordinate pairs
        let currentVerticalPixelIndex = 0;
        let currentHorizontalPixelIndex = 0;
        let contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast)); // This was established through experiments
        let horizontalLineSpacing = Math.floor(height / lineCount); // Number of pixels to advance in vertical direction
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
          for (let x = spacing; x < width; x += spacing ) {

            currentHorizontalPixelIndex = x + currentVerticalPixelIndex; // Get array position of current pixel

            // When there is contrast adjustment, the calculations of brightness values are a bit different
            if (contrast !== 0) {
              // Determine how bright a pixel is, from 0 to 255 by summing three channels (R,G,B) multiplied by some coefficients
              b = (0.2125 * ((contrastFactor * (imagePixels.data[4 * currentHorizontalPixelIndex] - 128) + 128 )
                + brightness)) + (0.7154 * ((contrastFactor * (imagePixels.data[4 * (currentHorizontalPixelIndex + 1)] - 128) + 128)
                + brightness)) + (0.0721 * ((contrastFactor*(imagePixels.data[4*(currentHorizontalPixelIndex+2)]-128)+128) + brightness));
            } else {
              b = (0.2125 * (imagePixels.data[4*currentHorizontalPixelIndex] + brightness)) + (0.7154 * (imagePixels.data[4*(currentHorizontalPixelIndex + 1)]+ brightness)) + (0.0721 * (imagePixels.data[4*(currentHorizontalPixelIndex + 2)] + brightness));
            }

            b = Math.max(minBrightness,b);    // Set minimum line curvature to value set by the user
            z = Math.max(maxBrightness-b,0);  // Set maximum line curvature to value set by the user

            // The magic of the script, determines how high / low the squiggle goes
            r = config.amplitude * z / lineCount;

            a += z / config.frequency;
            currentLine.push([x,y + Math.sin(a)*r]);
          }
          //currentLine.push([config.width, y]);
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
</style>
