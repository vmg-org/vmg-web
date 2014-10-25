/** @module */

var dhr = require('../vmg-helpers/dom');
var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');

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

  // if genre exists - show this block
  if (this.movieTemplate.movie_genre_item) {
    dhr.impl(this.bem, this.cls.genreTagScope, 'genre_tag', [this.movieTemplate.movie_genre_item.genre_tag_item]);
    dhr.showElems('.' + this.cls.genreTagScope);
  }
  // TODO: #33! episodes - later in next request
  //  dhr.impl(this.bem, this.cls.episodeTemplateScope, 'episode_template', this.movieTemplate.episode_template_arr);
  next();
};

exports.waitDocReady = function(next) {
  $(this.doc).ready(next);
};

var handleMovieTemplate = function(next, err, data) {
  if (err) {
    alert(err.message);
    //	  locHelper.moveToError(this.doc, msg);
    //    this.doc.location.href = 'error.html';
    // redirect to error page
    return;
  }

  if (!data) {
    alert('Template is not found');
    return;
  }

  // different pages might require diff computed values, but usuall only one flow
  // add computed values
  data.duration_of_episodes_str = data.duration_of_episodes + ' seconds';
  data.created_str = ahr.getTimeStr(data.created, 'lll');
  data.finished_str = ahr.getTimeStr(data.finished, 'lll');
  // as solution: no genre in a movie. But in most cases - it is exists
  if (data.movie_genre_item) {
    if (data.movie_genre_item.genre_tag_item) {
      data.movie_genre_item.genre_tag_item.style = 'color: ' + data.movie_genre_item.genre_tag_item.color;
    }
  }
  //  ahr.each(data.episode_templates, function(item) {
  //    item.name_order = 'Episode ' + item.order_in_movie;
  //  });

  this.movieTemplate = data;
  next();
};

exports.loadMovieTemplate = function(next) {
  srv.r1002(this.idOfMovieTemplate,
    handleMovieTemplate.bind(this, next));
};

exports.loadIdOfMovieTemplate = function(next) {
  var paramT = ahr.getQueryParam('t');
  if (!paramT) {
    return alert('required: "?t=123" param in url: id of movie template');
  }

  paramT = ahr.toInt(paramT);

  if (!paramT) {
    return alert('required: "?t=123" param in url: id of movie template (integer)');
  }

  this.idOfMovieTemplate = paramT;

  next();
};

module.exports = exports;
