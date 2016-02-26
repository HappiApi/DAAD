// The algorithm that checks if a given
// set of guards can 'see' the entire polygon
// by sampling around interesting vertices

import _ from 'lodash';
import d3 from 'd3';
import parser from './parse.js';
import visibilityPolygon from './visibility.js';

// Line intersection from:
// http://jsfiddle.net/justin_c_rounds/Gd2S2/
function lineIntersection(p, line1, line2) {
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

  if(pointInPolygon(p, result)) {
    return result;
  }
  if (a > 0 && a < 1 && b > 0 && b < 1) {
    return result;
  }
  return null;
}

// Returns an array of lines that represent the
// rays
function calculateRays(polygon, guard) {
  return _.map(polygon, a => [{x: a.x, y: a.y},
    {x: guard.x, y: guard.y}]);
}

// Adds the intersection of 2 rays to the interesting
// vertices
function addInterestingPoints(p, rays, all_rays, vertices) {
  for(let i = 0; i < all_rays.length; i++) {
    for(let j = 0; j < rays.length; j++) {
      let intersection = lineIntersection(p, all_rays[i], rays[j]);
      if(intersection !== null) {
        vertices.push(intersection);
      }
    }
  }
  return _.uniq(vertices);
}

// returns if the point is inside the polygon
// based on:
// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
function pointInPolygon(polygon, point) {
  for(let i = 0; i < polygon.length; i++) {
    if(polygon[i].x == point.x && polygon[i].y == point.y) {
      return true;
    }
  }

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
function findPoints(p, polygon, guard, all_rays, vertices) {
  let rays = calculateRays(polygon, guard);
  // Check if it has seen any of the interesting point and remove those
  vertices = _.filter(vertices, a => !pointInPolygon(polygon, a));
  vertices = addInterestingPoints(p, rays, all_rays, vertices);
  return [_.flatten([all_rays, rays]), vertices];
}


// Goes over all of the vertices that have not been
// seen yet, then goes over all of the visibility
// polygons and checks if the point is inside
// returns the point of null if there is no point
function check_potential_areas(polygons, vertices) {
  let potential_points = [];
  vertices = _.filter(vertices, a => !a.seen);
  for(let i = 0; i < vertices.length; i++) {
    for(let j = 0; j < polygons.length; j++) {
      if(pointInPolygon(polygons[j], vertices[i])) {
        break;
      }
    }
    potential_points.push(vertices[i]);
  }
  return _.uniq(potential_points);
}

function findPoint(point, angle, distance) {
  let x = point.x + Math.cos(angle) * distance;
  let y = point.y + Math.sin(angle) * distance;
  return {x, y};
}

function distanceFromVertex(polygon, point) {
  for(let i = 0; i < polygon.length; i++) {
    let dx = Math.pow(polygon[i].x - point.x, 2);
    let dy = Math.pow(polygon[i].y - point.y, 2);
    let total = Math.pow(dx + dy, 1/2);
    if(total < 0.0000001) return true;
  }
  return false;
}

function checkIfPointIsSeen(polygon, polygons, point) {
  if(!pointInPolygon(polygon, point)) {
    return true;
  }
  for(let i = 0; i < polygons.length; i++) {
    if(pointInPolygon(polygons[i], point)) {
      return true;
    }
  }
  return false;
}

function sampleAroundVertices(polygon, polygons, vertices) {
  for(let i = 0; i < vertices.length; i++) {
    let distance = 0.000001; // epsilon
    let angle = 0;
    let angleIncrement = (Math.PI * 2) / 100;
    for(let j = 0; j < 100; j++) {
      if(distanceFromVertex(polygon, vertices[i])) break;
      let point = findPoint(vertices[i], angle, distance);
      if(!checkIfPointIsSeen(polygon, polygons, point)) {
        return point;
      }
      angle += angleIncrement;
    }
  }
  return null;
}


// Gets the polygon in the format [[x, y], [x, y]]
// and the guards in the same format
// it either returns null or coordinates of a refutation point
export default function algorithm(polygon, guards) {
  let vertices = _.cloneDeep(polygon);
  let visibility_polygons = [];
  let rays = [];
  for(let i = 0; i < guards.length; i++) {
    let visibility_polygon = visibilityPolygon(polygon, guards[i]);
    visibility_polygon = _.uniq(visibility_polygon);
    visibility_polygons.push(visibility_polygon);
    let temp = findPoints(polygon, visibility_polygon, guards[i], rays, vertices);
    rays = temp[0];
    vertices = temp[1];
  }
  vertices = check_potential_areas(visibility_polygons, vertices);
  if(vertices.length === 0) vertices = _.cloneDeep(polygon);
  let refutation = sampleAroundVertices(polygon, visibility_polygons, vertices);
  return refutation;
}
