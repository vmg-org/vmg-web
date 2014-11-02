/** @module */
'use strict';

var hbrs = require('../vmg-helpers/hbrs');
var mdlGenreTag = require('./genre-tag');

var mapKeys = function(data, prop) {
  this[prop] = data[prop];
};
var Mdl = function(data, movieTemplate) {
  this.movieTemplate = movieTemplate;
  this.root = this.movieTemplate.root;
  Object.keys(data).forEach(mapKeys.bind(this, data));
  if (this.genre_tag_item) {
    this.genre_tag_item = mdlGenreTag.init(this.genre_tag_item);
    //    this.genre_tag_item.style = 'color: ' + this.genre_tag_item.color;
  }

  this.markup = hbrs.compile(this.root.markups.shwMovieGenre);
};

Mdl.prototype.buildHtml = function() {
  return this.markup(this);
};

exports.init = function(data, movieTemplate) {
  return new Mdl(data, movieTemplate);
};

module.exports = exports;
