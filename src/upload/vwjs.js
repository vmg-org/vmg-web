/** @module upload/vwjs */
'use strict';
var fileUploader = require('./file-uploader');
var dhr = require('../vmg-helpers/dom');

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

    fileUploader.run(elem.files[0], uplVideoContent, uplPlayer, uplSelector);
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

    fileUploader.run(files[0], uplVideoContent, uplPlayer, uplSelector);
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
