/** @module */

var dhr = require('../vmg-helpers/dom');
var lgr = require('../vmg-helpers/lgr');
var srv = require('../vmg-services/srv');
var ahr = require('../vmg-helpers/app');

var handleLoadMovieTemplates = function(next, err, arr) {
  if (err) {
    this.movieTemplatesErr = err;
    return next();
  }

  // insert blank images instead empty urls
  ahr.each(arr, function(item) {
    item.preview_img_url = item.preview_img_url || './css/img/movie-black.png';
    item.url_to_watch = './template.html?t=' + item.id;
  });

  this.movieTemplates = arr;
  next();
};

exports.loadMovieTemplates = function(next) {
  srv.r1001(handleLoadMovieTemplates.bind(this, next));
};


exports.fillMovieTemplates = function(next) {
  if (this.movieTemplatesErr) {
    dhr.setError('.' + this.cls.movieTemplates);
    next();
    return;
  }

  dhr.impl(this.bem, this.cls.movieTemplates, 'movie_template', this.movieTemplates);
  next();
};

exports.fillMovieRecords = function(next) {
  if (this.movieRecordsErr) {
    dhr.html('.' + this.cls.movieRecords, '<span style="color:orangered">error retrieving information</span>');
    lgr.info(this.movieRecordsErr);
    return next();
  }

  dhr.impl(this.bem, this.cls.movieRecords, 'movie_record', this.movieRecords);
  next();
};

module.exports = exports;
