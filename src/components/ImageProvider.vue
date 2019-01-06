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
        imageData: null,
        imagePreview: ''
      }
    },
    methods: {
      openUpload() {
        //
      },
      updatePreview(e) {
        let files = e.target.files;
        const allowedFiles = ['image/jpeg', 'image/png', 'image/jpg'];
        const pica = Pica();

        if (files.length === 0) {
          console.log('No files were selected');
        }

        if (!allowedFiles.includes(files[0].type)){
          console.log(`${files[0].name} is not an image`);
          return;
        }

        let source = document.createElement('canvas');
        let dest = document.createElement('canvas');

        source.width = 1600;
        source.height = 1600;

        dest.width = 400;
        dest.height = 400;

        const reader = new FileReader();

        reader.onload = (e) => {
          this.imagePreview = this.imageData = e.target.result;

          source.getContext('2d').drawImage(img, cropX, 0, width, img.height);


          pica.resize(this.imagePreview, this.$refs.resizedPreview)
            .then(result => console.log('resize done!'));
        };

        reader.readAsDataURL(files[0]);
      }
    }
  }
</script>

<style scoped>

</style>
