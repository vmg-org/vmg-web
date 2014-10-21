/** @module template/vwjs */
'use strict';

var commonVwjs = require('../vmg-helpers/vwjs');
var workspace = require('./workspace');

var dhr = require('../vmg-helpers/dom');
//var bem = require('../../bower_components/vmg-bem/bems/template-editor.bemjson');
var bem = require('../../../vmg-bem/bems/template.bemjson');

/**
 * Load a template with all episodes
 * @param {Object} elem - body
 * @param {Object} e - onload
 * @param {String} shwMovieTemplatesName - block with info
 * @param {String} shwEpisodesName - block with episodes
 */
var loadMovieTemplate = function(elem, e, shwMovieTemplatesName, shwGenreTagsName, shwEpisodesName) {
  var idOfMovieTemplate = 1234;
  var wsp = workspace.init(idOfMovieTemplate);

  wsp.onErr = function() {
    console.log('myhandler', this.err.message);
  };

  // When movie template - updates
  wsp.onMovieTemplate = function() {
    dhr.impl(bem, shwMovieTemplatesName, 'movie_template', [this.movieTemplate]);
    dhr.impl(bem, shwGenreTagsName, 'genre_tag', [this.movieTemplate.genre_tag]);
    dhr.impl(bem, shwEpisodesName, 'episode_template', this.movieTemplate.episode_templates);
  };

  wsp.run();
};

exports.run = function(app) {
  commonVwjs.run(app);
  app.loadMovieTemplate = loadMovieTemplate;
};

module.exports = exports;
