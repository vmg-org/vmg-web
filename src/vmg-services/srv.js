/** 
 * All services
 *    auto generated
 */
'use strict';

var apiRqst = require('../vmg-helpers/api-rqst');

// {"id":3333,"name":"MyMovie","duration_of_episodes":15,"preview_img_url":"","created":1414043719,"finished":1414304719,"movie_genre_item":{"id_of_movie_template":3333,"id_of_genre_tag":"nature","color_schema":"superschemaforpickcolor","genre_tag_item":{"id":"nature","name":"Nature","color":"green"}}} 
// public method
exports.r1002 = function(id, next) {
  apiRqst.sendGetPublic('r1002', {
    id: id
  }, next);
};
