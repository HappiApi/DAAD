// Temp file to quickly visualize polygons

import _ from 'lodash';
import d3 from 'd3';

var svg = d3.select("body").append("svg")
    .attr("width", 600)
    .attr("height", 600);

function findMinOrMax(polygons, mfunction, index) {
  let minPolygons = _.map(polygons, polygon => _.map(polygon, a => a[index]));
  return mfunction(_.flatten(minPolygons));
}


function drawPolygons(polygons) {
  let scaleX = d3.scale.linear()
    .domain([findMinOrMax(polygons, _.min, 0), findMinOrMax(polygons, _.max, 0)])
    .range([0, 600]);

  let scaleY = d3.scale.linear()
    .domain([findMinOrMax(polygons, _.min, 1), findMinOrMax(polygons, _.max, 1)])
    .range([0, 600]);

  svg.selectAll("polygon")
  .data(polygons)
  .enter()
  .append("polygon")
  .attr("points",function(d) {
      return d.map(function(d) {
      return [scaleX(d[0]),scaleY(d[1])].join(",");
    }).join(" ");
  })
  .attr("stroke","black")
  .attr("stroke-width",2);
}


drawPolygons([[[ 100, 90 ], [ 100, 100 ], [ 90, 100 ], [ 90, 90 ] ] ]);
