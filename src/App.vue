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
            <loader v-if="!data.loaded" ref="loader" :data="data"></loader>
            <crop-actions v-if="data.loaded" :data="data" @change="change"></crop-actions>
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
                    :width="webcam.width"
                    :height="webcam.height"
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
            <input type="range" min="0" max="0.25" step="0.01" v-model="line.smoothing">
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
            <button class="btn">
              PNG
            </button>
            <button class="btn">
              SVG
            </button>
            <button class="btn">
              ZIP
            </button>
          </div>
          <div class="panel-toggle">
            <button id="panelToggler" class="btn"><span class="fa fa-chevron-left"></span></button>
          </div>
        </aside>
        <main>
          <img :src="webcam.img">

          <div class="svg-container" ref="container">
            <svg-chart :lines="lines" :options="line" :svg="svg"></svg-chart>
          </div>

          <editor v-if="data.loaded" ref="editor" :data="data"></editor>
        </main>
      </div>
    </div>

  </div>
</template>

<script>
  import Navbar from './components/Navbar'
  import Loader from './components/Loader'
  import Editor from './components/Editor'
  import ImageChooser from './components/ImageChooser'
  import WebCam from './components/WebCam'
  import svgChart from './components/svgChart';

  export default {
  name: 'App',
  components: {
    cropActions: Navbar ,
    loader: Loader,
    editor: Editor,
    imageChooser: ImageChooser,
    webcam: WebCam,
    svgChart: svgChart
  },
  data() {
    return {
      line: {
        smoothing: 0.15,
        flattening: 0.5
      },
      lines: [],
      svg: {
        w: 500,
        h: 500
      },
      inputType: "upload",
      settings: {
        frequency: 50,
        amplitude: 1.2,
        lineCount: 12,
        brightness: 0,
        contrast: 0,
        minBrightness: 0,
        maxBrightness: 255,
        spacing: 2,
      },
      webcam: {
        img: null,
        camera: null,
        deviceId: null,
        device: null,
        devices: [],
        streaming: false,
        width: 500,
        height: 500
      },
      data: {
        cropped: false,
        cropping: false,
        loaded: false,
        name: '',
        previousUrl: '',
        type: '',
        url: '',
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
    }
  },

  methods: {
    processImage(data) {
      this.$worker.run((data) => {
        // Gather all necessary data from the main thread
        let config = data.config;
// context.getImageData(0, 0, config.WIDTH, config.HEIGHT);
        let imagePixels = data.image;
        const width = data.config.width;
        const height = data.config.height;

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
        let horizontalLineSpacing = Math.floor(height/config.lineCount); // Number of pixels to advance in vertical direction
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
      }, [data])
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
      this.processImage({
        config: {
          width: this.webcam.width,
          height: this.webcam.height,
          amplitude: this.settings.amplitude,
          frequency: this.settings.frequency,
          lineCount: this.settings.lineCount,
          brightness: this.settings.brightness,
          contrast: this.settings.contrast,
          minBrightness: this.settings.minBrightness,
          maxBrightness: this.settings.maxBrightness,
          spacing: this.settings.spacing
        },
        image: this.$refs.webcam.getCanvasRaw()
      });
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
    change(action) {
      const { editor } = this.$refs;
      switch (action) {
        case 'crop':
          editor.crop();
          break;
        case 'clear':
          editor.clear();
          break;
        case 'restore':
          editor.restore();
          break;
        case 'remove':
          editor.reset();
          break;
        default:
      }
    },
    onInputSelected(type) {
      this.inputType = type;
    }
  }
}
</script>

<style lang="scss">
  @import './styles/index.scss';

  .cropper-header {
    background-color: #666;
    height: 3rem;
    overflow: hidden;
    padding-left: 1rem;
    padding-right: 1rem;
    position: relative;
    z-index: 1;
  }
  @media (min-width: 768px) {
    .cropper-header {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }
  .title {
    color: #fff;
    display: block;
    float: left;
    font-size: 1.125rem;
    line-height: 3rem;
  }
</style>
