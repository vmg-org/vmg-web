/** 
 * All services
 *    auto generated
 */
'use strict';

var apiRqst = require('../vmg-helpers/api-rqst');

// Get top movie templates
exports.r1001 = function(next) {
  apiRqst.sendGetPublic('r1001', {}, next);
};

// {"id":3333,"name":"MyMovie","duration_of_episodes":15,"preview_img_url":"","created":1414043719,"finished":1414304719,"movie_genre_item":{"id_of_movie_template":3333,"id_of_genre_tag":"nature","color_schema":"superschemaforpickcolor","genre_tag_item":{"id":"nature","name":"Nature","color":"green"}}} 
// public method
exports.r1002 = function(id, next) {
  apiRqst.sendGetPublic('r1002', {
    id: id
  }, next);
};
exports.r1003 = function(next) {
  // secured method - do not send this method withoud SID in localStorage
  apiRqst.sendGet('r1003', {}, next);
};

exports.r1005 = function(id_of_media_spec, next) {
  apiRqst.sendGet('r1005', {
    id_of_media_spec: id_of_media_spec
  }, next);
};
exports.r1006 = function(id_of_media_spec, next) {
  apiRqst.sendGet('r1006', {
    id_of_media_spec: id_of_media_spec
  }, next);
};
exports.r1007 = function(id_of_media_spec, next) {
  apiRqst.sendGet('r1007', {
    id_of_media_spec: id_of_media_spec
  }, next);
};

exports.r1008 = function(id_of_media_spec, next) {
  apiRqst.sendGetPublic('r1008', {
    id_of_media_spec: id_of_media_spec
  }, next);
};

// public - GET episode_templates wit episode_bid counts
exports.r1009 = function(idOfMovieTemplate, next) {
  apiRqst.sendGetPublic('r1009', {
    id_of_movie_template: idOfMovieTemplate
  }, next);
};

// GET /r1010 Get episode_bid_arr, filtered by array of id_of_episode_template; which created by current user_profile
exports.r1010 = function(id_of_episode_template_arr, next) {
  apiRqst.sendGet('r1010', {
    id_of_episode_template_arr: id_of_episode_template_arr
  }, next);
};

// Get not-uploaded episode_bid_arr, created by current user_profile: usually it - one record (or null)
exports.r1011 = function(next) {
  apiRqst.sendGet('r1011', {}, next);
};

// Get user's movie templates (Active)
exports.r1012 = function(next) {
  apiRqst.sendGet('r1012', {}, next);
};

// DELETE methods =======
exports.d4001 = function(id_of_media_spec, next) {
  apiRqst.sendDelete('d4001', {
    id_of_media_spec: id_of_media_spec
  }, next);
};

exports.w2000 = function(dto, next) {
  apiRqst.sendPost('w2000', {}, dto, next);
};

exports.w2001 = function(dto, next) {
  apiRqst.sendPostPublic('w2001', {}, dto, next);
};

exports.w2002 = function(dto, next) {
  apiRqst.sendPost('w2002', {}, dto, next);
};

exports.w2003 = function(jobSource, next) {
  apiRqst.sendPost('w2003', {}, jobSource, next);
};

exports.w2004 = function(dto, next) {
  apiRqst.sendPost('w2004', {}, dto, next);
};

exports.w2005 = function(dto, next) {
  apiRqst.sendPost('w2005', {}, dto, next);
};

exports.d4000 = function(next) {
  apiRqst.sendDelete('d4000', {}, next);
};

exports.getGenreTags = function(next) {
  var tags = [{
    genre_id: 'nature',
    genre_name: 'Nature',
    genre_color: 'green',
    genre_icon_style: 'color: green'
  }, {
    genre_id: 'hero',
    genre_name: 'Hero',
    genre_color: 'red',
    genre_icon_style: 'color: red'
  }, {
    genre_id: 'city',
    genre_name: 'City',
    genre_color: 'gray',
    genre_icon_style: 'color: brown'
  }, {
    genre_id: 'animal',
    genre_name: 'Animals',
    genre_color: 'yellow',
    genre_icon_style: 'color: yellow'
  }, {
    genre_id: 'hollywood',
    genre_name: 'Hollywood',
    genre_color: 'purple',
    genre_icon_style: 'color: purple'
  }];

  next(null, tags);
};

exports.getMovieRecordsTop = function(next) {
  var data = [{
    name: 'requiem about dream',
    upper_name: 'REQUIEM FOR A DREAM',
    img_preview_url: './css/img/movie-black.png',
    url_to_watch: './watch.html?v=requiem'
  }, {
    name: 'hard die',
    upper_name: 'DIE HARD',
    img_preview_url: './css/img/movie-black.png',
    url_to_watch: './watch.html?v=die-hard'
  }, {
    name: 'Hatiko',
    upper_name: 'HATIKO',
    img_preview_url: './css/img/movie-black.png',
    url_to_watch: './watch.html?v=hatiko'
  }];

  next(null, data);
};
