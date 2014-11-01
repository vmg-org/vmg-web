/** 
 * Root viewmodel for this page
 * @module
 */
'use strict';

var pblWorkspace = require('../common/workspace');
var ahr = require('../vmg-helpers/app');
var bem = require('../../../vmg-bem/bems/index.bemjson');
var vwmHelper = require('./vwm');
var cls = require('./cls');

var Mdl = function(zpath) {
  pblWorkspace.apply(this, [cls]);
  this.zpath = zpath;
  this.bem = bem;
  this.movieRecords = null;
  this.movieRecordsErr = null;
};

ahr.inherits(Mdl, pblWorkspace);

Mdl.prototype.authFlowSelector = function() {
  if (this.userSession) {
    this.userSession.showAuth(this.last);
  } else {
    // show message and apply events and login buttons with authFlow
    this.waitUserLogin(function() {
      window.location.reload();
    });
  }
};

Mdl.prototype.startFlow = function() {
  var appFlow =
    vwmHelper.loadMovieRecords.bind(this,
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
