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
                    width="500"
                    height="500"
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
          Frequency
        </span>
            <input type="range" min="10" max="200" v-model="settings.lineCount">
            <div class="output">{{ settings.lineCount }}</div>
          </div>
          <div class="slider">
        <span class="label">
          Frequency
        </span>
            <input type="range" min="0.1" max="5" step="0.1" v-model="settings.amplitude">
            <div class="output">{{ settings.amplitude }}</div>
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

export default {
  name: 'App',
  components: {
    cropActions: Navbar ,
    loader: Loader,
    editor: Editor,
    imageChooser: ImageChooser,
    webcam: WebCam
  },
  data() {
    return {
      inputType: "upload",
      settings: {
        frequency: 50,
        amplitude: 1.2,
        lineCount: 50
      },
      webcam: {
        img: null,
        camera: null,
        deviceId: null,
        device: null,
        devices: [],
        streaming: false
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
    onCapture() {
      this.webcam.img = this.$refs.webcam.capture();
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
  },
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
