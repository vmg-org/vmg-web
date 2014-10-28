/** @module */

//var lgr = require('../vmg-helpers/lgr');
var srv = require('../vmg-services/srv');
//var ahr = require('../vmg-helpers/app');

exports.waitDocReady = function(next) {
  $(this.doc).ready(next);
};

var handleGenreTags = function(next, err, genreTags) {
  if (err) {
    alert(err.message || '%=serverError=%');
    return;
  }

  this.genreTags = genreTags;
  console.log('tags', this.genreTags);
  next();
};

exports.loadGenreTags = function(next) {
  srv.getGenreTags(handleGenreTags.bind(this, next));
};

module.exports = exports;
