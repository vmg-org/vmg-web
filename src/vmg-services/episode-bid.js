'use strict';

//var demoSid = 'qwer'; // retrieve from cookie everytime
var rqst = require('../vmg-helpers/rqst');
var config = require('../config');
var apiUrl = config.API_ENDPOINT;

// public
exports.getItemWithEpisodeAndMovie = function(id_of_media_spec, next) {
  rqst.send('GET', apiUrl + 'r1008', {
    data: {
      id_of_media_spec: id_of_media_spec
    }
  }, next);
};

module.exports = exports;
