/**
 * Model builder
 * @module
 */
'use strict';
//var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');
var mdlEpisodeTemplate = require('./episode-template');

var Mdl = function(data, root, zpath) {
  this.root = root;
  this.zpath = zpath;
  Object.keys(data).forEach(this.mapKeys.bind(this, data));
  this.episodeTemplates = null;
};

Mdl.prototype.mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

Mdl.prototype.buildEtm = function(etmData, ind) {
  return mdlEpisodeTemplate.init(etmData, this, this.zpath + 'episodeTemplates[' + ind + ']');
};

Mdl.prototype.handleLoadEpisodeTemplates = function(err, data) {
  if (err) {
    return alert('Server error: load episodes. Please try later');
  }

  this.episodeTemplates = data.map(this.buildEtm.bind(this));
};

Mdl.prototype.loadEpisodeTemplates = function() {
  srv.r1016(this.id, this.handleLoadEpisodeTemplates.bind(this));
};

exports.init = function() {
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;
