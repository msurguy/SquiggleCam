<template>
  <svg :view-box.camel="viewbox" :width="svg.w" :height="svg.h">
    <g>
    <svg-chart-line :d="line" :o="options" :svg="svg" v-for="line in lines" :key="line.id"></svg-chart-line>
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
    props: ["lines", "options", "svg"],
    computed: {
      viewbox() {
        return `0 0 ${this.svg.w} ${this.svg.h}`;
      }
    }
  }
</script>

<style scoped>

</style>
