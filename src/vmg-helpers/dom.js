/**
 * Operations with DOM, using JQuery
 *     JQuery only here for future replacement to usual functions and don't load JQuery
 * @module dom-helper
 */

/**
 * Jquery is self-loaded (from dns or local)
 */

var bhLib = require('bh');
var bh = new(bhLib.BH); // jshint ignore:line
var ahr = require('../vmg-helpers/app');

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

exports.impl = function(bem, elemName, mdlName, data) {
  var lists = $('.' + elemName); // may be few lists with movie-records in a page (retry logic)

  // get an object where block == key
  // get content of this object
  // get first item of array (of content)
  // create markup from this item
  // put the data to the markup
  // add it to the our elem
  var result = ahr.findJsonMatch(bem, 'block', elemName);

  //  console.log(result);

  // add real items to result
  var sampleSchema = result.content[0];

  var fullArr = ahr.map(data, mapSampleItem.bind(null, sampleSchema, mdlName));

  // retry it
  result.content = fullArr;
  // then - generate html

  var readyHtml = bh.apply(result);

  // @todo #12! Replace instead insert
  $(lists).html(readyHtml);
};

exports.alert = function(msg) {
  window.alert(msg);
};

var getElems = function(className) {
  return $(className);
};

exports.getElems = getElems;

var getElem = function(className) {
  return getElems(className)[0];
};

exports.getElem = getElem;

exports.on = function(elem, eventName, cbk) {
  $(elem).on(eventName, cbk);
};

// elem - className or dom elem
exports.addClass = function(elem, className) {
  $(elem).addClass(className);
};

exports.removeClass = function(elem, className) {
  $(elem).removeClass(className);
};

exports.showElems = function(elems) {
  $(elems).show();
};

exports.hideElems = function(elems) {
  $(elems).hide();
};

exports.div = function(optClass) {
  var div = document.createElement('div');
  if (optClass) {
    $(div).addClass(optClass);
  }
  return div;
};

exports.html = function(elem, htmlStr) {
  $(elem).html(htmlStr);
};

module.exports = exports;
