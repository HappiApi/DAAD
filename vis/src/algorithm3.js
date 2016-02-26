var daah = daah || {};

daah.getSightPolygon = function(x, y, polygon) {
  polygon = polygon.map(function(p) {
    return {x: p[0], y: p[1]};
  });

  var visPolygon = visibilityPolygon({x:x, y:y}, polygon).map(function(p) {
    return [p.x, p.y];
  });

  return visPolygon;
};

var EPSILON = 1e-9;

function rayIntersection(ray, segment) {
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null
    };
    denominator = ((segment[1].y - segment[0].y) * (ray[1].x - ray[0].x)) -
                  ((segment[1].x - segment[0].x) * (ray[1].y - ray[0].y));
    if (denominator === 0) {
        return null;
    }
    a = ray[0].y - segment[0].y;
    b = ray[0].x - segment[0].x;
    numerator1 = ((segment[1].x - segment[0].x) * a) - ((segment[1].y - segment[0].y) * b);
    numerator2 = ((ray[1].x - ray[0].x) * a) - ((ray[1].y - ray[0].y) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;
    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = ray[0].x + (a * (ray[1].x - ray[0].x));
    result.y = ray[0].y + (a * (ray[1].y - ray[0].y));

    if (a > 0 && b > 0 && b < 1) {
        return result;
    }
    return null;
}

function getSegments(array) {
  var accumulator = [];
  for (var i = 0; i < array.length; i++) {
    accumulator.push([array[i], array[(i+1) % array.length]]);
  }
  return accumulator;
}

function getDistance(a, b) {
  var dx = b.x - a.x;
  var dy = b.y - a.y;
  return Math.sqrt(dy*dy + dx*dx);
}

function crossProduct(a, b) {
  return a.x * b.y - a.y * b.x;
}

function pointLiesOn(point, segment) {
  var a = segment[0];
  var b = segment[1];
  var c = point;

  var result = getDistance(a, c) + getDistance(c, b) - getDistance(a, b);

  return result < EPSILON && result > -EPSILON;
}

function normaliseAngle(x) {
  while (x > 2 * Math.PI) x -= 2 * Math.PI;
  while (x < 0) x += (2 * Math.PI);
  return x;
}

function angleFromTo(a, b) {
  return normaliseAngle(Math.atan2(b.y - a.y, b.x - a.x));
}

function angleWithinGenerator(a, b) {
  var diff = angleDifference(a, b);
  return function(x) {
    return angleDifference(a, x) <= diff;
  }
}

function angleDifference(a, b) {
  return normaliseAngle(b - a);
}

function pointsInOrder(polygon, a, b) {
  for (var i = 0; i < polygon.length; i++) {
    var current = polygon[i];
    if (_.isEqual(current, a)) {
      return true;
    } else if (_.isEqual(current, b)) {
      return false;
    }
  }
}

function ccw(a, b, c) {
  return (b.x - a.x) * (c.y - a.y) > (b.y - a.y) * (c.x - a.x)
}

function visibilityPolygon(guard, polygon) {

  var points = _.clone(polygon);
  var segments = getSegments(polygon);
  var angleWithinBounds = function() { return true; }

  var visPolygon = [];

  var liesOnSegment;
  var pointIndex = _.findIndex(polygon, guard);

  // if guard is part of polygon, do not send rays to it
  // actually, send rays to it, but ignore distances == 0
  if (pointIndex !== -1) {
    console.log("there is a guard on a vertex");
    var nextIndex = (pointIndex + 1) % polygon.length;
    var prevIndex = (pointIndex - 1 + polygon.length) % polygon.length;
    angleWithinBounds = angleWithinGenerator(
      angleFromTo(polygon[pointIndex], polygon[nextIndex]),
      angleFromTo(polygon[pointIndex], polygon[prevIndex])
    );
    visPolygon.push({x: guard.x, y: guard.y});
  } else if (liesOnSegment = _.find(segments, function(segment) { return pointLiesOn(guard, segment); })) {
    console.log("there is a guard on a segment");
    var a = liesOnSegment[0];
    var b = liesOnSegment[1];
    var angle = angleFromTo(a, b);
    angleWithinBounds = angleWithinGenerator(angle, angle + Math.PI);
  }

  points = points.map(function(point) {
    return {
      x: point.x,
      y: point.y,
      angle: angleFromTo(guard, point),
      distance: getDistance(point, guard)
    };
  });

  points = _.sortBy(points, ["angle", "distance"]);
  // points = _.sortedUniqBy(points, "angle");

  for (var i = 0; i < points.length; i++) {

    var point = points[i];

    if (!angleWithinBounds(point.angle)) {
      console.log("angle not in within bounds:", point);
      continue;
    }

    var closestDistance = Infinity;
    var closestSegment;
    var closestIntersection;

    segments.forEach(function(segment) {
      var ray = [guard, point];
      var intersectionPoint = rayIntersection(ray, segment);
      var distance = Infinity;
      if (intersectionPoint) distance = getDistance(guard, intersectionPoint);
      if (distance && distance < closestDistance) {
        closestDistance = distance;
        closestSegment = segment;
        closestIntersection = intersectionPoint;
      }
    });

    var p = {x: point.x, y: point.y};

    if (point.distance <= closestDistance) {
      var passThrough = ccw(guard, points[i], points[(i-1+points.length) % points.length])
                     == ccw(guard, points[i], points[(i+1) % points.length]);
      console.log(ccw(guard, points[i], points[(i-1+points.length) % points.length]), ccw(guard, points[i], points[(i+1) % points.length]), passThrough);
      if (passThrough && closestIntersection) {
        if (pointsInOrder(polygon, p, closestIntersection)) {
          visPolygon.push(closestIntersection);
          visPolygon.push(p);
        } else {
          visPolygon.push(p);
          visPolygon.push(closestIntersection);
        }
      } else {
        visPolygon.push(p);
      }
    } else if (closestIntersection) {
      // visPolygon.push(closestIntersection);
    } else {
      console.log("Problem");
      debugger;
    }
  }

  // console.log(visPolygon);

  // if (visPolygon.length < 4) debugger;

  // visPolygon.sort(function(a,b) {
  //   var ai = _.findIndex(polygon, {x:a.x, y:a.y});
  //   if (ai == -1) ai = _.findIndex(segments, function(segment) {
  //     return pointLiesOn({x:a.x, y:a.y}, segment);
  //   });
  //   var bi = _.findIndex(polygon, {x:b.x, y:b.y});
  //   if (bi == -1) bi = _.findIndex(segments, function(segment) {
  //     return pointLiesOn({x:b.x, y:b.y}, segment);
  //   });
  //   return ai - bi;
  // });

  return visPolygon;
}
