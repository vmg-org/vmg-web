/** @module */
'use strict';

var dhr = require('../vmg-helpers/dom');

var buildComments = function() {
  var targetName = this.cls.movieCommentScope;
  var commentsPortion = [{
    author_name: 'Other',
    comment_text: 'Super video'
  }, {
    author_name: 'Other',
    comment_text: ' video'
  }];
  dhr.impl(this.bem, targetName, 'movie_comment', commentsPortion, true);
};

exports.fillComments = function(next) {
  buildComments.apply(this);
  next();
};

exports.updateCommentsByInterval = function(next) {
  setTimeout(buildComments.bind(this), 3000);
  next();
};

exports.fillMovie = function(next) {
  var targetNameInfo = this.cls.movieInfoScope;
  var targetNamePlayer = this.cls.moviePlayerScope;

  var movieRecordData = [{
    movie_title: 'Big rabbit',
    movie_description: 'eat a cucumber',
    video_url: 'https://s3.amazonaws.com/vmg-bucket/converted/966808401-web.mp4'
  }];

  var mdlName = 'movie_record';
  //    var key = 'movie-info-cover';
  //    console.log(targetNamePlayer);
  //    dhr.impl(this.bem, targetNamePlayer, mdlName, movieRecordData);

  var videoElem = document.createElement('video');
  var videoSource = document.createElement('source');
  videoSource.src = 'https://s3.amazonaws.com/vmg-bucket/converted/966808401-web.mp4';
  videoSource.type = 'video/mp4';
  $(videoElem).addClass('video-js vjs-default-skin');
  videoElem.appendChild(videoSource);
  $('.' + targetNamePlayer).html(videoElem);
  // Player builds using videojs and inserted a link
  window.videojs(videoElem, {
    width: '100%',
    height: '100%',
    controls: true
  }, function() {
    //      $('.' + targetNamePlayer).show();
    console.log('player is loaded');
    // This is functionally the same as the previous example.
  });

  // Info builds using structure
  dhr.impl(this.bem, targetNameInfo, mdlName, movieRecordData);


  //    var key = 'movie-player-cover';
  next();
};

module.exports = exports;
