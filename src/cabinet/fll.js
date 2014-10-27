/** @module */
'use strict';

var dhr = require('../vmg-helpers/dom');
var srv = require('../vmg-services/srv');

var handleCancelBid = function(err) {
  if (err) {
    // TODO: #43! show w/o alert
    alert(err.message);
    return;
  }
};

var handleFncActBidCancel = function() {
  srv.d4001(this.bidInfo.id_of_media_spec, handleCancelBid.bind(this));
};

var handleFncActBidUpload = function() {
  alert('uploaded');
};


exports.fillBidInfo = function(next) {
  if (!this.bidInfo) {
    next();
    console.log('no bid info to fill');
    return;
  }

  //var elsActMovieScope = dhr.getElems('.' + this.cls.actMovieScope);
  dhr.impl(this.bem, this.cls.actMovieScope, 'movie_template', [this.bidInfo.episode_template_item.movie_template_item]);
  dhr.impl(this.bem, this.cls.actEpisodeScope, 'episode_template', [this.bidInfo.episode_template_item]);
  dhr.impl(this.bem, this.cls.actBidScope, 'episode_bid', [this.bidInfo]);


  dhr.on('.' + this.cls.fncActBidCancel, 'click', handleFncActBidCancel.bind(this));
  dhr.on('.' + this.cls.fncActBidUpload, 'click', handleFncActBidUpload.bind(this));

  //  fncActBidCancel: 'cbn-act-bid__fnc-cancel',
  //    fncActBidUpload: 'cbn-act-bid__fnc-upload'

  next();
  console.log('filled');
};

module.exports = exports;
