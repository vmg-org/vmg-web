/** @module */
'use strict';
var mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

var Mdl = function(data, episodeBid) {
  this.episodeBid = episodeBid;

  Object.keys(data).forEach(mapKeys.bind(this, data));
  this.preview_img_url = this.preview_img_url || './css/img/movie-black.png';
};

exports.init = function(data, episodeBid) {
  return new Mdl(data, episodeBid);
};

module.exports = exports;
