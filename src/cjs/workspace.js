/** @module workspace */
'use strict';

var movieTemplateService = require('./movie-template/service');
var authIssuerService = require('./auth-issuer/service');
var lgr = require('./lgr');

// Create an object with ready data or load data after initialization */
var Model = function() {
  /** Auth providers */
  this.listOfAuthIssuer = [];

  /** Movie templates, scenarios */
  this.listOfMovieTemplate = [];
};

Model.prototype.handleListOfAuthIssuer = function(err, list) {
  this.listOfAuthIssuer = list;
};

Model.prototype.getListOfAuthIssuer = function() {
  authIssuerService.getListOfAuthIssuer(this.handleListOfAuthIssuer.bind(this));
};

Model.prototype.handleListOfMovieTemplate = function(err, list) {
  this.listOfMovieTemplate = list;
};

Model.prototype.getListOfMovieTemplates = function() {
  movieTemplateService.getListOfMovieTemplates(this.handleListOfMovieTemplate.bind(this));
};

exports.init = function() {
  lgr.info('initia');
  return new Model(arguments);
};

module.exports = exports;
