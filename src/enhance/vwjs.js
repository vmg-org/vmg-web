/**
 * @module
 */
'use strict';

var jobOutputChecker = require('./job-output-checker');
var jobCutService = require('../vmg-services/job-cut');

/**
 * Handle converted media file
 *     from job_output
 */
var handleMediaFile = function(err, mediaFile) {
  if (err) {
    // TODO: #33! show notif about error - job recreate here??
    alert(err.message);
    return;
  }

  console.log('mediaFile', mediaFile);
};

var hanlePostJobCut = function(err, jobCut) {
  if (err) {
    // TODO: #34! send notif about error    
    alert(err.message);
    return;
  }

  // after posting - retry with progress bar
  console.log(err, jobCut);
};

exports.run = function(app, bem, idOfMediaSpec) {
  console.log('idOfMediaSpec', idOfMediaSpec);

  app.checkJob = jobOutputChecker.run.bind(null, idOfMediaSpec, handleMediaFile);

  // TODO: #33! Is this job depends of DOM?
  app.checkJob();

  // allow this event only full video download
  // TODO: #43! Or append this event dinamically after vide downloading
  app.cutVideo = function(elem) {
    console.log(elem);
    var jobCut = {
      id_of_media_spec: idOfMediaSpec,
      cutting_start: 4400, //ms - get from elem
      cuttion_stop: 19400 //ms
    };

    // send it to the server
    jobCutService.postItem(jobCut, hanlePostJobCut);
  };
};

module.exports = exports;
