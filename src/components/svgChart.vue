<template>
  <svg xmlns="http://www.w3.org/2000/svg" :view-box.camel="viewbox" :width="width" :height="height">
    <g>
    <svg-chart-line :d="line" v-for="(line, index) in lines" :key="index"></svg-chart-line>
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
