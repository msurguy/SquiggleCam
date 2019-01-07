<template>
  <div>
    <img v-bind:src="imagePreview" alt="">
    <input type="file" @change="updatePreview">
    <canvas ref="originalCanvas"></canvas>
    <canvas ref="resizedCanvas" width="300" height="300"></canvas>
  </div>
</template>

<script>
  import Pica from 'pica';
  import getOrientation from '../lib/imageUtils';

  export default {
    name: "FileUploader",
    data: function(){
      return {
        offscreenImage: null,
        uploadedFile: {
          name: '',
          size: 0,
          type: '',
        },
        uploadedImage: {
          width: 0,
          height: 0,
          data: [],
          orientation: 0
        },
        imagePreview: '',
        pica: undefined
      }
    },
    created: function(){
      //this.offscreenImage = new Image();
      const img = new Image();
      this.offscreenImage = img;

      img.onload = () => {
        console.log(img);
      };

      this.pica = Pica();
    },
    methods: {
      orientImage(canvas, ctx, orientation) {
        let width = canvas.width;
        let height = canvas.height;

        if (!orientation || orientation > 8) return;

        if (orientation > 4) {
          ctx.canvas.width = height;
          ctx.canvas.height = width;
        }

        switch (orientation) {

          case 2:
            // Horizontal flip
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
            break;

          case 3:
            // rotate 180 degrees left
            ctx.translate(width, height);
            ctx.rotate(Math.PI);
            break;

          case 4:
            // Vertical flip
            ctx.translate(0, height);
            ctx.scale(1, -1);
            break;

          case 5:
            // Vertical flip + rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.scale(1, -1);
            break;

          case 6:
            // Rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(0, -height);
            break;

          case 7:
            // Horizontal flip + rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(width, -height);
            ctx.scale(-1, 1);
            break;

          case 8:
            // Rotate left
            ctx.rotate(-0.5 * Math.PI);
            ctx.translate(-width, 0);
            break;

          default:
        }
      },
      openUpload() {
        //
      },
      loadImage(file){
        const ctx = this.$refs.originalCanvas.getContext('2d');
        let orientation;


        //image = new Image();

        // this.offscreenImage.onerror = () => { N.wire.emit('notify', t('err_image_invalid')); };

        this.offscreenImage.onload =  () => {
          this.$refs.originalCanvas.width  = this.offscreenImage.width;
          this.$refs.originalCanvas.height = this.offscreenImage.height;

          this.orientImage(this.$refs.originalCanvas, ctx, this.uploadedImage.orientation);

          let imageWidth = this.$refs.originalCanvas.width;
          let imageHeight = this.$refs.originalCanvas.height;

          ///let canvasCropped = document.createElement('canvas');

          //canvasCropped.width  = 500;
          //canvasCropped.height = 500;

          //let ctxCropped = canvasCropped.getContext('2d');

          //console.log(this.pica);
          ctx.drawImage(this.offscreenImage, 0, 0, this.offscreenImage.width, this.offscreenImage.height);

          this.pica.resize(this.$refs.originalCanvas, this.$refs.resizedCanvas)
            .then(() => this.pica.toBlob(this.$refs.resizedCanvas, 'image/jpeg', 90))
            .then(function (blob) {
              console.log(blob);
            })
            .catch((e) => {
              console.log(e);
              //N.wire.emit('notify', t('err_image_invalid'));
              throw 'CANCELED';
            });

          //this.resizeImage();

        };

        let reader = new FileReader();

        reader.onloadend = e => {
          this.uploadedImage.orientation = getOrientation(e.target.result);
          this.offscreenImage.src = window.URL.createObjectURL(file);
        };

        reader.readAsArrayBuffer(file);

      },
      updatePreview(e) {
        let files = e.target.files;
        const allowedFiles = ['image/jpeg', 'image/png', 'image/jpg'];
        //const pica = Pica();

        if (files.length === 0) {
          console.log('No files were selected');
        }

        if (!allowedFiles.includes(files[0].type)){
          console.log(`${files[0].name} is not an image`);
          return;
        }

        const file = files[0];
        this.loadImage(file);

        // let source = document.createElement('canvas');
        // let dest = document.createElement('canvas');
        //
        // source.width = 1600;
        // source.height = 1600;
        //
        // dest.width = 400;
        // dest.height = 400;

        // const reader = new FileReader();
        //
        // reader.onloadend = e => {
        //   //let fileData = new Uint8Array(reader.result);
        //   this.offscreenImage.src = window.URL.createObjectURL(file);
        //
        // }

        //reader.onload = (e) => {
        //  this.imagePreview = this.imageData = e.target.result;

        //source.getContext('2d').drawImage(img, cropX, 0, width, img.height);


        //pica.resize(this.imagePreview, this.$refs.resizedPreview)
        //  .then(result => console.log('resize done!'));
        //};

        //reader.readAsDataURL(files[0]);
      }
    }
  }
</script>

<style scoped>

</style>
