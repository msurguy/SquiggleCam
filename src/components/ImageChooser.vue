<template>
  <div class="image-chooser">
    <div class="button-group stretch">
      <label>Input:</label>
      <button id="upload" :disabled="disabled" v-bind:class="{ active: selectedItem === 'upload' }" class="btn" @click="toggle">File</button>
      <button id="webcam" :disabled="disabled" class="btn" v-bind:class="{ active: selectedItem === 'webcam' }" @click="toggle">WebCam</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ImageChooser",
    data: function(){
      return {
        selectedItem: "upload",
        disabled: false
      }
    },
    methods: {
      toggle: function (event) {
          this.selectedItem = event.target.id;
          this.$emit('selected', this.selectedItem);
      }
    }
  }
</script>

<style scoped>

</style>
