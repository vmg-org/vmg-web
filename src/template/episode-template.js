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
  this.root = this.movieTemplate.root;
  // all fields from server
  Object.keys(data).forEach(mapKeys.bind(this, data));

  this.episode_bid_count_non_ready = ahr.toInt(data.episode_bid_count) - ahr.toInt(data.episode_bid_count_ready);
  this.fnc_show_atts = 'app.movieTemplate.episodeTemplates[' + ind + '].showAtts(this);';
};

Mdl.prototype.showAtts = function(elem) {
  var dataFor = elem.getAttribute('data-for');
  var jqrContainer = $('.' + dataFor + '[data-id="' + this.id + '"]');

  if (dhr.isElems(jqrContainer, ':visible')) {
    jqrContainer.hide('slow');
  } else {
    jqrContainer.show('slow');
    this.loadBids(this.fillBids.bind(this));
    //   var attRow = dhr.getElems('.' + this.cls.attRow);
    //  att.run.apply(this, [idOfEpisodeTemplate, jqrContainer, attRow]);
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
  console.log('load bids', err, data);
  // next - fill bids

  this.episodeBids = data.map(this.mapEpisodeBid.bind(this));
  //  window.app.playBid = playBid;
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

  console.log('fill bids', arrHtml);
  var jqrInfoScope = $('.' + this.root.cls.attInfoScope + '[data-id="' + this.id + '"]');
  jqrInfoScope.html(arrHtml.join(''));

  //  var readyHtml = dhr.hfb(this.bem, this.cls.attInfoScope, 'episode_bid', this.tmpBids);
};

exports.init = function(data, movieTemplate, ind) {
  return new Mdl(data, movieTemplate, ind);
};
//var fillBids = function(idOfEpisodeTemplate) {
//  var readyHtml = dhr.hfb(this.bem, this.cls.attInfoScope, 'episode_bid', this.tmpBids);
//  var jqrInfoScope = $('.' + this.cls.attInfoScope + '[data-id="' + idOfEpisodeTemplate + '"]');
//
//  jqrInfoScope.html($(readyHtml).children());
//};

module.exports = exports;
