/** @module */

'use strict';

//var bem = require('../../bower_components/vmg-bem/bems/watch.bemjson');
var bem = require('../../../vmg-bem/bems/watch.bemjson');
var dhr = require('../vmg-helpers/dom');

exports.fillComments = function(data) {
  var key = 'movie-comments';
  var mdlName = 'movie_comment'; // get from data
  dhr.impl(bem, key, mdlName, data);
};

exports.addComments = function(data){
  var key = 'movie-comments';
  var mdlName = 'movie_comment'; // get from data
  dhr.impl(bem, key, mdlName, data, true);
};

exports.fillMovieRecord = function(data) {
  // fill info first

  var key = 'movie-info-cover';
  var mdlName = 'movie_record';
  dhr.impl(bem, key, mdlName, data);
};

exports.fillVideo = function(data) {

  var key = 'movie-player-cover';
  var mdlName = 'movie_record';
  dhr.impl(bem, key, mdlName, data);
};

module.exports = exports;
