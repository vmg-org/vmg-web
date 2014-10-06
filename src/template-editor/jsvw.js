/** @module */
'use strict';

//var bem = require('../../bower_components/vmg-bem/bems/template-editor.bemjson');
var bem = require('../../../vmg-bem/bems/template-editor.bemjson');

var dhr = require('../vmg-helpers/dom');

exports.fillTags = function(data) {
  var key = 'movie-genres'; // get this tag from markup?
  var mdlName = 'movie_template'; // get from data
  dhr.impl(bem, key, mdlName, data);
};

// scan entire bem file
// find predicates, like: trigg: 'fillMovieGenres'
// get class of this elem: by block + __ + elem (usually its blocks)
// fillMovieGenres to this elem
// + You can change class name in a markup without changing on JS side
//

// exports.fun = function(){
//	// list of objects with predicate: trigg: 'functionName'
//  var arrTriggers = ahr.getTriggers(bem);
//
//  arrTriggers.forEach(function(obj){
//    var funcName = obj['trigg'];
//    var elemClass = obj['block'];
//
//    helper[funcName](elemClass);
//    // helper.fillTags(toElemWithThisClassName);
//    // 
//    // How to send data?
//    // It is only for onload?
//    //
//    // Data 
//  });
//};

exports.showHeroScope = function() {
  dhr.showElems('.hero-scope');
};

exports.hideHeroScope = function() {
  dhr.hideElems('.hero-scope');
};

exports.showAnimalScope = function() {
  dhr.showElems('.animal-scope');
};

exports.hideAnimalScope = function() {
  dhr.hideElems('.animal-scope');
};
module.exports = exports;
