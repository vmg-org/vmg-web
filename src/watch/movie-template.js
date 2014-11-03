/**
 * Model builder
 * @module
 */
'use strict';
//var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');
var mdlEpisodeTemplate = require('./episode-template');
var dhr = require('../vmg-helpers/dom');

var Mdl = function(data, root, zpath) {
  this.root = root;
  this.zpath = zpath;
  Object.keys(data).forEach(this.mapKeys.bind(this, data));
  this.episodeTemplates = null;
};

Mdl.prototype.mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

// put videos to created markup
Mdl.prototype.implEtmsVideos = function(next) {
  var arrFlow = [
    this.episodeTemplates[0].buildPlayer.bind(this.episodeTemplates[0], next)
  ];

  for (var ind = 1; ind < this.episodeTemplates.length; ind += 1) {
    arrFlow[ind] = this.episodeTemplates[ind].buildPlayer.bind(this.episodeTemplates[ind], arrFlow[ind - 1]);
  }

  arrFlow[arrFlow.length - 1]();
};

var handleEnded = function(prevEtm, nextEtm) {
  prevEtm.vjs.src(nextEtm.mediaSrc);
  prevEtm.vjs.play();
  //  var isPrevIsFs = prevEtm.vjs.isFullscreen();
  //  if (isPrevIsFs) {
  //    prevEtm.vjs.isFullscreen(false); // exitFullscreen();
  //  }
  ////  prevEtm.hideContainer();
  ////  prevEtm.vjs.hide(); 
  //  nextEtm.showContainer();
  //  if (isPrevIsFs){
  //    nextEtm.vjs.isFullscreen(true);
  //  }
  //
  //  nextEtm.vjs.play();
};

Mdl.prototype.startRelay = function() {
  console.log('implemented');
  //  var ths = this;
  var firstEtm = this.episodeTemplates[0];
  var secondEtm = this.episodeTemplates[1];
  var thirdEtm = this.episodeTemplates[2];
  // load and start first episode
  firstEtm.setVideoSrc();
  firstEtm.showContainer();
  firstEtm.vjs.play();

  firstEtm.vjs.on('loadedalldata', function() {
    secondEtm.setVideoSrc(); // start load   
    //    console.log('loadedalldata');
  });

  firstEtm.vjs.on('ended', handleEnded.bind(null, firstEtm, secondEtm));

  secondEtm.vjs.on('loadedalldata', function() {
    thirdEtm.setVideoSrc();
  });

  secondEtm.vjs.on('ended', handleEnded.bind(null, firstEtm, thirdEtm));
};

Mdl.prototype.implEtmsMarkup = function() {
  var arrEtmMarkup = this.episodeTemplates.map(function(item) {
    return item.buildHtml();
  });

  dhr.html('.' + this.root.cls.wchPlayerScope, arrEtmMarkup.join(''));

  this.implEtmsVideos(this.startRelay.bind(this));
};

Mdl.prototype.buildEtm = function(etmData, ind) {
  return mdlEpisodeTemplate.init(etmData, this, this.zpath + 'episodeTemplates[' + ind + ']');
};

Mdl.prototype.handleLoadEpisodeTemplates = function(err, data) {
  if (err) {
    return alert('Server error: load episodes. Please try later');
  }

  this.episodeTemplates = data.map(this.buildEtm.bind(this));

  if (this.episodeTemplates.length < 3) {
    return alert('Author of a movie has not build a full video. Please, choose another video.');
  }

  this.implEtmsMarkup();
};

Mdl.prototype.loadEpisodeTemplates = function() {
  srv.r1016(this.id, this.handleLoadEpisodeTemplates.bind(this));
};

Mdl.prototype.buildPlayer = function() {
  // build a player
  // take first url
  // set to source
  // show 1st episode info (on right of a screen)
  // when 1st video is loaded fully - start to load 2nd video
  // 2nd video - in another player (like 3d-cube of players)
  // 1st - preload, other - not
};

exports.init = function() {
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;
