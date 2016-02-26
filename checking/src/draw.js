// Temp file to quickly visualize polygons

import _ from 'lodash';
import d3 from 'd3';

let reverseX; let reverseY;

var svg = d3.select("body").append("svg")
    .attr("width", 600)
    .attr("height", 600)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

var x = d3.scale.linear()
    .range([0, 600]);

var y = d3.scale.linear()
    .range([0, 600]);

var coordsElem = document.querySelector(".position");

function mousemove() {
  var mouse = d3.mouse(this);
  var coords = [
    reverseX((mouse[0])),
    reverseY((mouse[1]))
  ];
  coordsElem.innerHTML = "(" + coords.map(d => d.toPrecision(5)).join(",") + ")";
  // mouseGuard = coords;
  // redraw = true;
}

function mouseleave() {
  // mouseGuard = null;
}

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

  reverseX = d3.scale.linear()
  .domain([0, 600])
  .range([findMinOrMax(polygons, _.max, 0), findMinOrMax(polygons, _.min, 0)]);

  reverseY = d3.scale.linear()
  .domain([0, 600])
  .range([findMinOrMax(polygons, _.max, 1), findMinOrMax(polygons, _.min, 1)]);


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

let temp1 = [{"x":-2,"y":-2,"seen":false},{"x":-0.5,"y":0,"seen":false},{"x":5,"y":0,"seen":true},{"x":2,"y":0.5,"seen":false},{"x":0,"y":5,"seen":false},{"x":0.2,"y":3,"seen":false}];
let temp2 = [{"x":5,"y":0,"param":0,"angle":2.976443976165166},{"x":5,"y":0,"param":0,"angle":2.976443976175166},{"x":-0.70186335406129,"y":0.9503105589516136,"param":5.780513460484457,"angle":2.976443976185166},{"x":-1.1199999999730714,"y":6.12007545472825e-11,"param":6.119999999973071,"angle":3.141592653579793},{"x":-1.12,"y":7.494838410781802e-16,"param":6.12,"angle":3.141592653589793},{"x":5,"y":0,"param":0,"angle":3.141592653599793}];

drawPolygons([_.map(temp2, a => [a.x, a.y]), _.map(temp1, a => [a.x, a.y])]);
