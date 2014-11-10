/** @module */

var Mdl = function(data, episodeBid) {
  this.episodeBid = episodeBid;

  this.id_of_media_spec = data.id_of_media_spec;
  this.rating = data.rating;
  this.created = data.created;
};

exports.init = function(data, episodeBid) {
  return new Mdl(data, episodeBid);
};

module.exports = exports;
