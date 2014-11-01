/** @module */
'use strict';

var ahr = require('../vmg-helpers/app');
var dhr = require('../vmg-helpers/dom');
var mdlEpisodeBid = require('./episode-bid');
var srv = require('../vmg-services/srv');

var mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

var Mdl = function(data, movieTemplate, ind) {
  // TODO: #43! ind can change: calc dynamicall from a parrent
  //  this.ind = movieTemplate.episodeTemplates[

  this.movieTemplate = movieTemplate;
  this.zpath = this.movieTemplate.zpath + '.episodeTemplates[' + ind + ']';

  this.root = this.movieTemplate.root;
  // all fields from server
  Object.keys(data).forEach(mapKeys.bind(this, data));

  this.episode_bid_count_non_ready = ahr.toInt(data.episode_bid_count) - ahr.toInt(data.episode_bid_count_ready);
  this.fnc_show_atts = this.zpath + '.showAtts(this);';
  this.fnc_upload_now = this.zpath + '.startUploadNow(this);';
  this.fnc_upload_later = this.zpath + '.startUploadLater(this);';
  this.vjs = null; // video js object
  this.episode_bid_arr_user = null; //  loaded from movie template in one request for all episodes

  this.createdEpisodeBid = null; // just created bid
};

Mdl.prototype.showAtts = function(elem) {
  var dataFor = elem.getAttribute('data-for');
  var jqrContainer = $('.' + dataFor + '[data-id="' + this.id + '"]');

  if (dhr.isElems(jqrContainer, ':visible')) {
    jqrContainer.hide('slow');
  } else {
    jqrContainer.show('slow');
    this.loadBids(this.fillBids.bind(this));
  }
};

Mdl.prototype.mapEpisodeBid = function(item, ind) {
  return mdlEpisodeBid.init(item, this, ind);
};

Mdl.prototype.handleLoadBids = function(next, err, data) {
  if (err) {
    alert(err.message || '%=serverError=%');
    return;
  }
  // next - fill bids

  this.episodeBids = data.map(this.mapEpisodeBid.bind(this));
  next();
};

Mdl.prototype.loadBids = function(next) {
  if (this.episodeBids) {
    next();
    return;
  }

  srv.r1015(this.id, this.handleLoadBids.bind(this, next));
};

Mdl.prototype.fillBids = function() {
  var arrHtml = this.episodeBids.map(function(item) {
    return item.buildHtml();
  });

  var jqrInfoScope = $('.' + this.root.cls.attInfoScope + '[data-id="' + this.id + '"]');
  jqrInfoScope.html(arrHtml.join(''));

};

// cant send a this
var handlePlayerReady = function(vjs, etm) {
  etm.vjs = vjs;
};

Mdl.prototype.buildEtmPlayer = function() {
  var videoElem = document.createElement('video');
  // for flash data-tag is not sufficient to apply a new source of video
  //    $(videoElem).attr('data-id', this.episodeTemplates[ind].id);
  $(videoElem).addClass('video-js vjs-default-skin');
  $('.' + this.root.cls.attPlayer + '[data-id=' + this.id + ']').html(videoElem);

  var etm = this;

  // Player builds using videojs and inserted a link
  window.videojs(videoElem, {
    width: '100%',
    height: '100%',
    controls: true
  }, function() {
    // this = player
    handlePlayerReady(this, etm);
  });
};

Mdl.prototype.handlePostBid = function(next, err, episodeBid) {
  if (err) {
    alert(err.message || '%=serverError=%');
    return;
  }

  // created bid for upload (now or later)
  this.createdEpisodeBid = episodeBid;

  next();
};

Mdl.prototype.postBid = function(next) {
  var dto = {
    id_of_episode_template: this.id, // id of etm
    media_spec_item: {}
  };

  srv.w2002(dto, this.handlePostBid.bind(this, next));
};

Mdl.prototype.afterUploadLater = function() {
  window.location.reload();
};

Mdl.prototype.startUploadLater = function(elem) {
  dhr.disable(elem); // to double-click prevent
  this.postBid(this.afterUploadLater.bind(this));
};

Mdl.prototype.afterUploadNow = function() {
  window.location.href = './upload.html?m=' + this.createdEpisodeBid.id_of_media_spec;
};

Mdl.prototype.startUploadNow = function(elem) {
  dhr.disable(elem);
  this.postBid(this.afterUploadNow.bind(this));
};

exports.init = function(data, movieTemplate, ind) {
  return new Mdl(data, movieTemplate, ind);
};

module.exports = exports;
