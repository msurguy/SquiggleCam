<template>
  <svg :view-box.camel="viewbox" :width="width" :height="height">
    <g>
    <svg-chart-line :d="line" :o="options" v-for="(line, index) in lines" :key="index"></svg-chart-line>
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
    props: ["lines", "options","width","height"],
    computed: {
      viewbox() {
        return `0 0 ${this.width} ${this.height}`;
      }
    }
  }
</script>

<style scoped>
  path {
    fill: none;
    stroke: #0f0f0f;
    stroke-width: 1.5px;
  }
</style>
