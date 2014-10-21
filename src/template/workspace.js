/**
 * Only data, without DOM and other manipulation
 * @module
 * */

var movieTemplateService = require('../vmg-services/movie-template');
var mdlAuthHelper = require('../common/auth');

// Root model of the page
var Wsp = function(idOfMovieTemplate) {
  this.idOfMovieTemplate = idOfMovieTemplate;

  this.movieTemplate = null;

  this.err = null;

  this.mdlAuth = mdlAuthHelper.init();
};

Wsp.prototype.setMovieTemplate = function(err, movieTemplate) {
  if (err) {
    return this.setErr(err);
  }

  this.movieTemplate = movieTemplate;
  this.onMovieTemplate();
};

//shwMovieTemplatesName, shwGenreTagsName, shwEpisodesName
Wsp.prototype.loadMovieTemplate = function() {
  movieTemplateService.getMovieTemplateWithEpisodes(this.idOfMovieTemplate, this.setMovieTemplate.bind(this));
};

// Override it, args: err
Wsp.prototype.setErr = function(err) {
  this.err = err;
  this.onErr();
  //console.log(err);
  // redefine at your level
};

Wsp.prototype.run = function() {
  this.loadMovieTemplate();
};

exports.init = function() {
  // add methods
  var obj = Object.create(Wsp.prototype);
  // add props
  Wsp.apply(obj, arguments);
  // return created object
  return obj;
  //  return new Wsp.bind(this, arguments);
};

module.exports = exports;
