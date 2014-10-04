/** @module */

var dhr = require('../vmg-helpers/dom');
var indexBem = require('../../bower_components/vmg-bem/bems/index.bemjson');

//console.log(indexBem);

// var demoData = [{
//   name: 'requiem about dream'
// }, {
//   name: 'hard oreshek'
// }, {
//   name: 'Hatiko'
// }];
exports.fillMovieRecords = function(data) {
  var key = 'movie-records';
  var mdlName = 'movie_record'; // get from data

  dhr.impl(indexBem, key, mdlName, data);

  // need to know markup of movie-record
  //  ahr.each(data, fillMovieRecord.bind(null, lists));
};

module.exports = exports;
