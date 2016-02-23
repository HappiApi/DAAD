import _ from 'lodash';
import d3 from 'd3';
import alg from './algorithm.js';
import parser from './parse.js';

function getSlopes(line1, line2) {
  let m1, m2;
  try {
    m1 = (line1[1].y - line1[0].y) / (line1[1].x - line1[0].x);
    m2 = (line2[1].y - line2[0].y) / (line2[1].x - line2[0].x);
  }
  catch(err) {
    console.log("Cannot divide by 0");
    return [0, 0];
  }
  return [m1, m2];
}

// Returns the intersection of 2 finite lines, if the lines
// don't intersect, the function returns null
// Lines are in the format:
// line = [{x: xcoord, y: ycoord}, {x: xcoord, y: ycoord}];
function line_intersection(line1, line2) {
  let m = getSlopes(line1, line2);
  let x = m[1] * line2[0].x - m[0] * line1[0].x - line2[0].y + line1[0].y;
  try {
    x = x / (m[0] - m[1]);
  }
  catch(err) {
    console.log("Cannot divide by 0");
    return null;
  }
  let y = m[0]*(x - line1[0].x) - line1[0].y;
  x = -x; y = -y;

  let min = {x: _.min(line1.map(a => a.x)), y: _.min(line1.map(a => a.y))};
  let max = {x: _.max(line1.map(a => a.x)), y: _.max(line1.map(a => a.y))};

  if(x < min.x || x > max.x || y < min.y || y > max.y) {
    return null;
  }
  return {x, y};
}

// returns if the point is inside the polygon
// based on:
// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
function point_in_polygon(polygon, point) {
  let x = point.x; let y = point.y;
  let inside = false;

  for(let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i].x, yi = polygon[i].y;
    let xj = polygon[j].x, yj = polygon[j].y;

    let intersect = ((yi > y) != (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Goes over all of the vertices that have not been
// seen yet, then goes over all of the visibility
// polygons and checks if the point is inside
// returns the point of null if there is no point
function check_potential_areas(polygons, vertices) {
  vertices = _.filter(vertices, a => !a.seen);
  for(let i = 0; i < vertices.length; i++) {
    for(let j = 0; j < polygons; j++) {
      if(!point_in_polygon(polygons[j], vertices[i])) {
        return vertices[i];
      }
    }
  }
  return null;
}

// Gets the polygon in the format [[x, y], [x, y]]
// and the guards in the same format
// it either returns null or coordinates of a refutation point
function algorithm(polygon, guards) {
  let vertices = _.map(polygon, a => ({x: a[0], y: a[1], seen: false}));
  let visibility_polygons = [];
  let rays = [];

  for(let i = 0; i < guards.length; i++) {
    visibility_polygons.push(calculateRays(polygon, vertices, rays, guard[i]));
  }
  return check_potential_areas(visibility_polygons, vertices);
}

function main() {
  parser.getCheck().then(function(data) {
    for(var key in data) {
      result = algorithm(data[key].map, data[key].guards);
      if(result !== null) {
        console.log(key + ': (' + result[0] + ', ' + result[1] + ')');
      } else {
        console.log(key + ": The entire area is covered");
      }
    }
  });
}

main();
