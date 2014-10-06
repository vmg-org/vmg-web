/** @module index/vwjs */
'use strict';

//var indexBem = require('../../bower_components/vmg-bem/bems/index.bemjson');
var bem = require('../../../vmg-bem/bems/index.bemjson');

var dhr = require('../vmg-helpers/dom');

exports.run = function(app) {
  app.fillMovieRecords = function(elem, e, targetName) {

    var data = [{
      name: 'requiem about dream',
      upper_name: 'REQUIEM FOR A DREAM',
      img_preview_url: './css/img/movie-black.png',
      url: './watch.html?v=requiem'
    }, {
      name: 'hard die',
      upper_name: 'DIE HARD',
      img_preview_url: './css/img/movie-black.png',
      url: './watch.html?v=die-hard'
    }, {
      name: 'Hatiko',
      upper_name: 'HATIKO',
      img_preview_url: './css/img/movie-black.png',
      url: './watch.html?v=hatiko'
    }];
    //  var key = 'movie-records';
    var mdlName = 'movie_record'; // get from data

    dhr.impl(bem, targetName, mdlName, data);
  };
};

module.exports = exports;
