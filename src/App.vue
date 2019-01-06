<template>
  <div id="app">
    <ImageProvider/>
  </div>
</template>

<script>
import ImageProvider from './components/ImageProvider'

export default {
  name: 'App',
  components: {
    ImageProvider
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
