/**
 * Model builder: movie template, with addt fields
 * @module
 */
'use strict';

var convertToMMSS = function(time) {
  var minutes = Math.floor(time / 60);
  var seconds = time - minutes * 60;
  return minutes + ':' + seconds;
};

var Mdl = function(data, root) {
  this.root = root;
  Object.keys(data).forEach(this.mapKeys.bind(this, data));

  this.upper_name = this.name;
  this.img_preview_url = this.preview_img_url || './css/img/movie-black.png';
  this.url_to_watch = './watch.html?t=' + this.id;
  this.duration_str = convertToMMSS(this.duration_of_episodes * 3);
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
