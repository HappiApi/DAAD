import _ from 'lodash';
let daah = {};

daah.getSightPolygon = function(polygon, vertices, rays, guard) {
  let polygon1 = _.map(polygon, a => [a.x, a.y]);
  let segments = convertToSegments(polygon);
  let sightPolygon = getSightPolygon(guard.x, guard.y, segments);
  debugger;
  return convertToPolygon(sightPolygon);
};

function edges(array) {
  let accumulator = [];
  for (let i = 0; i < array.length - 1; i++) {
    accumulator.push([array[i], array[i+1]]);
  }
  return accumulator;
}

function convertToSegments(polygon) {
  let p = _.clone(polygon);
  if (p.length) p.push(polygon[0]);
  let points = p.map(function(d) {
    return { x: d[0], y: d[1] };
  });
  let segments = edges(points).map(function(d) {
    return { a: d[0], b: d[1] };
  });
  return segments;
}

function convertToPolygon(segments) {
  return segments.map(function(segment) {
    return [segment.x, segment.y];
  });
}

// Find intersection of RAY & SEGMENT
function getIntersection(ray,segment){
  // RAY in parametric: Point + Delta*T1
  let r_px = ray.a.x;
  let r_py = ray.a.y;
  let r_dx = ray.b.x-ray.a.x;
  let r_dy = ray.b.y-ray.a.y;
  // SEGMENT in parametric: Point + Delta*T2
  let s_px = segment.a.x;
  let s_py = segment.a.y;
  let s_dx = segment.b.x-segment.a.x;
  let s_dy = segment.b.y-segment.a.y;
  // Are they parallel? If so, no intersect
  let r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
  let s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
  if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){
    // Unit vectors are the same.
    return null;
  }
  // SOLVE FOR T1 & T2
  // r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
  // ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
  // ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
  // ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
  let T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
  let T1 = (s_px+s_dx*T2-r_px)/r_dx;
  // Must be within parametic whatevers for RAY/SEGMENT
  if(T1<0) return null;
  if(T2<0 || T2>1) return null;
  // Return the POINT OF INTERSECTION
  return {
    x: r_px+r_dx*T1,
    y: r_py+r_dy*T1,
    param: T1
  };
}

function getSightPolygon(sightX,sightY, segments){
  // Get all unique points
  let uniquePoints = _(segments)
      .map(function(segment) {
        return [segment.a, segment.b];
      })
      .flatten()
      .uniq()
      .value();
  // Get all angles
  let uniqueAngles = [];
  for(let j=0;j<uniquePoints.length;j++){
    let uniquePoint = uniquePoints[j];
    let angle = Math.atan2(uniquePoint.y-sightY,uniquePoint.x-sightX);
    uniquePoint.angle = angle;
    uniqueAngles.push(angle-0.0000001,angle,angle+0.0000001);
  }

  // RAYS IN ALL DIRECTIONS
  let intersects = [];
  for(let j=0;j<uniqueAngles.length;j++){
    let angle = uniqueAngles[j];

    // Calculate dx & dy from angle
    let dx = Math.cos(angle);
    let dy = Math.sin(angle);

    // Ray from center of screen to mouse
    let ray = {
      a:{x:sightX,y:sightY},
      b:{x:sightX+dx,y:sightY+dy}
    };

    //Check whether the ray points into the shape.
    let xToCheck = ray.b.x;
    let yToCheck = ray.b.y;
    let k;
    let p1 = {
      x:0.0,
      y:0.0
    };
    let p2 = {
      x: 0.0,
      y: 0.0
    };
    let angle2 = 0.0;

    for (k = 0; k < segments.length;k++) {
      p1.x = segments[k].a.x - xToCheck;
        p1.y = segments[k].a.y - yToCheck;
        p2.x = segments[(k+1)%segments.length].a.x - xToCheck;
        p2.y = segments[(k+1)%segments.length].a.y - yToCheck;

        let dtheta = 0.0,theta1 = 0.0,theta2=0.0;

        theta1 = Math.atan2(p1.y,p1.x);
        theta2 = Math.atan2(p2.y,p2.x);
        dtheta = theta2 - theta1;
        while (dtheta > Math.PI)
          dtheta -= Math.PI*2;
        while (dtheta < -Math.PI)
          dtheta += Math.PI*2;

        angle2 += dtheta;
    }

    let isInsideShape = (angle2/Math.PI*2 < 4.1) && (angle2/Math.PI*2 > 3.9);

    // Find CLOSEST intersection
    let closestIntersect = null;
    let closestIntersectLeftV = null;
    let closestIntersectRightV = null;
    for(let i=0;i<segments.length;i++) {
      let intersect = getIntersection(ray,segments[i]);
      if(!intersect) continue;
      if(isInsideShape) {
        if (intersect.x == sightX && intersect.y == sightY) {
          // console.log("Collided Vertex");
        }
        else if(!closestIntersect || intersect.param<closestIntersect.param) {
          closestIntersect=intersect;
        }
      }
      else if(!closestIntersect || intersect.param<closestIntersect.param) {
        closestIntersect=intersect;
      }
    }
    // Intersect angle
    if(!closestIntersect) continue;
    closestIntersect.angle = angle;

    // Add to list of intersects
    intersects.push(closestIntersect);
  }

  // Sort intersects by angle
  intersects = intersects.sort(function(a,b) {
    return a.angle-b.angle;
  });

  intersects = intersects.filter(function(a) {
    return !isNaN(a.x);
  });

  // Polygon is intersects, in order of angle
  return intersects;
}

export default daah;
