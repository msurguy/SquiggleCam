<template>
  <div>
    <img v-bind:src="imagePreview" alt="">
    <input type="file" @change="updatePreview">
    <canvas ref="resizedPreview"></canvas>
  </div>
</template>

<script>
  import Pica from 'pica';

  export default {
    name: "FileUploader",
    data: function(){
      return {
        offscreenImage: null,
        imageData: null,
        imagePreview: '',
        imageOrientation: 0
      }
    },
    created: function(){
      //this.offscreenImage = new Image();
      const img = new Image();
      this.offscreenImage = img;

      img.onload = () => {
        console.log(img);
      }
    },
    methods: {
      getOrientation(data) {
        let view = new DataView(data);
        if (view.getUint16(0, false) != 0xFFD8)
        {
          return -2;
        }
        let length = view.byteLength, offset = 2;
        while (offset < length)
        {
          if (view.getUint16(offset+2, false) <= 8) return -1;
          let marker = view.getUint16(offset, false);
          offset += 2;
          if (marker == 0xFFE1)
          {
            if (view.getUint32(offset += 2, false) != 0x45786966)
            {
              return -1;
            }

            let little = view.getUint16(offset += 6, false) == 0x4949;
            offset += view.getUint32(offset + 4, little);
            let tags = view.getUint16(offset, little);
            offset += 2;
            for (let i = 0; i < tags; i++)
            {
              if (view.getUint16(offset + (i * 12), little) == 0x0112)
              {
                return view.getUint16(offset + (i * 12) + 8, little);
              }
            }
          }
          else if ((marker & 0xFF00) != 0xFF00)
          {
            break;
          }
          else
          {
            offset += view.getUint16(offset, false);
          }
        }
        return -1;
      },
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
        const ctx = this.$refs.resizedPreview.getContext('2d');
        let orientation;


          //image = new Image();

        // this.offscreenImage.onerror = () => { N.wire.emit('notify', t('err_image_invalid')); };

        this.offscreenImage.onload =  () => {
          this.$refs.resizedPreview.width  = this.offscreenImage.width;
          this.$refs.resizedPreview.height = this.offscreenImage.height;

            this.orientImage(this.$refs.resizedPreview, ctx, this.imageOrientation);

            let imageWidth = this.$refs.resizedPreview.width;
            let imageHeight = this.$refs.resizedPreview.height;

            ctx.drawImage(this.offscreenImage, 0, 0, this.offscreenImage.width, this.offscreenImage.height);
          };

          let reader = new FileReader();

          reader.onloadend = e => {
            this.imageOrientation = this.getOrientation(e.target.result);
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
