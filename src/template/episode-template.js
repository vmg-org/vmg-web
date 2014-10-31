/** @module */
'use strict';

var ahr = require('../vmg-helpers/app');

var mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

var Mdl = function(data) {
  // all fields from server
  Object.keys(data).forEach(mapKeys.bind(this, data));

  this.episode_bid_count_non_ready = ahr.toInt(data.episode_bid_count) - ahr.toInt(data.episode_bid_count_ready);
};

exports.init = function(data) {
  return new Mdl(data);
};

module.exports = exports;
