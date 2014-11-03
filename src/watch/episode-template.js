/**
 * Model builder
 *     - create empty markup (with data-id tag) wch-player
 *     - insert to the page (all episode template as one command from movie-template)
 *       - show first episode video
 *     - find elem (this.getElemContainer()) and put video to this elem
 *     - init a video; get a vjs
 *     - to hide/show wrap - use methods
 * @module
 */
'use strict';
//var ahr = require('../vmg-helpers/app');
var dhr = require('../vmg-helpers/dom');
var hbrs = require('../vmg-helpers/hbrs');

var Mdl = function(data, movieTemplate, zpath) {
  this.movieTemplate = movieTemplate;
  this.root = this.movieTemplate.root;
  this.zpath = zpath;

  Object.keys(data).forEach(this.mapKeys.bind(this, data));
  this.mediaSrc = this.episode_bid_item_best.media_spec_item.file_cut_item.media_file_item.url;
  this.mediaType = this.episode_bid_item_best.media_spec_item.file_cut_item.media_file_item.id_of_container_format;

  this.markup = hbrs.compile(this.root.markups.wchPlayer);
  // cls['vjsContainer' + this.order_in_movie]);
};

Mdl.prototype.getElemContainer = function() {
  return dhr.getElem('.' + this.root.cls.wchPlayer + '[data-id=' + this.id + ']');
};

Mdl.prototype.buildHtml = function() {
  return this.markup(this);
};

Mdl.prototype.hideContainer = function() {
  dhr.hideElems(this.getElemContainer());
};

Mdl.prototype.showContainer = function() {
  dhr.showElems(this.getElemContainer());
};

Mdl.prototype.mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

Mdl.prototype.setVideoSrc = function() {
  this.vjs.src(this.mediaSrc);
  // auto - load metadata, and start loading
};

Mdl.prototype.handlePlayer = function(next, vjs) {
  this.vjs = vjs;
  //  this.vjs.src(this.mediaSrc);
  //  videoSource.src = this.mediaSrc; //this.episode_bid_item_best. //'https://s3.amazonaws.com/vmg-bucket/converted/966808401-web.mp4';
  //  videoSource.type = this.mediaType; // 'video/mp4';
  next();
};

Mdl.prototype.buildPlayer = function(next) {
  var videoElem = document.createElement('video');
  //var videoSource = document.createElement('source');
  $(videoElem).addClass('video-js vjs-default-skin');
  //  videoElem.appendChild(videoSource);
  dhr.html(this.getElemContainer(), videoElem);

  //  $(this.elemContainer).html(videoElem);
  // Player builds using videojs and inserted a link
  var ths = this;
  window.videojs(videoElem, {
    width: '100%',
    height: '100%',
    autoplay: false,
    preload: 'metadata',
    controls: true,
    controlBar: {
      muteToggle: true,
      fullscreenToggle: true,
      remainingTimeDisplay: false,
      durationDisplay: false,
      currentTimeDisplay: false,
      timeDivider: false,
      progressControl: false,
      playToggle: false
    }
  }, function() {
    ths.handlePlayer(next, this);
    //      $('.' + targetNamePlayer).show();
    //    console.log('player is loaded');
    // This is functionally the same as the previous example.
  });

};

exports.init = function() {
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;
