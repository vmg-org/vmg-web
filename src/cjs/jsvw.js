/** @module */

var ahr = require('./app-helper');
var dhr = require('./dom-helper');
var indexBem = require('../../bower_components/vmg-bem/dst/bemjson/index.bemjson');

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

  // need to know markup of movie-record
  ahr.each(data, fillMovieRecord.bind(null, lists));
};

module.exports = exports;
