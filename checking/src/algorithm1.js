// The algorithm that checks if a given
// set of guards can 'see' the entire polygon
// by sampling around interesting vertices

import _ from 'lodash';
import d3 from 'd3';
import parser from './parse.js';

// Gets to slope of 2 lines
function getSlopes(line1, line2) {
  let m1, m2;
  m1 = (line1[1][1] - line1[0][1]) / (line1[1][0] - line1[0][0]);
  m2 = (line2[1][1] - line2[0][1]) / (line2[1][0] - line2[0][0]);

  if(m1 === Infinity || m2 === Infinity ||
      m1 === -Infinity || m2 === -Infinity) {
    return [0, 0];
  }
  return [m1, m2];
}

// Returns the intersection of 2 finite lines, if the lines
// don't intersect, the function returns null
// Lines are in the format:
// line = [{x: xcoord, y: ycoord}, {x: xcoord, y: ycoord}];
function lineIntersection(line1, line2) {
  let m = getSlopes(line1, line2);
  let x = m[1] * line2[0][0] - m[0] * line1[0][0] - line2[0][1] + line1[0][1];
  x = x / (m[0] - m[1]);
  if(x === Infinity || x === -Infinity || isNaN(x)) {
    return null;
  }
  let y = m[0]*(x - line1[0][0]) - line1[0][1];
  x = -x; y = -y;

  let min = {x: _.min(line1.map(a => a[0])), y: _.min(line1.map(a => a[1]))};
  let max = {x: _.max(line1.map(a => a[0])), y: _.max(line1.map(a => a[1]))};

  if(x < min[0] || x > max[0] || y < min[1] || y > max[1]) {
    return null;
  }
  return {x, y};
}

// Returns an array of lines that represent the
// rays
function calculateRays(polygon, guard) {
  return _.map(polygon, a =>
      [{x: a.x, y: a.y}, {x: guard.x, y: guard.y}]);
}

// Adds the intersection of 2 rays to the interesting
// vertices
function addInterestingPoints(rays, all_rays, vertices) {
  for(let i = 0; i < all_rays.length; i++) {
    for(let j = 0; j < rays.length; j++) {
      let intersection = lineIntersection(all_rays[i], all_rays[j]);
      if(intersection !== null) {
        vertices.append(intersection);
      }
    }
  }
  return _.uniqBy(vertices, _.isEqual);
}

// returns if the point is inside the polygon
// based on:
// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
function pointInPolygon(polygon, point) {
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

// Given a visibility polygon, calculates the intersection
// between rays and adds those points to
// potential vertices
function findPoints(polygon, guard, all_rays, vertices) {
  let rays = calculateRays(polygon, guard);
  // Check if it has seen any of the interesting point and remove those
  vertices = _.filter(vertices, a => !pointInPolygon(polygon, a));
  vertices = addInterestingPoints(rays, all_rays, vertices);
  all_rays = _.flatten([all_rays, rays]);
}


// Goes over all of the vertices that have not been
// seen yet, then goes over all of the visibility
// polygons and checks if the point is inside
// returns the point of null if there is no point
function check_potential_areas(polygons, vertices) {
  vertices = _.filter(vertices, a => !a.seen);
  for(let i = 0; i < vertices.length; i++) {
    for(let j = 0; j < polygons; j++) {
      if(!pointInPolygon(polygons[j], vertices[i])) {
        return vertices[i];
      }
    }
  }
  return null;
}

function sampleAroundVertices(polygons, vertices) {
  for(let i = 0; i < vertices.length; i++) {
    // create samples somehow
    // check if samples are in either of the polygon
  }
}

// Gets the polygon in the format [[x, y], [x, y]]
// and the guards in the same format
// it either returns null or coordinates of a refutation point
function algorithm(polygon, guards) {
  let vertices = _.map(polygon, a => ({x: a[0], y: a[1], seen: false}));
  let visibility_polygons = [];
  let rays = [];

  for(let i = 0; i < guards.length; i++) {
    // let visibility_polygon = visibilityPolygon(polygon, guard);
    // visibility_polygons.push(visibility_polygon);
    findPoints(visibility_polygon, guards[i], rays, vertices);

  }
  vertices = check_potential_areas(visibility_polygons, vertices);
  let refutation = sampleAroundVertices(visibility_polygons, vertices);
  console.log(refutation);
}
