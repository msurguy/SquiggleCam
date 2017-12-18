import * as d3 from "d3" // TODO: only import d3 modules that are needed for this script;

/**
 * Simple class that takes point array and creates SVG lines connecting the points line by line
 */
export default class Renderer {

  constructor(opts) {
    // get data array and element reference
    this.data = opts.data;
    this.element = opts.element;

    // Create an empty group that will store all lines
    this.plot =  this.element.append('g');
    this.thickness = opts.thickness; // Set line thickness
    this.addLines(); // Generate lines from array of points
  }

  addLines() {
    // Create paths with array of points
    let lines =  this.plot.selectAll("path")
      .data(this.data);

    // Use first coordinate from data array point as X coordinate, second as Y coordinate
    let drawLine = d3.line()
      .x(function(d) {
        return d[0];
      })
      .y(function(d) {
        return d[1];
      });
    //.curve(d3.curveNatural); // You can try setting some curvature for the
                               // generated lines (see http://bl.ocks.org/d3indepth/b6d4845973089bc1012dec1674d3aff8)

    // update the paths to reflect the latest data in the data array
    lines.enter().append("path")
      .attr("stroke", "black")
      .attr("stroke-width", this.thickness + "px")
      .attr("fill", "none")
      .merge(lines)
      .attr("d", (d) => {
        return drawLine(d)
      });
    // remove old lines from previous dataset
    lines.exit().remove();
  }

  // setThickness(thickness) {
  //   this.thickness = thickness;
  //   this.plot.selectAll("path")
  //     .attr("stroke-width", this.thickness + "px");
  // }

  /**
   * sets local data array to new array and updates the lines
   * @param newData
   */
  setData(newData) {
    this.data = newData;
    this.addLines();
  }
}