/** 
 * Root viewmodel for this page
 * @module
 * @todo: #43! remove bem dependency
 */
'use strict';

var pblWorkspace = require('../common/workspace');
var ahr = require('../vmg-helpers/app');
var bem = require('../../../vmg-bem/bems/explore.bemjson');
var vwmHelper = require('./vwm');
var cls = require('./cls');
var lgr = require('../vmg-helpers/lgr');
var srv = require('../vmg-services/srv');
var mdlMovieRecord = require('./movie-record');
var markups = {};

var Mdl = function(zpath) {
  pblWorkspace.apply(this, [cls, markups, zpath]);
  this.bem = bem;
  this.movieRecords = null;
  this.movieRecordsErr = null;
};

ahr.inherits(Mdl, pblWorkspace);

Mdl.prototype.mapMovieRecord = function(itemData){
  return mdlMovieRecord.init(itemData, this);
};

Mdl.prototype.cbkWelcomeMovieRecords = function(next, err, data) {
  if (err) {
    this.movieRecordsErr = err;
    next();
    lgr.info(this.movieRecordsErr);
    return;
  }
  console.log('mr', data);
  this.movieRecords = data.map(this.mapMovieRecord.bind(this));
  next();
};

Mdl.prototype.loadWelcomeMovieRecords = function(next) {
  // r1017
  srv.r1017(this.cbkWelcomeMovieRecords.bind(this, next));
};

Mdl.prototype.authFlowSelector = function() {
  if (this.userSession) {
    this.userSession.showAuth(this.last);
  } else {
    // show message and apply events and login buttons with authFlow
    this.waitUserLogin();
  }
};

Mdl.prototype.startFlow = function() {
  var appFlow =
    this.loadWelcomeMovieRecords.bind(this,
      vwmHelper.loadMovieTemplates.bind(this,
        this.waitDocReady.bind(this,
          this.addEvents.bind(this,
            vwmHelper.fillMovieRecords.bind(this,
              vwmHelper.fillMovieTemplates.bind(this,
                this.loadSid.bind(this,
                  // two flows - auth=yes and auth=no
                  this.handleSid.bind(this,
                    this.authFlowSelector.bind(this)
                  ))))))));

  appFlow();
};

exports.init = function(zpath) {
  return new Mdl(zpath);
};

module.exports = exports;
