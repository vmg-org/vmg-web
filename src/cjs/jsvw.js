/** @module */

var ahr = require('./app-helper');
var dhr = require('./dom-helper');

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
  var movieRecordsItem = dhr.div('movie-records__item');
  movieRecordsItem.appendChild(buildMoviePreview(dataItem.name));

  ahr.each(lists, function(list) {
    list.appendChild(movieRecordsItem);
  });

};

exports.fillMovieRecords = function(data) {
  var lists = dhr.getElems('.movie-records'); // may be few lists with movie-records in a page (retry logic)

  ahr.each(data, fillMovieRecord.bind(null, lists));
};

module.exports = exports;
