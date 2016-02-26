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
function parseGaurdsLine(line) {
  var pair = removeAllSpaces(line).split(":");
  return [
    pair[0],
    { map: parsePoints(pair[1]) }
  ];
}

function parseCheckLine(line) {
  var pair = removeAllSpaces(line).split(":");
  var a = pair[1].split(";");
  var result = {};
  if (a[0]) result.map = parsePoints(a[0]);
  if (a[1]) result.guards = parsePoints(a[1]);
  return [pair[0],result];
}

daah.getFile = function(src) {
  src = src || "txt/guards.pol.txt";
  return daah.getText(src).then(function(text) {
    var pairs = _.compact(text.split("\n")).map(parseCheckLine);
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
