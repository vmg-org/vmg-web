/** @module upload/vwjs */
'use strict';
var demoSid = 'qwer';
var dhr = require('../vmg-helpers/dom');
var config = require('../vmg-helpers/config');
// helper to work with AWS S3
var s3h = require('../vmg-helpers/s3h');

var handleFinishUpload = function(uplVideoContent, uplPlayer, jobSource) {
  var publicUrl = jobSource.url_to_read;
  console.log('Successfully uploaded to <a href="' + publicUrl + '">' + publicUrl + '</a>');
  var videoElem = dhr.getElem('.' + uplVideoContent);
  videoElem.src = publicUrl;
  dhr.showElems('.' + uplPlayer);

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
var showFile = function(file, uplVideoContent, uplPlayer, uplSelector) {
  console.log(file.size / 1024);
  console.log(file.name);
  console.log(file.type);

  dhr.hideElems('.' + uplSelector);

  var s3upload = new s3h.S3Upload({
    s3_sign_put_url: config.API_ENDPOINT + 'w2003?sid=' + demoSid,
    onProgress: function(percent, message) {
      console.log('Upload progress: ' + percent + '% ' + message);
    },
    onFinishS3Put: handleFinishUpload.bind(null, uplVideoContent, uplPlayer),
    onError: function(status) {
      alert('error: ' + status);
    }
  });

  var jobSource = {
    id_of_media_spec: 987668264,
    id_of_container_format: file.type,
    url_to_upload: null,
    url_to_read: null
  };

  s3upload.run([file], jobSource);

  // Create a bid media, media_spec, media_owner
  //  var bidMedia = {
  //    "id_of_episode_bid": 5555,
  //    "id_of_media_spec": null,
  //    "moder_rating": 0, // 0 - not checked yet
  //    "media_spec_item": {
  //      "id": null,
  //      "name": null, // from episode name or empty
  //      "created": null, //autogen
  //      "preview_img_url": null, // later
  //      "is_ready": false
  //        //      "job_source_item": { // as a second request - If some error - during upload - recreate only job_source_item
  //        //        "id_of_container_format": file.type
  //        //          // some null data
  //        //      }
  //    }
  //  };

  // POST job_source_item
  // {
  //  id_of_media_spec: 1234,
  //  id_of_container_format: file.type
  // }
  //
  // RETURN 
  //   url_to_upload
  //   status: 'Started'

  // Client sends PUT : upl_to_upload
  // RETURN: err or success
  //
  // GET: job_source?id=id
  // Server checks a file in a cloud, get media info, add file_source and media_file (media_streams etc)
  // Use job_id from ET as file name
  // For output: job_id + preset_id
  // If no: return status = false
  // If true: return job_source + file_source + media_file

  //  var bidMedia = {
  //    "id_of_episode_bid": 5555,
  //    "id_of_media_spec": null,
  //    "moder_rating": 0, // 0 - not checked yet
  //    "media_spec_item": {
  //      "id": null,
  //      "name": null, // from episode name or empty
  //      "created": null, //autogen
  //      "preview_img_url": null, // later
  //      "is_ready": false,
  //      "media_file_arr": [{
  //        "id": null,
  //        "id_of_media_spec": null,
  //        "id_of_container_format": file.type, // required
  //        "url": null,
  //        "url_to_upload": null,
  //        "size": null,
  //        "duration": null,
  //        "progress_creation": null,
  //        "progress_cutting": null,
  //        "cutting_start": null,
  //        "cutting_stop": null,
  //        "is_original": true // required
  //      }, {
  //        id_of_container_format: 'video/mp4',
  //        is_original: false
  //      }, {
  //        id_of_container_format: 'video/webm',
  //        is_original: false
  //      }]
  //    }
  //  };


  //  var asdf = window.URL.createObjectURL(file);
  //
  //  videoElem.addEventListener('loadeddata', function() {
  //    console.log('onload fired');
  //    window.URL.revokeObjectURL(this.src);
  //    console.log('duration', this.duration);
  //    // Video is loaded and can be played
  //  }, false);
  //
  //  videoElem.src = asdf;
  //
  //  console.log(videoElem);
  //  console.log('duration', videoElem.duration);
  //
  //  dhr.showElems('.' + uplPlayer);
};
// bem - second
exports.run = function(app) {
  app.fireFileSelector = function(elem, e, fileSelectorName) {
    console.log('fire', fileSelectorName);
    dhr.trigger('.' + fileSelectorName, 'click');
  };

  app.handleUpload = function(elem) {
    console.log(elem.files);
    var uplPlayer = elem.getAttribute('data-player');
    var uplVideoContent = elem.getAttribute('data-video-content');
    var uplSelector = elem.getAttribute('data-selector');

    showFile(elem.files[0], uplVideoContent, uplPlayer, uplSelector);
  };

  app.handleDropFile = function(elem, e) {
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;
    console.log(files);

    //  'data-player': 'upl-player', // show it
    //  'data-video-content': 'upl-player__video-content', // add src
    //  'data-selector': 'upl-selector' // hide it			 
    var uplPlayer = elem.getAttribute('data-player');
    var uplVideoContent = elem.getAttribute('data-video-content');
    var uplSelector = elem.getAttribute('data-selector');

    showFile(files[0], uplVideoContent, uplPlayer, uplSelector);
  };

  app.handleDragEnterFile = function(elem, e) {
    e.stopPropagation();
    e.preventDefault();
    //    console.log(elem, e);
  };

  app.handleDragOverFile = function(elem, e) {
    e.stopPropagation();
    e.preventDefault();
    //    console.log(elem, e);
  };
};

module.exports = exports;
// var bidMedia = {
//   "id_of_episode_bid": 5555,
//   "id_of_media_spec": null,
//   //    "id_of_user_profile": 123456789, // get from auth (demo) // attach to media
//   "moder_rating": 0, // 0 - not checked yet
//   "media_spec_item": {
//     "id": null,
//     "name": null, // from episode name or empty
//     "created": null, //autogen
//     "preview_img_url": null, // later
//     "is_ready": false,
//     "media_file_arr": [{
//       "id": null,
//       "id_of_media_spec": null,
//       "id_of_container_format": file.type, // required
//       "url": null,
//       "url_to_upload": null,
//       "size": null,
//       "duration": null,
//       "progress_creation": null,
//       "progress_cutting": null,
//       "cutting_start": null,
//       "cutting_stop": null,
//       "is_original": true // required
//     }]
//   }
// };
