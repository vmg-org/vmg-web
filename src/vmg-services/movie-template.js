'use strict';

var ahr = require('../vmg-helpers/app');
var rqst = require('../vmg-helpers/rqst');
var config = require('../config');
var apiUrl = config.API_ENDPOINT;

exports.getListOfMovieTemplate = function(next) {
  next(null, ['asdfasd']);
};

var handleMovieTemplateWithEpisodes = function(next, err, data) {
  if (err) {
    return next(err);
  }

  // different pages might require diff computed values, but usuall only one flow
  // add computed values
  data.duration_of_episodes_str = data.duration_of_episodes + ' seconds';
  data.created_str = ahr.getTimeStr(data.created, 'lll');
  data.finished_str = ahr.getTimeStr(data.finished, 'lll');
  data.genre_tag_item.style = 'color: ' + data.genre_tag_item.color;
  //  ahr.each(data.episode_templates, function(item) {
  //    item.name_order = 'Episode ' + item.order_in_movie;
  //  });

  next(null, data);
};

exports.getMovieTemplateWithEpisodes = function(id, next) {
  rqst.send('GET', apiUrl + 'r1002?id=' + id, {}, handleMovieTemplateWithEpisodes.bind(null, next));
};

module.exports = exports;
