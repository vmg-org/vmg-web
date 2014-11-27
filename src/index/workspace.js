/** 
 * Root viewmodel for this page
 * @module
 */
'use strict';

var pblWorkspace = require('../common/workspace');
var ahr = require('../vmg-helpers/app');
var bem = require('../../../vmg-bem/bems/index.bemjson');
var cls = require('./cls');
var markups = {};

var Mdl = function(zpath) {
  pblWorkspace.apply(this, [cls, markups, zpath]);
  this.bem = bem;
};

ahr.inherits(Mdl, pblWorkspace);

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
    this.waitDocReady.bind(this,
      this.addEvents.bind(this,
        this.loadSid.bind(this,
          // two flows - auth=yes and auth=no
          this.handleSid.bind(this,
            this.authFlowSelector.bind(this)
          ))));

  appFlow();
};

exports.init = function(zpath) {
  return new Mdl(zpath);
};

module.exports = exports;
