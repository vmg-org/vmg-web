/** @module */

'use strict';

//var bem = require('../../bower_components/vmg-bem/bems/watch.bemjson');
var bem = require('../../../vmg-bem/bems/watch.bemjson');
var dhr = require('../vmg-helpers/dom');

exports.run = function(app) {
  app.fillComments = function(elem, e, targetName) {
    //  var key = 'movie-comments';
    var data = [{
      author_name: 'Rave',
      comment_text: 'Super video'
    }, {
      author_name: 'Rave',
      comment_text: 'Super video'
    }];
    var mdlName = 'movie_comment'; // get from data
    dhr.impl(bem, targetName, mdlName, data);
  };

  app.updateCommentsByInterval = function(elem, e, targetName) {
    var commentsPortion = [{
      author_name: 'Other',
      comment_text: 'Super video'
    }, {
      author_name: 'Other',
      comment_text: ' video'
    }];

    setTimeout(function() {
      //      var key = 'movie-comments';
      var mdlName = 'movie_comment'; // get from data
      dhr.impl(bem, targetName, mdlName, commentsPortion, true);
    }, 3000);
  };

  app.fillMovie = function(elem, e, targetNameInfo, targetNamePlayer) {

    var movieRecordData = [{
      movie_title: 'Big rabbit',
      movie_description: 'eat a cucumber',
      video_url: './demo.webm'
    }];
    var mdlName = 'movie_record';
    //    var key = 'movie-info-cover';
    console.log(targetNamePlayer);
    dhr.impl(bem, targetNamePlayer, mdlName, movieRecordData);
    dhr.impl(bem, targetNameInfo, mdlName, movieRecordData);
    //    var key = 'movie-player-cover';
  };
};

module.exports = exports;
