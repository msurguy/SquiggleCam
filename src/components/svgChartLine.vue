<template>
    <path :style="styles.path" :d="pathD"></path>
</template>

<script>
  import * as lib from "../lib";

  export default {
    name: "svgChartLine",
    props: ["d", "o"],
    computed: {
      styles() {
        return {
          path: {
            fill: 'none',
            stroke: "#000",
            strokeWidth: 1
          }
        };
      },
      pathD() {
        return this.pointsPositions.reduce((acc, e, i, a) => i === 0
          ? `M ${e[0]},${e[1]}`
          : `${acc} ${this.bezierCommand(e, i, a)}`
          , "");
      },
      pointsPositions() {
        return this.d.values
      }
    },
    methods: {
      line(pointA, pointB) {
        const lengthX = pointB[0] - pointA[0];
        const lengthY = pointB[1] - pointA[1];
        return {
          length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
          angle: Math.atan2(lengthY, lengthX)
        };
      },
      controlPoint(current, previous, next, reverse) {
        const p = previous || current;
        const n = next || current;
        const o = this.line(p, n);
        // work in progress…
        const flat = lib.map(Math.cos(o.angle) * this.o.flattening, 0, 1, 1, 0)
        const angle = o.angle * flat + (reverse ? Math.PI : 0);
        const length = o.length * this.o.smoothing;
        const x = current[0] + Math.cos(angle) * length;
        const y = current[1] + Math.sin(angle) * length;
        return [x, y];
      },
      bezierCommand(point, i, a) {
        const cps = this.controlPoint(a[i - 1], a[i - 2], point);
        const cpe = this.controlPoint(point, a[i - 1], a[i + 1], true);
        //const close = i === a.length - 1 ? " z" : "";
        return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
      }
    }
  }
</script>

<style scoped>

</style>
