/** @module */

var Mdl = function(data, episodeBid) {
  this.episodeBid = episodeBid;

  this.id_of_media_spec = data.id_of_media_spec;
  this.created = data.created;
  this.description = data.description;
  this.is_approved = data.is_approved;
};

exports.init = function(data, episodeBid) {
  return new Mdl(data, episodeBid);
};

module.exports = exports;
