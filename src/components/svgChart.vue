<template>
  <svg :style="{ background: background}" xmlns="http://www.w3.org/2000/svg" :view-box.camel="viewbox" :width="width+offset" :height="height+offset">
    <g>
    <svg-chart-line :d="line" :stroke="stroke"  :drawCurve="drawCurve" v-for="(line, index) in lines" :key="index"></svg-chart-line>
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
    props: ["lines", "black","width","height","strokeWidth","imageScaleUp","drawCurve","offset"],
    computed: {
      viewbox() {
        //return `0 0 ${this.width} ${this.height}`;
		return `0 0 ${this.width+this.offset} ${this.height+this.offset}`;
      },
      background(){
        return this.black ? '#000000' : '#FFFFFF'
      },
      stroke(){
        return {
          color: this.black ? '#FFFFFF' : '#000000',
          fill: 'none',
          width: (this.strokeWidth/this.imageScaleUp)+'px'
        }
      }
    }
  }
</script>

<style>

</style>
