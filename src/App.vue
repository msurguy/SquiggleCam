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
          </div>

          <div class="section-title">
            Squiggle Controls:
          </div>
          <div class="slider">
        <span class="label">
          Frequency
        </span>
            <input type="range" min="1" max="200" value="60">
            <div class="output">0</div>
          </div>
          <div class="slider">
        <span class="label">
          Frequency
        </span>
            <input type="range" min="1" max="200" value="60">
            <div class="output">0</div>
          </div>
          <div class="slider">
        <span class="label">
          Frequency
        </span>
            <input type="range" min="1" max="200" value="60">
            <div class="output">200</div>
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

export default {
  name: 'App',
  components: {
    navbar: Navbar ,
    loader: Loader,
    editor: Editor,
    imageChooser: ImageChooser,
  },
  data() {
    return {
      inputType: "upload",

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
  methods: {
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
  @import '@/styles/index.scss';

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

  /*.main {*/
    /*background-color: #2E2E2E;*/
    /*bottom: 0;*/
    /*left: 0;*/
    /*position: absolute;*/
    /*right: 0;*/
    /*top: 3rem;*/
  /*}*/
</style>
