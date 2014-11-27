/** 
 * Root viewmodel for this page
 * @module
 * @todo: #33! Add notification with upload limits: duration > 15, 30 second, < 1 min
 * @todo: #43! Touch events for mobile devices for drag and drop feature
 * @todo: #42! check accept-types in file-input, to check only video
 */
'use strict';

var pblWorkspace = require('../common/workspace');
var ahr = require('../vmg-helpers/app');
var bem = require('../../../vmg-bem/bems/upload.bemjson');
var cls = require('./cls');
var markups = {};
var fileHandler = require('./file-handler');
var dhr = require('../vmg-helpers/dom');
var jobSourceChecker = require('./job-source-checker');
var srv = require('../vmg-services/srv');

var Mdl = function(zpath) {
  pblWorkspace.apply(this, [cls, markups, zpath]);

  // required for common auth models
  this.bem = bem;
  this.idOfMediaSpec = null;
  this.episodeBid = null;
};

ahr.inherits(Mdl, pblWorkspace);

Mdl.prototype.handleLoadEpisodeBid = function(err, episodeBid) {
  if (err) {
    alert(err.message || 'server error');
    return;
  }

  // If already exists this job - redirect to cabinet
  if (episodeBid.media_spec_item.job_source_item) {
    this.doc.location.href = './cabinet.html';
    return;
  }

  // TODO: #33! Show bid info in panel
};

/** Get info with movie info, media_spec and all jobs*/
Mdl.prototype.loadEpisodeBid = function() {
  srv.r1008(this.idOfMediaSpec, this.handleLoadEpisodeBid.bind(this));
};

Mdl.prototype.attachSelectorEvents = function(next) {
  var cls = this.cls;
  var elemOpener = dhr.getElem('.' + this.cls.opener);
  // when click on opener - fire click on input
  dhr.on(elemOpener, 'click', function() {
    dhr.trigger('.' + cls.selectorInput, 'click');
  });

  dhr.showElems('.' + this.cls.selector);

  next();
};

/**
 * Handle output job
 * @param {Object} jobOutput - A job is created (for conversion a source file to outputs)
 */
var handleJob = function(elemLoader, err, jobOutput) {
  if (err) {
    console.log('error', err);
    return alert(err.message);
  }

  console.log('handleJob', jobOutput);
  window.location.replace('./enhance.html?m=' + jobOutput.id_of_media_spec);
};

var handleResultOfUpload = function(elemSelector, elemLoader, elemNotif, err, jobSource) {
  if (err) {
    dhr.html(elemNotif, err.message);
    dhr.showElems(elemNotif);
    // show again to choose another file
    dhr.hideElems(elemLoader);
    dhr.showElems(elemSelector);
    // TODO: #34! handle this error: update a page for user, try again with remove previous job_source in some cases?
    return;
  }

  dhr.html(elemLoader, 'verification of an uploaded file...');
  jobSourceChecker.run(jobSource, handleJob.bind(null, elemLoader));
};

// To show max duration - need to get BidInfo
// Limit by filesize: 15s - 50MB 30s- 100MB
// Event to select of dnd files
Mdl.prototype.attachUploadEvents = function(next) {
  var idOfMediaSpec = this.idOfMediaSpec;

  if (!idOfMediaSpec) {
    throw new Error('no idOfMediaSpec');
  }

  var elemSelector = dhr.getElem('.' + this.cls.selector);
  var elemSelectorInput = dhr.getElem('.' + this.cls.selectorInput);
  var elemLoader = dhr.getElem('.' + this.cls.loader);
  var elemNotif = dhr.getElem('.' + this.cls.notif);

  window.FileAPI.event.on(elemSelectorInput, 'change', function(evt) {
    var files = window.FileAPI.getFiles(evt); // Retrieve file list
    dhr.hideElems(elemSelector);
    dhr.showElems(elemLoader);
    fileHandler.run(files, elemLoader, idOfMediaSpec, handleResultOfUpload.bind(null, elemSelector, elemLoader, elemNotif));
  });

  window.FileAPI.event.dnd(elemSelector, function(over) {
    elemSelector.style.backgroundColor = over ? '#ffb' : '';
  }, function(files) {
    dhr.hideElems(elemSelector);
    dhr.showElems(elemLoader);
    fileHandler.run(files, elemLoader, idOfMediaSpec, handleResultOfUpload.bind(null, elemSelector, elemLoader, elemNotif));
  });

  next();
};

Mdl.prototype.loadIdOfMediaSpec = function(next) {
  var mParam = ahr.getQueryParam('m');
  mParam = ahr.toInt(mParam);

  if (!mParam) {
    alert('No param in url: ?m=123 as integer');
    return;
  }

  this.idOfMediaSpec = mParam;
  next();
};

Mdl.prototype.authFlowSelector = function() {
  if (this.userSession) {
    this.userSession.showAuth(this.last);
    this.loadEpisodeBid();
    var afterAuthFlow =
      this.attachUploadEvents.bind(this,
        this.attachSelectorEvents.bind(this,
          this.last));

    afterAuthFlow();
  } else {
    // show message and apply events and login buttons with authFlow
    var authNoFlow =
      this.showNoAuthWarning.bind(this,
        this.waitUserLogin.bind(this));

    authNoFlow();
  }
};

Mdl.prototype.startFlow = function() {
  // load a movie details
  var appFlow =
    this.loadIdOfMediaSpec.bind(this,
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
