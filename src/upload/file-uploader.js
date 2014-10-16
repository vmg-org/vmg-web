/** @module */
'use strict';
var demoSid = 'qwer';

var dhr = require('../vmg-helpers/dom');
var config = require('../vmg-helpers/config');
var s3h = require('../vmg-helpers/s3h');
var jobSourceChecker = require('./job-source-checker');

var handleJob = function(uplVideoContent, uplPlayer, err, mediaFile) {
  if (err) {
    console.log('error', err);
    return alert(err.message);
  }
  var videoElem = dhr.getElem('.' + uplVideoContent);
  videoElem.src = mediaFile.url;
  dhr.showElems('.' + uplPlayer);
};

var handleFinishUpload = function(uplVideoContent, uplPlayer, jobSource) {
  jobSourceChecker.run(jobSource, handleJob.bind(null, uplVideoContent, uplPlayer));
  var publicUrl = jobSource.url_to_read;
  console.log('Successfully uploaded to <a href="' + publicUrl + '">' + publicUrl + '</a>');

  // GET: job_source?id=id
  // Server checks a file in a cloud, get media info, add file_source and media_file (media_streams etc)
  // For output: job_id + preset_id
  // If no: return status = false
  // If true: return job_source + file_source + media_file

  // if file_source_item exists (and media_file_item) that success
  // else 'not uploaded' (retry it)
  // Server get info from cloud, insert source_file and media file
  // and return it

  // var jobOutput = {
  // id_of_media_spec: jobSource.id_of_media_spec,
  // id: null
  // };

  //  POST jobOutput
  // Server check auth by id_of_media_spec
  // Server retrieves file_source with media_file with url - This url - INPUT
  // Add standard OUTPUTS (now mp4 only)
  // Start the job
  // Return jobOutput with status 'Started' or simply without file_outputs
  //
  // GET jobOutput (some interval)
  // when success job_output: {
  //  file_output_arr: [{asdf}]

  // add mp4 (standad) and webm (2) to media_file_arr and send back as PUT request
  // server send a job to ET to convert initial file
  //
  // store jobs in db?
  // attach job to media_spec
  //
  // To create output files, we need generate ids for them - create empty media_files during bid_media creation
};

/**
 * Check limits and start upload
 */
exports.run = function(file, uplVideoContent, uplPlayer, uplSelector) {
  dhr.hideElems('.' + uplSelector);

  var s3upload = new s3h.S3Upload({
    s3_sign_put_url: config.API_ENDPOINT + 'w2003?sid=' + demoSid,
    onProgress: function(percent, message) {
      console.log('Upload progress: ' + percent + '% ' + message);
    },
    onFinishS3Put: handleFinishUpload.bind(null, uplVideoContent, uplPlayer),
    onError: function(stat) {

      // second param - undefined
      //      console.log(stat, errObj);
      alert('error: ' + stat);
    }
  });

  var demoIdOfMediaSpec = parseInt(window.location.hash.substr(1));
  var jobSource = {
    id_of_media_spec: demoIdOfMediaSpec, // TODO: #43! change in production
    id_of_container_format: file.type,
    url_to_upload: null,
    url_to_read: null
  };

  s3upload.run([file], jobSource);
};

module.exports = exports;

//  var asdf = window.URL.createObjectURL(file);
//  videoElem.addEventListener('loadeddata', function() {
//    console.log('onload fired');
//    window.URL.revokeObjectURL(this.src);
//    console.log('duration', this.duration);
//    // Video is loaded and can be played
//  }, false);
//  videoElem.src = asdf;
//  dhr.showElems('.' + uplPlayer);
