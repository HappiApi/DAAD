import polygonBoolean from '2d-polygon-boolean';
import visibilityPolygon from './visibility.js';
import _ from 'lodash';

let EPSILON = 0.000006;

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

function polygonArea(polygon) {
  area = 0;         // Accumulates area in the loop
  j = polygon.length - 1;  // The last vertex is the 'previous' one to the first

  for(let i = 0; i < polygon.length; i++) {
    area = area +  (polygon[j].x + polygon[i].x) * (polygon[j].y - polygon[i].y);
    j = i;  //j is previous vertex to i
  }
  return area/2;
}

// Marks all of the vertices that have been visited in the
// original polygon as visited
function markAsVisited(polygon, visibility_polygon) {
  for(let i = 0; i < polygon.length; i++) {
    let sameVertices = _.filter(visibility_polygon, a =>
      (a.x == polygon[i].x && a.y == polygon[i].y));
    if(sameVertices.length > 0) {
      polygon[i].seen = true;
    }
  }
  return polygon;
}

// Marks the vertices of interesting polygon as true
// and removes them from the array if all of the vertices
// have been seen
// It needs to check if the vertices are inside of the
// visibility polygon because sometimes a vertex of an
// interesting polygon is not a vertex of the main polygon
function filterInterestingPolygons(polygon, interesting_polygons) {
  for(let i = 0; i < interesting_polygons.length; i++) {
    for(let j = 0; j < interesting_polygons[i].length; j++) {
      if(pointInPolygon(polygon, interesting_polygons[i][j])) {
        interesting_polygons[i][j].visited = true;
      }
    }
    let all_visited = true;
    for(let j = 0; j < interesting_polygons[i].length; j++) {
      if(!interesting_polygons[i][j].visited) {
        all_visited = false; break;
      }
    }
    if(all_visited) {
      interesting_polygons.splice(i, 1); i--;
    }
  }
  return interesting_polygons;
}

// Helper function for pointLiesOnLine that checks
// if the point falls within the correct interval
function checkIfPointIsBetweenLine(line, point, dx, dy) {
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx > 0 ?
      line[0].x <= point.x && point.x <= line[1].x :
      line[1].x <= point.x && point.x <= line[0].x;
  }
else {
  return dyl > 0 ?
    line[0].y <= point.y && point.y <= line[1].y :
    line[1].y <= point.y && point.y <= line[0].y;
  }
}

// Returns whether the point lies on the line
function pointLiesOnLine(line, point) {
  let dxc = point.x - line[0].x;
  let dyc = point.y - line[0].y;
  let dx = line[1].x - line[0].x;
  let dy = line[1].y - line[0].y;
  let cross = dxc * dy - dyc * dx;

  if(cross !== 0) return false;
  return checkIfPointIsBetweenLine(line, point, dx, dy);
}

// Returns an array of rays from the guard
// to the visibility polygon
function constructRays(polygon, guard) {
  return _.map(polygon, a =>
    [{x: a.x, y:a.y}, {x: guard.x, y: guard.y}]);
}

// Returns a boolean that is true when the point
// is one of the endpoints of the given line
function checkEndOfLines(line, point) {
  if(point.x == line[0].x && point.y == line[0].y) return true;
  if(point.x == line[1].x && point.y == line[1].y) return true;
  return false;
}

// The point should always be a vertex of the
// polygon
function findIndexOfVertex(polygon, point) {
  for(let i = 0; i < polygon.length; i++) {
    if(polygon[i].x == point.x && polygon[i].y == point.y) return i;
  }
  return -1;
}

// Returns a point that is an angle/distance away
// from the given point
function findPointFromAngleDist(point, angle, distance) {
  let x = point.x + Math.cos(angle) * distance;
  let y = point.y + Math.sin(angle) * distance;
  return {x, y};
}

// Returns a random point inside of a polygon
function findPointInPolygon(polygon, line, epsilon) {
  let mnormal = 0;
  let lnormal = (line[1].y - line[0].y)/(line[1].x - line[0].x);
  if(lnormal !== Infinity && lnormal !== -Infinity) mnormal = -1 / lnormal;
  if(mnormal !== Infinity && mnormal !== -Infinity) mnormal = 0;
  let midpoint = {x: (line[1].x + line[0].x)/2, y: (line[1].y + line[0].y)/2};
  let point = {x: null, y: null};
  if(line[0].y > line[1].y) {
    point.x = midpoint.x + epsilon;
    point.y = mnormal(point.x - midpoint.x) + midpoint.y;
  } else if(line[1].y > line[0].y) {
    point.x = midpoint.x - epsilon;
    point.y = mnormal(point.x - midpoint.x) + midpoint.y;
  } else if(line[0].x < line[1].x){
    point.x = midpoint.x;
    point.y = midpoint.y + epsilon;
  } else {
    point.x = midpoint.x;
    point.y = midpoint.y - epsilon;
  }
  return point;
}

// Checks if point1 or point2 comes first, returns the correct
// line
function findLineInPolygon(polygon, point1, point2) {
  for(let i = 0; i < polygon.length; i++) {
    if(polygon[i].x == point1.x && polygon[i].y == point1.y) return [point1, point2];
    if(polygon[i].x == point2.x && polygon[i].y == point2.y) return [point2, point2];
  }
}

// Decides which polygon is not in the visibility
function decidePolygon(polygon, poly1, poly2, line) {
  let point = findPointInPolygon(polygon, line, EPSILON);
  if(pointInPolygon(poly1, point)) return poly2;
  return poly1;
}


// Constructs a new polygon that is interesting
function constructPolygon(polygon, visibility_polygon, ray, point) {
  let index = findIndexOfVertex(polygon, point);
  if(index == -1) return null;
  let firstPolygon = []; let secondPolygon = [];
  let addingToFirst = true;
  let intersectingPoint = ray[0]; // look at constructRays
  for(let i = 0; i < polygon.length; i++) {
    let a = (index + i) % polygon.length;
    let b = (index + i + 1) % polygon.length;
    if(addingToFirst) {
      firstPolygon.push(_.deepClone(polygon[a]));
      if(intersectingPoint.x == polygon[b].x && intersectingPoint.y == polygon[b].y) {
        firstPolygon.push(_.deepCopy(intersectingPoint));
        addingToFirst = false;
      } else if(pointLiesOnLine([polygon[a], polygon[b]], intersectingPoint)) {
        firstPolygon.push(_.deepCopy(intersectingPoint));
        addingToFirst = false;
        secondPolygon.push(_.deepCopy(intersectingPoint));
      }
    } else {
      secondPolygon.push(_.deepClone(polygon[a]));
      if(polygon[b].x == point.x && polygon[b].y == point.y) {
        secondPolygon.push(_.deepClone(point));
        break;
      }
    }
  }
  let tempLine = findLineInPolygon(visibility_polygon, intersectingPoint, point);
  return decidePolygon(visibility_polygon, firstPolygon, secondPolygon, tempLine);
}

// Gets a set of new interesing polygons
function checkIfCuts(polygon, visibility_polygon, guard) {
  debugger;
  let rays = constructRays(visibility_polygon, guard);
  let new_polygons = [];
  for(let i = 0; i < rays.length; i++) {
    debugger;
    for(var j = 0; j < polygon.length; j++) {
      if(checkEndOfLines(rays[i], polygon[j])) continue;
      if(pointLiesOnLine(rays[i], polygon[j])) {
        let pol = constructPolygon(polygon, visibility_polygon, rays[i], polygon[i]);
        if(pol !== null) new_polygons.push();
      }
    }
  }
  return new_polygons;
}

// This filters the new polygons by checking if all of the
// vertices have been seen or not
function filterNewPolygons(polygon, new_polygons) {
  for(let i = 0; i < new_polygons.length; i++) {
    let allseen = true;
    for(let j = 0; j < new_polygons[i].length; j++) {
      let index = findIndexOfVertex(polygon, new_polygons[i][j]);
      if(index != -1) {
        if(!polygon[index].seen) {
          allseen = false;
          break;
        }
      } // else do nothing because you know that point is seen
    }
    if(allseen) {
      new_polygons.splice(i, 1);
    }
  }
}

// Checks if the second polygon is a subset of the first
function polygonIsSubset(poly1, poly2) {
  for(let i = 0; i < poly2.length; i++) {
    if(!pointInPolygon(poly1, poly2[i])) return false;
  }
  return true;
}

// Checks if one polygon inside interesting polygons
// is a subset of another or the other way around.
function checkIfSubsets(interesting_polygons, new_polygons) {
  for(let i = 0; i < interesting_polygons.length; i++) {
    for(let j = 0; j < new_polygons.length; j++) {
      if(polygonIsSubset(interesting_polygons[i], new_polygons[j])) {
        new_polygons.slice(j, 1); j--;
      }
      else if(polygonIsSubset(new_polygons[j], interesting_polygons[i])) {
        interesting_polygons.slice(i, 1); i--;
      }
    }
  }
  return [interesting_polygons, new_polygons];
}

// Returns false if polygons are different. true otherwise
function compareTwoPolygons(poly1, poly2) {
  for(let i = 0; i < poly1.length; i++) {
    if(findIndexOfVertex(poly2, poly1[i]) == -1) return false;
  }
  return true;
}

// Checks if polygons intersect
function checkIntersections(interesting_polygons, new_polygons) {
  let newer_polygons = [];
  for(let i = 0; i < interesting_polygons.length; i++) {
    let subject = _.map(interesting_polygons[i], a => [a.x, a.y]);
    for(let j = 0; j < new_polygons.length; j++) {
      let clip = _.map(new_polygons[j], a => [a.x, a.y]);
      let intersection = polygonBoolean(subject, clip, 'and');
      intersection = _.map(intersection, a => ({x: a[0], y: a[1]}));
      if(!compareTwoPolygons(interesting_polygons[i], intersection)) {
        new_polygons.slice(j, 1); j--;
        interesting_polygons.slice(i, 1); i--;
        newer_polygons.push(intersection);
      }
    }
  }
  interesting_polygons.push.apply(interesting_polygons, new_polygons);
  interesting_polygons.push.apply(interesting_polygons, newer_polygons);
  return interesting_polygons;
}

// This function first tries to cut the original polygon
// and add a polygon to the interesting_polygons
// then it checks if it can cut any of the existing polygons
// into a smaller part
function cutPolygons(polygon, interesting_polygons, visibility_polygon, guard) {
  debugger;
  let new_polygons = checkIfCuts(polygon, visibility_polygon, guard);
  new_polygons = filterNewPolygons(polygon, new_polygons);
  let temp = checkIfSubsets(interesting_polygons, new_polygons);
  new_polygons = temp[1]; interesting_polygons = temp[0];
  interesting_polygons = checkIntersections(interesting_polygons, new_polygons);
  return interesting_polygons;
}

function checkIfPointIsSeen(visibility_polygons, point) {
  for(let i = 0; i < visibility_polygons.length; i++) {
    if(pointInPolygon(visibility_polygons[i], point)) {
      return true;
    }
  }
  return false;
}

// This function does the sampling in the
// interesting polygons
function doSampling(interesting_polygons, visibility_polygons) {
  for(let i = 0; i < interesting_polygons.length; i++) {
    for(let j = 0; j < interesting_polygons[i].length; j++) {
      let b = (j + 1) % interesting_polygons[i].length;
      let line = [interesting_polygons[i][j], interesting_polygons[i][b]];
      let point = findPointInPolygon(polygon, line, EPSILON);
      if(!checkIfPointIsSeen(visibility_polygons, point)) return point;
    }
  }
  return null;
}

// Actual algorithm, yaay
export default function algorithm(polygon, guards) {
  polygon = _.map(polygon, a => ({x: a.x, y: a.y, seen: false}));
  let visibility_polygons = [];
  let interesting_polygons = [];

  for(let i = 0; i < guards.length; i++) {
    let visibility_polygon = visibilityPolygon(polygon, guards[i]);
    visibility_polygons.push(visibility_polygon);
    polygon = markAsVisited(polygon, visibility_polygon);
    interesting_polygons = filterInterestingPolygons(polygon, interesting_polygons);
    interesting_polygons = cutPolygons(polygon, interesting_polygons, visibility_polygon, guards[i]);
  }
  return doSampling(interesting_polygons);
}
