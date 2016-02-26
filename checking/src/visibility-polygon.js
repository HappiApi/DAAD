import _ from "lodash";
import PolyK from "../vendor/polyk.js";

export default function(polygon, x, y) {
  const triangles = triangulate(polygon);
  const firstTriangle = _.find(triangles, (triangle) =>
    insideTriangle(triangle, x, y));
  const r = PolyK.Raycast([0,0, 1,0, 1,0, 0,0], 0, 0, 1, 1);
  debugger;
}

function insideTriangle(triangle, x, y) {
  const polygon = convertToPolygon(triangle);
  return PolyK.ContainsPoint(polygon, x, y);
}

function triangulate(polygon) {
  const flatPolygon = convertToPolygon(polygon);
  // PolyK returns indices in format [a,b,c,  a,b,c,  a,b,c].
  // The next few lines convert this into tringles with coordinates, not indices.
  // Output looks like [ [[0,0],[0,1],[1,1]], [...] ]
  const triangleIndices = _.chunk(PolyK.Triangulate(flatPolygon), 3);
  return triangleIndices.map(indices => {
    return indices.map(index => polygon[index]);
  });
}

// convert from [[x,y], [x,y]] to [x,y,  x,y]
function convertToPolygon(polygon) {
  return _.flatten(polygon);
}

function convertFromPolygon(polygon) {
  return _.chunk(polygon, 2);
}
