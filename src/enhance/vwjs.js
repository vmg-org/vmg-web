/**
 * @module
 */
'use strict';

var jobOutputChecker = require('./job-output-checker');

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

exports.run = function(app, bem, idOfMediaSpec) {
  console.log('idOfMediaSpec', idOfMediaSpec);

  app.checkJob = jobOutputChecker.run.bind(null, idOfMediaSpec, handleMediaFile);

  // TODO: #33! Is this job depends of DOM?
  app.checkJob();
};

module.exports = exports;
