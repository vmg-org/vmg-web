/** 
 * Root viewmodel for this page
 * @module
 * @todo: #33! Add notification with upload limits: duration > 15, 30 second, < 1 min
 * @todo: #43! Touch events for mobile devices for drag and drop feature
 */
'use strict';

var pblWorkspace = require('../common/workspace');
var ahr = require('../vmg-helpers/app');
var bem = require('../../../vmg-bem/bems/upload.bemjson');
var vwm = require('./vwm');
var cls = require('./cls');

var Mdl = function(zpath) {
  pblWorkspace.apply(this, [cls]);
  this.zpath = zpath;
  this.bem = bem;
  this.idOfMediaSpec = null;
};

ahr.inherits(Mdl, pblWorkspace);

Mdl.prototype.authFlowSelector = function() {
  if (this.userSession) {
    this.userSession.showAuth(this.last);

    var afterAuthFlow =
      vwm.attachUploadEvents.bind(this,
        vwm.attachSelectorEvents.bind(this,
          this.last));

    afterAuthFlow();
  } else {
    // show message and apply events and login buttons with authFlow
    var authNoFlow =
      this.showNoAuthWarning.bind(this,
        this.waitUserLogin.bind(this,
          this.reloadPage.bind(this)
        ));

    authNoFlow();
  }
};


Mdl.prototype.startFlow = function() {
  // load a movie details
  var appFlow =
    vwm.loadIdOfMediaSpec.bind(this,
      this.loadSid.bind(this,
        this.handleSid.bind(this,
          this.waitDocReady.bind(this,
            this.addEvents.bind(this,
              // two flows - auth=yes and auth=no
              this.authFlowSelector.bind(this)
            )))));

  appFlow();

};

exports.init = function(zpath) {
  return new Mdl(zpath);
};

module.exports = exports;
