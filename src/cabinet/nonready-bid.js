/** @module */
'use strict';

var srv = require('../vmg-services/srv');
var dhr = require('../vmg-helpers/dom');
var hbrs = require('../vmg-helpers/hbrs');

var Mdl = function(data, root, zpath) {
  this.root = root;
  this.zpath = zpath;
  Object.keys(data).forEach(this.mapKeys.bind(this, data));

  this.bidInfo = null;

  this.fnc_act_bid_upload = zpath + '.fncActBidUpload()';
  this.fnc_act_bid_cancel = zpath + '.fncActBidCancel()';


  this.markupMovie = hbrs.compile(this.root.markups.actBidMovie);
  this.markupEpisode = hbrs.compile(this.root.markups.actBidEpisode);
  this.markup = hbrs.compile(this.root.markups.actBid);
};

Mdl.prototype.mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

Mdl.prototype.calcProps = function() {
  // addt fields
  this.bidInfo.episode_template_item.movie_template_item.url_to_view = './template.html?t=' +
    this.bidInfo.episode_template_item.movie_template_item.id;

  if (this.bidInfo.media_spec_item.job_source_item) {
    this.lbl_act_bid_upload = 'Cut an uploaded video';
    this.lbl_act_bid_cancel = 'Cancel a bid';
  } else {
    this.lbl_act_bid_upload = 'Upload a video';
    this.lbl_act_bid_cancel = 'Cancel a bid';
  }
};

Mdl.prototype.handleBidInfo = function(next, err, bidInfo) {
  if (err) {
    this.root.handleError(err);
    return;
  }

  this.bidInfo = bidInfo;

  this.calcProps();

  console.log('bidInfo', bidInfo);
  this.fillBidInfo(next);
};

/**
 * Load an episode template and movie template info
 */
Mdl.prototype.loadBidInfo = function(next) {
  srv.r1008(this.id_of_media_spec, this.handleBidInfo.bind(this, next));
};

Mdl.prototype.handleCancelBid = function(err) {
  if (err) {
    this.root.handleError(err);
    return;
  }

  this.root.reloadPage();
  // if true
  // hide all blocks
  //  dhr.hideElems('.' + this.cls.actMovieScope);
  //  dhr.hideElems('.' + this.cls.actEpisodeScope);
  // dhr.hideElems('.' + this.cls.actBidScope);
  // clean bidInfo too
  // clean episodeInfo
};

Mdl.prototype.fncActBidCancel = function() {
  srv.d4001(this.id_of_media_spec, this.handleCancelBid.bind(this));
};

Mdl.prototype.fncActBidUpload = function() {
  if (this.bidInfo.media_spec_item.job_source_item) {
    this.root.rdr('./enhance.html?m=' + this.id_of_media_spec);
  } else {
    this.root.rdr('./upload.html?m=' + this.id_of_media_spec);
  }
};

Mdl.prototype.fillBidInfo = function(next) {
  if (!this.bidInfo) {
    next();
    console.log('no bid info to fill');
    return;
  }

  dhr.html('.' + this.root.cls.actMovieScope, this.markupMovie(this.bidInfo.episode_template_item.movie_template_item));
  dhr.html('.' + this.root.cls.actEpisodeScope, this.markupEpisode(this.bidInfo.episode_template_item));
  dhr.html('.' + this.root.cls.actBidScope, this.markup(this));

  next();
};

exports.init = function() {
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;