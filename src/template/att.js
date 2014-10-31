/** @module */
'use strict';

var dhr = require('../vmg-helpers/dom');
var srv = require('../vmg-services/srv');
var mdlBid = require('./episode-bid');

var fillBids = function(idOfEpisodeTemplate) {
  var readyHtml = dhr.hfb(this.bem, this.cls.attInfoScope, 'episode_bid', this.tmpBids);
  var jqrInfoScope = $('.' + this.cls.attInfoScope + '[data-id="' + idOfEpisodeTemplate + '"]');

  jqrInfoScope.html($(readyHtml).children());
};


var mapBid = function(item, ind) {
  return mdlBid.init(item, ind);
};

var handleLoadBids = function(next, err, data) {
  if (err) {
    alert(err.message || '%=serverError=%');
    return;
  }
  console.log('load bids', err, data);
  // next - fill bids

  this.tmpBids = data.map(mapBid);
  //  window.app.playBid = playBid;
  next();
};

var loadBids = function(idOfEpisodeTemplate, next) {
  srv.r1015(idOfEpisodeTemplate, handleLoadBids.bind(this, next));
};

exports.run = function(idOfEpisodeTemplate) {
  // , attContainer, attRow
  var flow = loadBids.bind(this, idOfEpisodeTemplate,
    fillBids.bind(this, idOfEpisodeTemplate));

  flow();
  //  dhr.html(attContainer, attRow);
};

module.exports = exports;
