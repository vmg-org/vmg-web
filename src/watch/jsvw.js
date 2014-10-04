/** @module */
 
'use strict';

var bem = require('../../bower_components/vmg-bem/bems/watch.bemjson');
var dhr = require('../vmg-helpers/dom');

exports.fillComments = function(data) {
  var key = 'movie-comments';
  var mdlName = 'movie_comment'; // get from data

  dhr.impl(bem, key, mdlName, data);
};

module.exports = exports;
