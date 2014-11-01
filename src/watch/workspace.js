/** 
 * Root viewmodel for this page
 * @module
 */
'use strict';

var pblWorkspace = require('../common/workspace');
var ahr = require('../vmg-helpers/app');
var cls = require('./cls');
var bem = require('../../../vmg-bem/bems/watch.bemjson');
var fllHelper = require('./fll');

var Mdl = function(zpath) {
  pblWorkspace.apply(this, [cls]);
  this.zpath = zpath;
  this.bem = bem;
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
    this.waitDocReady.bind(this,
      fllHelper.fillMovie.bind(this,
        this.addEvents.bind(this,
          fllHelper.fillComments.bind(this,
            fllHelper.updateCommentsByInterval.bind(this,
              this.loadSid.bind(this,
                // two flows - auth=yes and auth=no
                this.handleSid.bind(this,
                  this.authFlowSelector.bind(this)
                )))))));

  appFlow();

};

exports.init = function(zpath) {
  return new Mdl(zpath);
};

module.exports = exports;
