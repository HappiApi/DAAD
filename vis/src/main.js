var filepath = "txt/vis.pol.txt";
var interactiveMouse = false;

var width = 960,
    height = 600,
    padding = 20;

var x = d3.scale.linear()
    .range([padding, width - padding]);

var y = d3.scale.linear()
    .range([height - padding, padding]);

var zoomBehavior = d3.behavior.zoom()
    .scaleExtent([0.5, 20])
    .x(x)
    .y(y)
    .on("zoom", zoom);

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height)
    .call(zoomBehavior)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .on("click", click);

var context = canvas.node().getContext("2d");

var polygon = [];
var guards = [];
var mouseGuard = null;
var i = 1;


daah.getFile(filepath).then(function(data) {
  window.data = data;
  setPolygon(data[i].map);
  setGuards(data[i].guards);
});

var coordsElem = document.querySelector(".position");

function mousemove() {
  var mouse = d3.mouse(this);
  var coords = [
    x.invert(mouse[0]),
    y.invert(mouse[1])
  ]
  coordsElem.innerHTML = "(" + coords.map(d => d.toPrecision(5)).join(",") + ")";
  if (interactiveMouse) {
    mouseGuard = coords;
    redraw = true;
  }
}

function mouseleave() {
  mouseGuard = null;
}

function click() {
  if (d3.event.defaultPrevented || !interactiveMouse) return;
  guards.push(_.clone(mouseGuard));
}

function zoom() {
  redraw = true;
}

function drawPolygon(polygon) {

  context.fillStyle = "black";
  context.fillRect(0,0,width,height);
  context.save();

  drawPolygonPath(polygon);

  context.fillStyle = "white";
  context.fill();
  context.restore();
}

function drawPolygonPath(polygon) {
  context.beginPath();
  polygon.forEach(function(coords, i) {
    var cx = x(coords[0]),
        cy = y(coords[1]);
    context[i == 0 ? "moveTo" : "lineTo"](cx, cy);
  });
  context.closePath();
}

function drawGuards(guards) {
  context.save();
  guards.forEach(function(coords) {
    context.beginPath();
    context.arc(x(coords[0]), y(coords[1]), 3, 0, 2*Math.PI);
    context.fillStyle = "#f94";
    context.fill();
  });
  context.restore();
}

function drawVisibilityPolygon(guards) {
  var sightPolygons = guards.map(function(d) {
    return daah.getSightPolygon(d[0], d[1], polygon);
  });
  context.save();
  drawPolygonPath(polygon);
  context.clip();
  sightPolygons.forEach(function(polygon) {
    context.beginPath();
    drawPolygonPath(polygon);
    context.fillStyle = "red";
    context.fill();
    // polygon.forEach(function(coords) {
    //   context.beginPath();
    //   context.arc(x(coords[0]), y(coords[1]), 3, 0, 2*Math.PI);
    //   context.fillStyle = "#a00";
    //   context.fill();
    // });
  });
  context.restore();
}

function getWidth(range) {
  return Math.abs(range[1] - range[0]);
}

function evenAspectRatio(xScale, yScale) {

  var xDomain = xScale.domain();
  var yDomain = yScale.domain();

  var xPPI = getWidth(xDomain) / getWidth(xScale.range());
  var yPPI = getWidth(yDomain) / getWidth(yScale.range());

  var ppi = Math.max(xPPI, yPPI);

  xCentre = (xDomain[1] + xDomain[0]) / 2;
  yCentre = (yDomain[1] + yDomain[0]) / 2;

  x.domain([
    xCentre - ppi * getWidth(xScale.range()) / 2,
    xCentre + ppi * getWidth(xScale.range()) / 2
  ]);

  y.domain([
    yCentre - ppi * getWidth(yScale.range()) / 2,
    yCentre + ppi * getWidth(yScale.range()) / 2
  ]);
}

var redraw = true;

function draw() {
  if (redraw) {
    context.clearRect(0, 0, width, height);
    var allGuards = _.clone(guards);
    if (mouseGuard) allGuards.push(mouseGuard);
    drawPolygon(polygon);
    drawVisibilityPolygon(allGuards);
    drawGuards(allGuards);
    redraw = false;
  }
  window.requestAnimationFrame(draw);
}

draw();


function setPolygon(newPolygon) {
  polygon = newPolygon || [];
  zoomBehavior.translate([0,0]);
  zoomBehavior.scale(1);
  var xs = newPolygon.map(_.first);
  var ys = newPolygon.map(_.last);
  x.domain(d3.extent(xs));
  y.domain(d3.extent(ys));
  evenAspectRatio(x, y);
  zoomBehavior.x(x)
  zoomBehavior.y(y);
  redraw = true;
}

function setGuards(newGuards) {
  guards = newGuards || [];
  redraw = true;
}

window.addEventListener("keydown", function(event) {
  if (event.keyCode == 37 || event.keyCode == 39) {
    i += event.keyCode == 37 ? -1 : 1;
    setPolygon(data[i].map)
    setGuards(data[i].guards);
    event.preventDefault();
  }
})
