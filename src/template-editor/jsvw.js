/** @module */
'use strict';

//var bem = require('../../bower_components/vmg-bem/bems/template-editor.bemjson');
var bem = require('../../../vmg-bem/bems/template-editor.bemjson');

var dhr = require('../vmg-helpers/dom');

exports.fillTags = function(data){
  var key = 'movie-genres';
  var mdlName = 'movie_template'; // get from data
  dhr.impl(bem, key, mdlName, data);
};

exports.showHeroScope = function(){
  dhr.showElems('.hero-scope');
};

exports.hideHeroScope = function(){
  dhr.hideElems('.hero-scope');
};

exports.showAnimalScope = function(){
  dhr.showElems('.animal-scope');
};

exports.hideAnimalScope = function(){
  dhr.hideElems('.animal-scope');
};
module.exports = exports;
