'use strict';

var ahr = require('../vmg-helpers/app');
var rqst = require('../vmg-helpers/rqst');
var config = require('../config');
var apiUrl = config.API_ENDPOINT;

exports.getListOfMovieTemplate = function(next) {
  next(null, ['asdfasd']);
};

// {"id":3333,"name":"MyMovie","duration_of_episodes":15,"preview_img_url":"","created":1414043719,"finished":1414304719,"movie_genre_item":{"id_of_movie_template":3333,"id_of_genre_tag":"nature","color_schema":"superschemaforpickcolor","genre_tag_item":{"id":"nature","name":"Nature","color":"green"}}} 
var handleMovieTemplateWithEpisodes = function(next, err, data) {
  if (err) {
    return next(err);
  }

  // different pages might require diff computed values, but usuall only one flow
  // add computed values
  data.duration_of_episodes_str = data.duration_of_episodes + ' seconds';
  data.created_str = ahr.getTimeStr(data.created, 'lll');
  data.finished_str = ahr.getTimeStr(data.finished, 'lll');
  data.movie_genre_item.genre_tag_item.style = 'color: ' + data.movie_genre_item.genre_tag_item.color;
  //  ahr.each(data.episode_templates, function(item) {
  //    item.name_order = 'Episode ' + item.order_in_movie;
  //  });

  next(null, data);
};

exports.getMovieTemplateWithEpisodes = function(id, next) {
  rqst.send('GET', apiUrl + 'r1002?id=' + id, {}, handleMovieTemplateWithEpisodes.bind(null, next));
};

module.exports = exports;
