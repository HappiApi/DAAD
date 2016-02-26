function rotate(array, count) {
    var unshift = Array.prototype.unshift,
        splice = Array.prototype.splice;

    var len = array.length >>> 0,
        count = count >> 0;

    unshift.apply(array, splice.call(array, count % len, len));
    return array;
}

beforeEach(function () {
  jasmine.addMatchers({
    toBePlaying: function () {
      return {
        compare: function (actual, expected) {
          var player = actual;

          return {
            pass: player.currentlyPlayingSong === expected && player.isPlaying
          };
        }
      };
    },
    // toBePolygon: function() {
    //   return {
    //     compare: function(actual, expected) {
    //       var pass;
    //       if (actual.length != expected.length) {
    //         pass = false;
    //       } else {
    //         while (var i = expected.length, i--) {
    //           if ()
    //         }
    //       }
    //       return {
    //         pass: true
    //       }
    //     }
    //   }
    // }
  });
});
