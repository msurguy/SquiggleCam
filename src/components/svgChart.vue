<template>
  <svg :style="{ background: background}" xmlns="http://www.w3.org/2000/svg" :view-box.camel="viewbox" :width="width" :height="height">
    <g>
    <svg-chart-line :d="line" :stroke="stroke" v-for="(line, index) in lines" :key="index"></svg-chart-line>
    </g>
  </svg>
</template>

<script>
  import svgChartLine from '../components/svgChartLine'
  export default {
    name: "svgChart",
    components: {
      svgChartLine
    },
    props: ["lines", "black","width","height"],
    computed: {
      viewbox() {
        return `0 0 ${this.width} ${this.height}`;
      },
      background(){
        return this.black ? '#000000' : '#FFFFFF'
      },
      stroke(){
        return {
          color: this.black ? '#FFFFFF' : '#000000',
          fill: 'none',
          width: '2px'
        }
      }
    }
  }
</script>

<style>

</style>
