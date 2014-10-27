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

// DELETE methods =======
exports.d4001 = function(id_of_media_spec, next) {
  apiRqst.sendDelete('d4001', {
    id_of_media_spec: id_of_media_spec
  }, next);
};
