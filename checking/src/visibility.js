import _ from 'lodash';

export default function(polygon, guard) {
  var segments = convertToSegments(polygon);
  var sightPolygon = getSightPolygon(guard.x, guard.y, segments);
  return sightPolygon;
}

function edges(array) {
  var accumulator = [];
  for (var i = 0; i < array.length - 1; i++) {
    accumulator.push({a: array[i], b: array[i+1]});
  }
  return accumulator;
}

function convertToSegments(polygon) {
  var points = _.cloneDeep(polygon);
  if(points.length) points.push(_.cloneDeep(polygon[0]));
  var segments = edges(points);
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
	var r_px = ray.a.x;
	var r_py = ray.a.y;
	var r_dx = ray.b.x-ray.a.x;
	var r_dy = ray.b.y-ray.a.y;
	// SEGMENT in parametric: Point + Delta*T2
	var s_px = segment.a.x;
	var s_py = segment.a.y;
	var s_dx = segment.b.x-segment.a.x;
	var s_dy = segment.b.y-segment.a.y;
	// Are they parallel? If so, no intersect
	var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
	var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
	if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){
		// Unit vectors are the same.
		return null;
	}
	// SOLVE FOR T1 & T2
	// r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
	// ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
	// ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
	// ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
	var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
	var T1 = (s_px+s_dx*T2-r_px)/r_dx;
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
  var uniquePoints = _(segments)
      .map(function(segment) {
        return [segment.a, segment.b];
      })
      .flatten()
      .uniq()
      .value();
	// Get all angles
	var uniqueAngles = [];
	for(var j=0;j<uniquePoints.length;j++){
		var uniquePoint = uniquePoints[j];
		var angle = Math.atan2(uniquePoint.y-sightY,uniquePoint.x-sightX);
		uniquePoint.angle = angle;
		uniqueAngles.push(angle-0.00000000001,angle,angle+0.00000000001);
	}

	// RAYS IN ALL DIRECTIONS
	var intersects = [];
	for(var j=0;j<uniqueAngles.length;j++){
		var angle = uniqueAngles[j];

		// Calculate dx & dy from angle
		var dx = Math.cos(angle);
		var dy = Math.sin(angle);

		// Ray from center of screen to mouse
		var ray = {
			a:{x:sightX,y:sightY},
			b:{x:sightX+dx,y:sightY+dy}
		};


		//Check whether the ray points into the shape.
		var xToCheck = ray.b.x;
		var yToCheck = ray.b.y;

		var k;

		var p1 = {
			x:0.0,
			y:0.0
		};

		var p2 = {
			x: 0.0,
			y: 0.0
		};

		var angle2 = 0.0;

		for (k = 0; k < segments.length;k++)
		{
			p1.x = segments[k].a.x - xToCheck;
		    p1.y = segments[k].a.y - yToCheck;
		    p2.x = segments[(k+1)%segments.length].a.x - xToCheck;
		    p2.y = segments[(k+1)%segments.length].a.y - yToCheck;

		    var dtheta = 0.0,theta1 = 0.0,theta2=0.0;

		    theta1 = Math.atan2(p1.y,p1.x);
		    theta2 = Math.atan2(p2.y,p2.x);
		    dtheta = theta2 - theta1;
		    while (dtheta > Math.PI)
		      dtheta -= Math.PI*2;
		    while (dtheta < -Math.PI)
		      dtheta += Math.PI*2;

		    angle2 += dtheta;
		};

		var isInsideShape = (angle2/Math.PI*2 < 4.1) && (angle2/Math.PI*2 > 3.9);

		// Find CLOSEST intersection
		var closestIntersect = null;
		var closestIntersectLeftV = null;
		var closestIntersectRightV = null;
		for(var i=0;i<segments.length;i++)
		{
			var intersect = getIntersection(ray,segments[i]);

			if(!intersect) continue;
			if(isInsideShape)
			{
				if (intersect.x == sightX && intersect.y == sightY)
				{
					// console.log("Collided Vertex");
				}
				else
				{
					if(!closestIntersect || intersect.param<closestIntersect.param)
					{
						closestIntersect=intersect;
					}
				}
			}
			else
			{
				if(!closestIntersect || intersect.param<closestIntersect.param)
				{
					closestIntersect=intersect;
				}
			}
		}

		// Intersect angle
		if(!closestIntersect) continue;
		closestIntersect.angle = angle;

		// Add to list of intersects
		intersects.push(closestIntersect);

	}



	// Sort intersects by angle
	intersects = intersects.sort(function(a,b){
		return a.angle-b.angle;
	});

	intersects = intersects.filter(function(a){
		return !isNaN(a.x);
	});

	// Polygon is intersects, in order of angle
	return intersects;

}
