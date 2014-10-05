/** @module */
'use strict';

var bem = require('../../bower_components/vmg-bem/bems/template-editor.bemjson');

var dhr = require('../vmg-helpers/dom');

exports.fillTags = function(data){
  var key = 'movie-genres';
  var mdlName = 'movie_template'; // get from data
  dhr.impl(bem, key, mdlName, data);
};

module.exports = exports;
