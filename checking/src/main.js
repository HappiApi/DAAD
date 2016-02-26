import _ from 'lodash';
import d3 from 'd3';
import alg from './algorithm2.js';
import parser from './parse.js';
import polygonBoolean from '2d-polygon-boolean';


let data = {"map":[[-2,-2],[-0.5,0],[5,0],[2,0.5],[0,5],[0.2,3]],"guards":[[5,0],[0,5],[-2,-2]]};

function main() {
  // parser.getCheck().then(function(data) {
  // //   debugger;
  //   for(var key in data) {
  //     data[key].map = _.map(data[key].map, a => ({x: a[0], y: a[1]}));
  //     data[key].guards = _.map(data[key].guards, a => ({x: a[0], y: a[1]}));
  //     let result = alg(data[key].map, data[key].guards);
  //     if(result !== null) {
  //       console.log(key + ': (' + result.x + ', ' + result.y + ')');
  //     } else {
  //       console.log(key + ": The entire area is covered");
  //     }
  //   }
  // });
  data.map = _.map(data.map, a => ({x: a[0], y: a[1]}));
  data.guards = _.map(data.guards, a => ({x: a[0], y: a[1]}));
  let result = alg(data.map, data.guards);
  if(result !== null) {
    console.log('1: (' + result.x + ', ' + result.y + ')');
  } else {
    console.log("1: The entire area is covered");
  }
}

main();
