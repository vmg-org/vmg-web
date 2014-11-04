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
//var dhr = require('../vmg-helpers/dom');
//var hbrs = require('../vmg-helpers/hbrs');

var Mdl = function(data, movieTemplate, zpath) {
  this.movieTemplate = movieTemplate;
  this.root = this.movieTemplate.root;
  this.zpath = zpath;

  Object.keys(data).forEach(this.mapKeys.bind(this, data));
  this.mediaSrc = this.episode_bid_item_best.media_spec_item.file_cut_item.media_file_item.url;
  this.mediaType = this.episode_bid_item_best.media_spec_item.file_cut_item.media_file_item.id_of_container_format;
};

Mdl.prototype.mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

exports.init = function() {
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;
