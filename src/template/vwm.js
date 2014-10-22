/** @module */

var movieTemplateService = require('../vmg-services/movie-template');
var dhr = require('../vmg-helpers/dom');
var ahr = require('../vmg-helpers/app');

exports.loadUserRights = function(next) {
  // Whether the user is owner of movie?
  // --> id_of_movie_template
  // <-- true | false
  // if true
  // show and add events to admin buttons
  // if false
  // check: Whether the user plays in episodes already
  // If false
  // show gray buttons
  // else
  // show active buttons

  next();
};

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

exports.loadIdOfMovieTemplate = function(next) {
  var paramT = ahr.getQueryParam('m');
  if (!paramT) {
    return alert('required: "?m=123" param in url: id of movie template');
  }

  paramT = ahr.toInt(paramT);

  if (!paramT) {
    return alert('required: "?m=123" param in url: id of movie template (integer)');
  }

  this.idOfMovieTemplate = paramT;

  next();
};

module.exports = exports;
