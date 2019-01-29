<template>
    <path :d="pathD" style="stroke-width: 1.5px; fill: none; stroke: #000000;"></path>
</template>

<script>
  export default {
    name: "svgChartLine",
    props: ["d"],
    computed: {
      pathD() {
        let path = "";

        this.d.values.forEach((point, index) => {
          if (index === 0) {
            path += `M ${point[0]},${point[1]}`;
          } else {
            path += `L${Math.round(point[0] * 100) / 100},${Math.round(point[1]*100)/100}`
          }
        });
        return path;
      }
    }
  }
</script>
