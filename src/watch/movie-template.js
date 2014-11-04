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
  this.vjs = null; // player for all episodes (merged in one consequently)
};

Mdl.prototype.mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

var cacheSrc = function(src, next) {
  console.log('src cache', src);
  var vdo = document.createElement('video');
  vdo.addEventListener('loadeddata', function() {
    next();
  });
  vdo.src = src; // start loading
  vdo.load(); // Causes the element to reset and start selecting and loading a new media resource from scratch.

  // xhr creates OPTIONS request and wrond accept-types
  //  console.log('src cache', src);
  //  var xhr = new XMLHttpRequest();
  //  xhr.onload = function() {
  //    next();
  //  };
  //  xhr.open('GET', src);
  //  xhr.setRequestHeader('range', 'bytes=0-');
  //  //  xhr.setRequestHeader('Accept-Encoding', 'identity;q=1, *;q=0');
  //
  //  //		  Range:bytes=0-
  //
  //  xhr.send('');
};

Mdl.prototype.cacheOtherVideos = function() {
  console.log('video data loaded, load other episodes');

  var src1 = this.episodeTemplates[1].mediaSrc;
  var src2 = this.episodeTemplates[2].mediaSrc;

  cacheSrc(src1,
    cacheSrc.bind(null, src2, function() {
      console.log('all loaded to cache');
    }));

  //  for (var ind = 1; ind < this.episodeTemplates.length; ind += 1) {
  //    cacheSrc(this.episodeTemplates[ind].mediaSrc);
  //  }
};

Mdl.prototype.handleEnded = function(counterScope) {
  counterScope.ind += 1;
  if (counterScope.ind < this.episodeTemplates.length) {
    this.vjs.src(this.episodeTemplates[counterScope.ind].mediaSrc);
    this.vjs.play();
  } else {
    // set again
    this.vjs.src(this.episodeTemplates[0].mediaSrc);
  }
};

Mdl.prototype.startRelay = function() {
  console.log('implemented');
  // if first video in cache - usually other too (but not in all cases)
  this.vjs.one('loadeddata', this.cacheOtherVideos.bind(this));

  var counterScope = {
    ind: 0
  };
  this.vjs.on('ended', this.handleEnded.bind(this, counterScope));
  this.vjs.src(this.episodeTemplates[0].mediaSrc);
  this.vjs.play();
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

  this.buildPlayer(this.startRelay.bind(this));
};

Mdl.prototype.loadEpisodeTemplates = function() {
  srv.r1016(this.id, this.handleLoadEpisodeTemplates.bind(this));
};

Mdl.prototype.handlePlayer = function(next, vjs) {
  this.vjs = vjs;
  next();
};

// One player for all files
Mdl.prototype.buildPlayer = function(next) {
  var elemVid = dhr.getElem('.' + this.root.cls.wchVid);
  $(elemVid).addClass('video-js vjs-default-skin');
  var ths = this;
  window.videojs(elemVid, {
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
      playToggle: true
    }
  }, function() {
    ths.handlePlayer(next, this);
    //      $('.' + targetNamePlayer).show();
    //    console.log('player is loaded');
    // This is functionally the same as the previous example.
  });
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
