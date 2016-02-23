function line_intersection(line1, line2) {
  let m1 = (line1[1].y - line1[0].y) / (line1[1].x - line1[0].x);
  let m2 = (line2[1].y - line2[0].y) / (line2[1].x - line2[0].x);

  let x = m2 * line2[0].x - m1 * line1[0].x - line2[0].y + line1[0].y;
  x = x / (m1 - m2);
  y = m1*(x - line1[0].x) - line1[0].y;

  return [x, y];
}

console.log(line_intersection([{x: 0, y:0}, {x: 2, y:2}], [{x: 0, y:2}, {x: 2, y:0}]));
