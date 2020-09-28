<template>
    <path v-bind:style="{strokeWidth: stroke.width, fill: stroke.fill, stroke: stroke.color}" :d="pathD"></path>
</template>

<script>
  export default {
    name: "svgChartLine",
    props: ["d", "stroke", "drawCurve"],
    computed: {
      pathD() {
		let path = "";
		if(this.drawCurve == false || this.d.values.length <= 3) {
			//
			//use SVG line commands to draw
			//			
			this.d.values.forEach((point, index) => {
			  if (index === 0) {
				path += `M ${Math.round(point[0]*100)/100},${Math.round(point[1]*100)/100}`;
			  } else {
				path += ` L${Math.round(point[0] * 100) / 100},${Math.round(point[1]*100)/100}`
			  }
			});
		} else {
			//
			//use SVG curve commands to draw
			//
			// source:
			//   https://github.com/processing-js/processing-js/blob/master/processing.js
			//
			//   line 16517 : curveVertex
			//
			let vertArray = this.d.values;
			let vertArrayLength = vertArray.length;
			let curTightness = 0;
			let b = [];		
			let s = 1 - curTightness;
			//
			//--------------------------------------------
			// Matrix to convert from Catmull-Rom to cubic Bezier
			// where t = curTightness
			// |0         1          0         0       |
			// |(t-1)/6   1          (1-t)/6   0       |
			// |0         (1-t)/6    1         (t-1)/6 |
			// |0         0          0         0       |
			//--------------------------------------------
			//
			if( vertArrayLength > 3 ) {
				for (let i = 0; (i+2) < vertArrayLength; i++) {
					if(i == 0) {
						path += `M ${Math.round(vertArray[i][0]*100)/100},${Math.round(vertArray[i][1]*100)/100}`;
					} else {
						let cachedVertArray = vertArray[i];
						b[0] = [cachedVertArray[0], cachedVertArray[1]];
						b[1] = [cachedVertArray[0] + (s * vertArray[i+1][0] - s * vertArray[i-1][0]) / 6,
							   cachedVertArray[1] + (s * vertArray[i+1][1] - s * vertArray[i-1][1]) / 6];
						b[2] = [vertArray[i+1][0] + (s * vertArray[i][0] - s * vertArray[i+2][0]) / 6,
							   vertArray[i+1][1] + (s * vertArray[i][1] - s * vertArray[i+2][1]) / 6];
						b[3] = [vertArray[i+1][0], vertArray[i+1][1]];
						path += ` C${Math.round(b[1][0]*100)/100},${Math.round(b[1][1]*100)/100},${Math.round(b[2][0]*100)/100},${Math.round(b[2][1]*100)/100},${Math.round(b[3][0]*100)/100},${Math.round(b[3][1]*100)/100}`;
					}	
				}
			}
		}
        return path;
      }
    }
  }
</script>
