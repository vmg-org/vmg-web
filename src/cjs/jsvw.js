/** @module */

var ahr = require('./app-helper');
var dhr = require('./dom-helper');
var bhLib = require('bh');
var bh = new(bhLib.BH); // jshint ignore:line
var indexBem = require('../../bower_components/vmg-bem/bems/index.bemjson');

console.log(indexBem);

exports.hideMenuPopup = function() {
  dhr.addClass('.menu-popup', 'hidden');
};

exports.showMenuPopup = function() {
  dhr.removeClass('.menu-popup', 'hidden');
};

/**
 * Creates class of an elem of a block
 */
function cec(block, elem) {
  return block + '__' + elem;
}

function buildMoviePreview(name) {
  // get index.bemjson.json
  // find first 'movie-preview' block (a markuper creates a sample block)
  // 

  var blockClass = 'movie-preview';
  var block = dhr.div();
  var elemWatch = dhr.div(cec(blockClass, 'watch'));
  var elemTitle = dhr.div(cec(blockClass, 'title'));
  dhr.html(elemTitle, name);
  var elemRating = dhr.div(cec(blockClass, 'rating'));

  block.appendChild(elemWatch);
  block.appendChild(elemTitle);
  block.appendChild(elemRating);
  return block;
}

var fillMovieRecord = function(lists, dataItem) {
  // go to index.bemjson.json

  var movieRecordsItem = dhr.div('movie-records__item');
  movieRecordsItem.appendChild(buildMoviePreview(dataItem.name));

  ahr.each(lists, function(list) {
    list.appendChild(movieRecordsItem);
  });

};

/*
 * Map it
 * @param {Object} sampleSchema - { block: 'asdf', content: []}
 * @param {Object} dataItem - {name: 'asdfasdfa' }
 */
var mapSampleItem = function(sampleSchema, dataItem) {
  var mdlName = 'movie_record'; // get from data

  // find in schema - object where mdl = mdlName
  var mdlObj = ahr.findJsonMatch(sampleSchema, 'mdl', mdlName);

  console.log(mdlObj);

  // all content of this object - with movie_record context
  // change all matches with our data: @@name - dataItem.name
  // stringify it or recurse?

  var strSchema = ahr.stringify(sampleSchema);

  var genSchema = strSchema.replace(/@@upper_name/g, dataItem.name);

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

  var fullArr = ahr.map(data, mapSampleItem.bind(null, sampleSchema));

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
