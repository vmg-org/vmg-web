/** @module */
'use strict';
var episodeBidService = require('../vmg-services/episode-bid');

var handlePost = function(next, err, episodeBid) {
  if (err) {
    return alert(err);
  }

  // Show info about episode bid: name of movie, name of episode
  // Upload all info as one request (cached)

  console.log('episodeBid', episodeBid);
  window.location.hash = episodeBid.media_spec_item.id;
  next();
};

exports.run = function(next) {
  var dto = {
    id_of_episode_template: 4444, // from SQL INSERTs of api
    media_spec_item: {

    }
  };

  episodeBidService.postItem(dto, handlePost.bind(null, next));
};

module.exports = exports;
