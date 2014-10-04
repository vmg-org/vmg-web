/** @module */

var ahr = require('../vmg-helpers/app');
var dhr = require('../vmg-helpers/dom');
var bhLib = require('bh');
var bh = new(bhLib.BH); // jshint ignore:line
var indexBem = require('../../bower_components/vmg-bem/bems/index.bemjson');

//console.log(indexBem);

function replacer(dataItem, match, p1) {
  // with $1 object doesnt works
  // todo @31! or throw an error
  return '"' + (dataItem[p1] || ('@@' + p1)) + '"';
}

/*
 * Map it
 * @param {Object} sampleSchema - { block: 'asdf', content: []}
 * @param {Object} dataItem - {name: 'asdfasdfa' }
 */
var mapSampleItem = function(sampleSchema, mdlName, dataItem) {

  // find in schema - object where mdl = mdlName
  // var mdlObj = ahr.findJsonMatch(sampleSchema, 'mdl', mdlName);

  //  console.log(mdlObj);

  // all content of this object - with movie_record context
  // change all matches with our data: @@name - dataItem.name
  // stringify it or recurse?

  var strSchema = ahr.stringify(sampleSchema);

  // change every key in dataItem

  //  ahr.each(Object.keys(dataItem), implementEachData
  //  console.log(strSchema);
  //  var allMatches = strSchema.match(/"@@\w+"/g);
  //  console.log(allMatches);
  //var matches = strSchema.match(/@@(\w+/g);

  var genSchema = strSchema.replace(/"@@(\w+)"/g, replacer.bind(null, dataItem));

  return ahr.parseJson(genSchema);
};

// var demoData = [{
//   name: 'requiem about dream'
// }, {
//   name: 'hard oreshek'
// }, {
//   name: 'Hatiko'
// }];
exports.fillMovieRecords = function(data) {
  var key = 'movie-records';

  var lists = dhr.getElems('.' + key); // may be few lists with movie-records in a page (retry logic)

  // get an object where block == key
  // get content of this object
  // get first item of array (of content)
  // create markup from this item
  // put the data to the markup
  // add it to the our elem
  var result = ahr.findJsonMatch(indexBem, 'block', key);

  console.log(result);

  // add real items to result
  var sampleSchema = result.content[0];

  var mdlName = 'movie_record'; // get from data
  var fullArr = ahr.map(data, mapSampleItem.bind(null, sampleSchema, mdlName));

  // retry it
  result.content = fullArr;
  // then - generate html

  var readyHtml = bh.apply(result);

  // @todo #12! Replace instead insert
  $(lists).html(readyHtml);

  // need to know markup of movie-record
  //  ahr.each(data, fillMovieRecord.bind(null, lists));
};

module.exports = exports;
