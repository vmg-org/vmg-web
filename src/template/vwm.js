/** @module */

var movieTemplateService = require('../vmg-services/movie-template');
var dhr = require('../vmg-helpers/dom');

exports.fillMovieTemplate = function(next) {
  dhr.impl(this.bem, this.cls.movieTemplateScope, 'movie_template', [this.movieTemplate]);
  dhr.impl(this.bem, this.cls.genreTagScope, 'genre_tag', [this.movieTemplate.genre_tag_item]);
  dhr.impl(this.bem, this.cls.episodeTemplateScope, 'episode_template', this.movieTemplate.episode_template_arr);
  next();
};

exports.waitDocReady = function(next) {
  $(this.doc).ready(next);
};

exports.handleMovieTemplate = function(next, err, movieTemplate) {
  if (err) {
    //	  locHelper.moveToError(this.doc, msg);
    this.doc.location.href = 'error.html';
    // redirect to error page
    return;
  }

  this.movieTemplate = movieTemplate;
  next();
};

exports.loadMovieTemplate = function(next) {
  movieTemplateService.getMovieTemplateWithEpisodes(this.idOfMovieTemplate, next);
};

module.exports = exports;
