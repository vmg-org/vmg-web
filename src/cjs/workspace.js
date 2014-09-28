/** @module workspace */
'use strict';

var movieTemplateService = require('./movie-template/service');
var authIssuerService = require('./auth-issuer/service');
var lgr = require('./lgr');

// Create an object with ready data or load data after initialization */
var Model = function() {
  /** Whether the user auth already */
  this.isUserAuthorized = null;

  /** Auth providers */
  this.listOfAuthIssuer = [];

  /** Movie templates, scenarios */
  this.listOfMovieTemplate = [];
};

Model.prototype.checkIsUserAuthorized = function(){
  // when the user login to main page /welcome
  // load first public elems movie-templates and movie-records
  // then check is user auth
  //
  // in protected pages - need redirect to welcome if not authorized
  // dont show content if not auth
  //
  // public pages: about, welcome, contacts, best-movies, best-templates etc.
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
