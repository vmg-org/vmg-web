/** @module */
'use strict';
var demoSid = 'qwer';
var rqst = require('../vmg-helpers/rqst');
var config = require('../vmg-helpers/config');

var handlePost = function(err, episodeBid) {
  if (err) {
    return alert(err);
  }
  console.log('episodeBid', episodeBid);
  window.location.hash = episodeBid.media_spec_item.id;
};

exports.run = function() {
  var dto = {
    id_of_episode_template: 4444, // from SQL INSERTs of api
    media_spec_item: {

    }
  };

  var opts = {
    data: JSON.stringify(dto)
  };

  var url = config.API_ENDPOINT + 'w2002?sid=' + demoSid;
  rqst.send('POST', url, opts, handlePost);
};

module.exports = exports;
