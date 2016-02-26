describe("rayIntersection", function() {

  it("should detect intersecting lines (within bounds)", function() {
    var result = rayIntersection(
      [{x:0, y:0}, {x:1, y:1}],
      [{x:0, y:1}, {x:1, y:0}]
    );
    expect(result).toEqual({x:0.5, y:0.5});
  });

  it("should extend intersection of ray to infinity", function() {
    var result = rayIntersection(
      [{x:0, y:0}, {x:1, y:1}],
      [{x:4, y:6}, {x:6, y:4}]
    );
    expect(result).toEqual({x:5, y:5});
  });

  it("should not intersect parallel lines", function() {
    var result = rayIntersection(
      [{x:0, y:0}, {x:1, y:1}],
      [{x:1, y:1}, {x:2, y:2}]
    );
    expect(result).toBeNull();
  });

  it("should not intersect identical lines", function() {
    var result = rayIntersection(
      [{x:0, y:0}, {x:1, y:1}],
      [{x:0, y:0}, {x:1, y:1}]
    );
    expect(result).toBeNull();
  });

  it("should work with vertical lines of infinite gradient", function() {
    var result = rayIntersection(
      [{x:0, y:0}, {x:0, y:1}],
      [{x:-1, y:3}, {x:1, y:3}]
    );
    expect(result).toEqual({x:0, y:3});
  });

  it("should cast ray in a single direction", function() {
    var result = rayIntersection(
      [{x:0, y:0}, {x:0, y:1}],
      [{x:-1, y:-3}, {x:1, y:-3}]
    );
    expect(result).toBeNull();
  });

});

//
//
// describe("visibilityPolygon", function() {
//
//   // a square
//   var convexPolygon = [
//     {x:0, y:0},
//     {x:0, y:1},
//     {x:1, y:1},
//     {x:1, y:0}
//   ];
//
//   // L-shaped polygon
//   var LPolygon = [
//     {x:0, y:0},
//     {x:0, y:2},
//     {x:1, y:2},
//     {x:1, y:1},
//     {x:2, y:1},
//     {x:2, y:0}
//   ];
//
//   it("should work with simple convex polygon", function() {
//     var result = visibilityPolygon({x:0.5, y:0.5}, convexPolygon);
//     expect(result).toEqual(convexPolygon);
//   });
//
//   it("should return null if guard is outside polygon", function() {
//     var result = visibilityPolygon({x:-1, y:-1}, convexPolygon);
//     expect(result).toBeNull();
//   });
//
//   it("should work with simple non-convex polygon", function() {
//     var result = visibilityPolygon({x:0.5, y:0.5}, LPolygon);
//     expect(result).toEqual(LPolygon);
//   });
//
//   it("should work when guard is on a vertex", function() {
//     var result = visibilityPolygon({x:2, y:1}, LPolygon);
//     expect(result).toEqual([
//       {}
//     ]);
//   });
//
// });
