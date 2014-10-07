/** @module template/vwjs */
'use strict';

//var bem = require('../../bower_components/vmg-bem/bems/template-editor.bemjson');
var bem = require('../../../vmg-bem/bems/template.bemjson');

var dhr = require('../vmg-helpers/dom');

var movieTemplateService = require('../vmg-services/movie-template');

var handleMovieTemplate = function(shwMovieTemplatesName, shwGenreTagsName, shwEpisodesName, err, data) {
  console.log(err);
  if (err) {
    // show notif about error
    return;
  }
  console.log(shwMovieTemplatesName);
  console.log(data);
  dhr.impl(bem, shwMovieTemplatesName, 'movie_template', [data]);
  
  dhr.impl(bem, shwGenreTagsName, 'genre_tag', [data.genre_tag]);
  dhr.impl(bem, shwEpisodesName, 'episode_template', data.episode_templates);
};

exports.run = function(app) {

  /**
   * Load a template with all episodes
   * @param {Object} elem - body
   * @param {Object} e - onload
   * @param {String} shwMovieTemplatesName - block with info
   * @param {String} shwEpisodesName - block with episodes
   */
  app.loadMovieTemplate = function(elem, e, shwMovieTemplatesName, shwGenreTagsName, shwEpisodesName) {
    console.log(shwMovieTemplatesName);
    // from address bar (or 
    var idOfMovieTemplate = 1234; // get from url
    movieTemplateService.getMovieTemplateWithEpisodes(idOfMovieTemplate, handleMovieTemplate.bind(null, shwMovieTemplatesName, shwGenreTagsName, shwEpisodesName));
  };
};

module.exports = exports;
