daah.getSightPolygon = function(x, y, polygon) {
  var segments = convertToSegments(polygon);
  var sightPolygon = getSightPolygon(x, y, segments);
  return convertToPolygon(sightPolygon);
}

function edges(array) {
  var accumulator = [];
  for (var i = 0; i < array.length - 1; i++) {
    accumulator.push([array[i], array[i+1]]);
  }
  return accumulator;
}

function convertToSegments(polygon) {
  var p = _.clone(polygon);
  p.push(polygon[0]);
  var points = p.map(function(d) {
    return { x: d[0], y: d[1] };
  });
  var segments = edges(points).map(function(d) {
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

function getIntersectionNew(ray,segment){
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

function getSegmentIntersection(segA,segB){
	// RAY in parametric: Point + Delta*T1
	var r_px = segA.a.x;
	var r_py = segA.a.y;
	var r_dx = segA.b.x-segA.a.x;
	var r_dy = segA.b.y-segA.a.y;
	// SEGMENT in parametric: Point + Delta*T2
	var s_px = segB.a.x;
	var s_py = segB.a.y;
	var s_dx = segB.b.x-segB.a.x;
	var s_dy = segB.b.y-segB.a.y;
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
	if(T1<0 || T1>1) return null;
	if(T2<0 || T2>1) return null;
	// Return the POINT OF INTERSECTION
	return {
		x: r_px+r_dx*T1,
		y: r_py+r_dy*T1,
		param: T1
	};
}

function preprocessing(segments, sightX, sightY){

	var ray = {
	a:{x:sightX,y:sightY},
	b:{x:sightX-1,y:sightY}
	};

	var closestIntersect = null;
	var forClose=-1;
	for(var i=0;i<segments.length;i++)
	{
		var intersect = getIntersectionNew(ray,segments[i]);

		if(!intersect) continue;

		if(!closestIntersect || intersect.param<closestIntersect.param)
		{
			closestIntersect=intersect;
			forClose = i;
		}
	}
	return { x:closestIntersect.x,
			 y: closestIntersect.y,
			 i : forClose
			};

}

function preP(vertices, sightX, sightY)
{
	var ray = {
	a:{x:sightX,y:sightY},
	b:{x:sightX-1,y:sightY}
	};

	var closestIntersect = null;
	var whereToPut = -1;
	for(var i=0;i<vertices.length;i++)
	{
		var vertexA = vertices[i];
		var vertexB = vertices[(i+1)%vertices.length];
		segment = {a:vertexA,b:vertexB};

		var intersect = getIntersectionNew(ray,segment);

		if(!intersect) continue;

		if(!closestIntersect || Math.abs(intersect.param)<Math.abs(closestIntersect.param))
		{
			closestIntersect=intersect;
			whereToPut = i;
		}
	}
	return {
		vertex : closestIntersect,
		index: whereToPut
	};
}

function threeVarT(j,i,k)
{
	return ((k.x - i.x)*(j.y - i.y)) - ((k.y - i.y)*(j.x - i.x));
}

function THETA(A, B)
{
	var dx = B.x - A.x;
	var dy = B.y - A.y;

	return Math.atan2(dy,dx);

}

function getSightPolygon(sightX,sightY, segments){
	// sightX = 1.75;
	// sightY = 0.9;
	// Get all unique points
	var points = (function(segments){
		var a = [];
		segments.forEach(function(seg){
			a.push(seg.a,seg.b);
		});
		return a;
	})(segments);
	var uniquePoints = (function(points){
		var set = {};
		return points.filter(function(p){
			var key = p.x+","+p.y;
			if(key in set){
				return false;
			}else{
				set[key]=true;
				return true;
			}
		});
	})(points);

	// Get all angles
	var uniqueAngles = [];
	for(var j=0;j<uniquePoints.length;j++){
		var uniquePoint = uniquePoints[j];
		var angle = Math.atan2(uniquePoint.y-sightY,uniquePoint.x-sightX);
		uniquePoint.angle = angle;
		uniqueAngles.push(angle-0.0000001,angle,angle+0.0000001);
	}

	// RAYS IN ALL DIRECTIONS
	var vertexIntersect = null;
	var intersects = [];
	var vertexArray = [];
	for (var i = segments.length-1; i >= 0; i--)
	{
		vertexArray.push(segments[i].a);
	};

	var INF = {x:-1000.0, y:sightY};

	var preprocess = preP(vertexArray, sightX, sightY);
	vertexArray.splice(preprocess.index+1, 0, preprocess.vertex);


	var STR_INF = [preprocess.vertex,INF];


	var R = [];
	var L = [];
	var visPol = [];
	var t = null;
	visPol.push(preprocess.vertex);
	visPol.push(vertexArray[(preprocess.index+2)%vertexArray.length]);

	R.push(STR_INF);
	t = preprocess.vertex;
	tIndex = preprocess.index+1;
	var uIndex = tIndex;
	// var sIndex = preprocess.index+1;
	var s = vertexArray[(uIndex+2)%vertexArray.length];
	var sightVertex = {x: sightX, y: sightY};
	var intersectionK = null;
	var editted = false;

	while((s.x != preprocess.vertex.x) && (s.y != preprocess.vertex.y))
	{

		uIndex++;
		var u = vertexArray[uIndex%vertexArray.length];
		s = vertexArray[(uIndex+1)%vertexArray.length];

		if ((s.x == preprocess.vertex.x) && (s.y == preprocess.vertex.y))
		{
			break;
		}
		// left right no : pos, neg, 0

		xusAngle = threeVarT(sightVertex, u, s);
		tusAngle = threeVarT(t,u,s);
		if (xusAngle == 0.0)
		{
			visPol.push(s);
			R.push(rs);
			tIndex++;
			t = vertexArray[tIndex%vertexArray.length];
		}
		else if (xusAngle < 0.0)
		{
			rs = R[R.length-1];
			R.splice(R.length-1, 1);
			//Equivilant to pop
			var thetas = THETA(s, sightVertex);
			var thetar = THETA(rs[0],sightVertex);
			if (rs = STR_INF) {
				thetar = 2*Math.PI;
			}

			var usrsk = getSegmentIntersection({a:u,b:s}, {a:rs[0],b:rs[1]});

			while((R.length != 0) && (THETA(s, sightVertex) > THETA(rs[1], sightVertex)) && (usrsk == null))
			{
				rs = R[R.length-1];
				R.splice(R.length-1, 1);
			}

			if (usrsk != null)
			{
				for (var i = uIndex; i <= vertexArray.length+uIndex; i++)
				{
					var s1 = vertexArray[i%vertexArray.length];
					var s2 = vertexArray[(i+1)%vertexArray.length];

					var sedge = {a:s1,b:s2};
					var rkEdge = {a:rs[0],b:usrsk};

					var intersection = getSegmentIntersection(sedge, rkEdge);

					if (intersection)
					{
						vertexArray.splice(uIndex,1,usrsk);
						vertexArray.splice(uIndex+1,1,intersection);
						visPol.push(usrsk);
						visPol.push(intersection);

						R.push([rs[0],intersection]);
						t = usrsk;
						break;
					}

				}
			}
			else if(thetas <= thetar)
			{
				visPol.push(s);
				R.push(rs);
				tIndex++;
				t = vertexArray[tIndex%vertexArray.length];
			}
		}
		else if(xusAngle > 0.0 && tusAngle > 0.0)
		{
			for (var i = uIndex+1; i <= vertexArray.length+uIndex+1; i++)
				{
					var s1 = vertexArray[i%vertexArray.length];
					var s2 = vertexArray[(i+1)%vertexArray.length];

					var sedge = {a:s1,b:s2};
					var xuRay = {a:{x:sightVertex.x, y:sightVertex.y},
								 b:{x:sightVertex.x+(u.x-sightX), y:sightVertex.y+(u.y-sightY)}};



					var intersection = getIntersection(xuRay, sedge);

					if (intersection)
					{
						vertexArray.splice(uIndex,1,intersection);
						visPol.push(intersection);
						L.push([u,intersection]);
						t = u;
						tIndex = uIndex;
						break;
					}
				}
		}
		else if(xusAngle > 0.0 && tusAngle < 0.0)
		{
			if(L.length != 0)
			{
				rs = R[R.length-1];
				R.splice(R.length-1, 1);
			}
			else
			{
				rs = null;
			}
			if (rs!=null)
			{
				usrsk = getSegmentIntersection({a:u,b:s},{a:rs[0],b:rs[1]});
			}
			else
			{
				usrsk = null;
			}

			if (rs != null)
			{
				while(L.length != 0 && (THETA(s,sightVertex) < THETA(rs[0], sightVertex)) && usrsk == null)
				{
					rs = R[R.length-1];
					R.splice(R.length-1, 1);
				}

				if (L.length == 0 && (THETA(s,sightVertex) < THETA(rs[0], sightVertex)) && (usrsk == null))
				{
					rs = null;
				}
			}
			if (usrsk !=null)
			{
				for (var i = uIndex; i <= vertexArray.length+uIndex; i++)
				{
					var s1 = vertexArray[i%vertexArray.length];
					var s2 = vertexArray[(i+1)%vertexArray.length];

					var sedge = {a:s1,b:s2};
					var rkEdge = {a:rs[0],b:usrsk};

					var intersection = getSegmentIntersection(sedge, rkEdge);

					if (intersection)
					{
						var w = visPol[visPol.length-1];
						visPol.splice(visPol.length-1, 1);

						while(w.x != rs[1].x && w.y != rs[1].y)
						{
							w = visPol[visPol.length-1];
							visPol.splice(visPol.length-1, 1);
						}


						var rIndex = vertexArray.indexOf(rs[0]);
						vertexArray.splice(rIndex,1,intersection);

						visPol.push(intersection);
						L.push([rs[0], intersection]);
						t = rs[0];
						tIndex = rIndex;
						break;
					}

				}
			}
			else if(rs == null || THETA(s,sightVertex) >= THETA(rs[0], sightVertex))
			{
				if (rs != null)
				{
					L.push(rs);
				}
				rs = [null, null];
				rs[0] = visPol[visPol.length-1];
				visPol.splice(visPol.length-1, 1);
				rs[1] = visPol[visPol.length-1];
				visPol.splice(visPol.length-1, 1);

				var sedge = {a:rs[0],b:rs[1]};
				var xsRay = {a:{x:sightVertex.x, y:sightVertex.y},
							 b:{x:sightVertex.x+(s.x-sightX), y:sightVertex.y+(s.y-sightY)}};



				var intersection = getIntersection(xsRay, sedge);

				while(!intersection)
				{
					rs[0] = rs[1];
					rs[1] = visPol[visPol.length-1];
					visPol.splice(visPol.length-1, 1);
					intersection = getIntersection(xsRay, {a:rs[0],b:rs[1]});
				}

				var SIndex = vertexArray.indexOf(rs[1]);
				vertexArray.splice(SIndex+1,1,intersection);

				visPol.push(rs[1]);
				visPol.push(intersection);
				t = intersection;
				intersectionK = intersectionK;
				tIndex = SIndex
				uIndex = tIndex;

			}

		}
		// else
		// {
		// 	var y = vertexArray[(uIndex+2)%vertexArray.length];
		// 	var xsyAngle = threeVarT(sightVertex, s, y);
		// 	var usyAngle = threeVarT(u,s,y);

		// 	if (xsyAngle > 0.0)
		// 	{
		// 		vertexArray.splice(SIndex,0,s);
		// 		visPol.push(s);

		// 	}
		// 	else if(xsyAngle < 0.0 && usyAngle > 0.0)
		// 	{
		// 		vertexArray.splice(SIndex,0,s);
		// 		visPol.push(s);
		// 		L.push([s,intersectionK]);
		// 	}
		// 	else if(xsyAngle < 0.0 && usyAngle < 0.0)
		// 	{
		// 		for (var i = SIndex; i <= vertexArray.length+SIndex; i++)
		// 		{
		// 			var s1 = vertexArray[i%vertexArray.length];
		// 			var s2 = vertexArray[(i+1)%vertexArray.length];

		// 			var sedge = {a:s1,b:s2};
		// 			var skEdge = {a:rs[1],b:intersection};

		// 			var intersectionB = getSegmentIntersection(sedge, skEdge);

		// 			if (intersectionB)
		// 			{
		// 				vertexArray.splice(SIndex,1,intersectionB);
		// 				visPol.push(intersectionB);
		// 				R.push([s,intersectionB]);

		// 				break;
		// 			}

		// 		}
		// 	}
		// }
	}
	var reverseArr = [];
	for (var i = visPol.length - 1; i >= 0; i--) {
		reverseArr.push(visPol[i]);
	};
	return reverseArr;

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

		    var dtheta = 0.0,theta1 = 0.0,theta2=0.0;//double Angle2D(double x1, double y1, double x2, double y2)

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

		console.log(isInsideShape);
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
					//vertexIntersect = intersect; closestIntersectRightV = segments[(i-1)%segments.length];
					//closestIntersectLeftV = segments[(i+1)%segments.length];
					//continue;
					console.log("Collided Vertex");
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
	if (vertexIntersect != null)
	{
		//intersects.push(vertexIntersect);
		//intersects.push(closestIntersectRightV);
		//intersects.push(closestIntersectLeftV);


	}




	// Sort intersects by angle
	intersects = intersects.sort(function(a,b){
		return a.angle-b.angle;
	});

	intersects = intersects.filter(function(a){
		return !isNaN(a.x);
	});
	/*var  qintersects = intersects.filter(function(p){
			var key = p.angle;
			if(key > -0.5 && key < 7){
				return true;
			}else{
				return false;
			}
		});
*/
	// Polygon is intersects, in order of angle
	return intersects;

}
