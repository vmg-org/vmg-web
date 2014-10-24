/** @module */

var movieRecordService = require('../vmg-services/movie-record');
var dhr = require('../vmg-helpers/dom');
var lgr = require('../vmg-helpers/lgr');

exports.waitDocReady = function(next) {
  $(this.doc).ready(next);
};

exports.loadMovieTemplates = function(next) {
  next();
};

var cbkWelcomeRecordList = function(next, err, data) {
  if (err) {
    this.movieRecordsErr = err;
    next();
    return;
  }

  this.movieRecords = data;
  next();
};

exports.loadMovieRecords = function(next) {
  movieRecordService.getWelcomeList(cbkWelcomeRecordList.bind(this, next));
};

exports.fillMovieTemplates = function(next) {
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
