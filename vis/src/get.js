function removeAllSpaces(text) {
  return text.replace(/ /g, "");
}

// Converts string
//   "(0,0),(0,1),(1,1)"
// into data structure
//   [[0,0], [0,1], [1,1]]
function parsePoints(text) {
  return text.split("),")
    .map(function(token) {
      return token.replace(/\(|\)/g, "").split(",").map(Number);
    });
}

// Converts string
//   "1:(0,0),(0,1),(1,1)"
// into format
//   [ "1", [[0,0], [0,1], [1,1]] ]
function parseLine(line) {
  var pair = removeAllSpaces(line).split(":")
  return [
    pair[0],
    parsePoints(pair[1])
  ];
}

// Returns guards.pol into the format { '1': [[0,0], [0,1], [2,2]] }
daah.getGuards = function() {
  return daah.getText("txt/guards.pol.txt").then(function(text) {
    var pairs = text.split("\n").map(parseLine);
    return _.fromPairs(pairs);
  });
};

daah.getText = function(uri) {
  return new Promise(function(resolve, reject) {
    d3.text(uri, function(err, data) {
      if (err) return reject(err);
      else resolve(data);
    });
  });
}
