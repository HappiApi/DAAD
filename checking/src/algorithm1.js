// The algorithm that checks if a given
// set of guards can 'see' the entire polygon
// by sampling around interesting vertices

import _ from 'lodash';
import d3 from 'd3';
import parser from './parse.js';

// Line intersection from:
// http://jsfiddle.net/justin_c_rounds/Gd2S2/
function checkLineIntersection(line1, line2) {
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null
    };
    denominator = ((line2[1].y - line2[0].y) * (line1[1].x - line1[0].x)) - ((line2[1].x - line2[0].x) *
    (line1[1].y - line1[0].y));
    if (denominator === 0) {
        return null;
    }
    a = line1[0].y - line2[0].y;
    b = line1[0].x - line2[0].x;
    numerator1 = ((line2[1].x - line2[0].x) * a) - ((line2[1].y - line2[0].y) * b);
    numerator2 = ((line1[1].x - line1[0].x) * a) - ((line1[1].y - line1[0].y) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;
    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1[0].x + (a * (line1[1].x - line1[0].x));
    result.y = line1[0].y + (a * (line1[1].y - line1[0].y));

    if (a > 0 && a < 1 && b > 0 && b < 1) {
        return result;
    }
    return null;
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
