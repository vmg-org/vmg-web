/** @module upload/vwjs */
'use strict';

var dhr = require('../vmg-helpers/dom');
var config = require('../vmg-helpers/config');
// helper to work with AWS S3
var s3h = require('../vmg-helpers/s3h');

/**
 * Check limits and start upload
 */
var showFile = function(file, uplVideoContent, uplPlayer, uplSelector) {
  console.log(file.size / 1024);
  console.log(file.name);
  console.log(file.type);

  dhr.hideElems('.' + uplSelector);

  var s3upload = new s3h.S3Upload({
    s3_sign_put_url: config.API_ENDPOINT + 'w2002',
    onProgress: function(percent, message) {
      console.log('Upload progress: ' + percent + '% ' + message);
    },
    onFinishS3Put: function(public_url) {
      console.log('Successfully uploaded to <a href="' + public_url + '">' + public_url + '</a>');
      var videoElem = dhr.getElem('.' + uplVideoContent);
      videoElem.src = public_url;
      dhr.showElems('.' + uplPlayer);
    },
    onError: function(status) {
      alert('error: ' + status);
      //      console.log(status);
    }
  });

  s3upload.run([file]);

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
