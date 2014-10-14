/** @module upload/vwjs */
'use strict';
var demoSid = 'qwer';
var dhr = require('../vmg-helpers/dom');
var config = require('../vmg-helpers/config');
// helper to work with AWS S3
var s3h = require('../vmg-helpers/s3h');

var handleFinishUpload = function(uplVideoContent, uplPlayer, bidMedia) {
  var publicUrl = bidMedia.media_spec_item.media_file_arr[0].url;
  console.log('Successfully uploaded to <a href="' + publicUrl + '">' + publicUrl + '</a>');
  var videoElem = dhr.getElem('.' + uplVideoContent);
  videoElem.src = publicUrl;
  dhr.showElems('.' + uplPlayer);

  // add mp4 (standad) and webm (2) to media_file_arr and send back as PUT request
  // server send a job to ET to convert initial file
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
    s3_sign_put_url: config.API_ENDPOINT + 'w2002?sid=' + demoSid,
    onProgress: function(percent, message) {
      console.log('Upload progress: ' + percent + '% ' + message);
    },
    onFinishS3Put: handleFinishUpload.bind(null, uplVideoContent, uplPlayer),
    onError: function(status) {
      alert('error: ' + status);
    }
  });

  var bidMedia = {
    "id_of_episode_bid": 5555,
    "id_of_media_spec": null,
    "moder_rating": 0, // 0 - not checked yet
    "media_spec_item": {
      "id": null,
      "name": null, // from episode name or empty
      "created": null, //autogen
      "preview_img_url": null, // later
      "is_ready": false,
      "media_file_arr": [{
        "id": null,
        "id_of_media_spec": null,
        "id_of_container_format": file.type, // required
        "url": null,
        "url_to_upload": null,
        "size": null,
        "duration": null,
        "progress_creation": null,
        "progress_cutting": null,
        "cutting_start": null,
        "cutting_stop": null,
        "is_original": true // required
      }]
    }
  };

  s3upload.run([file], bidMedia);

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
