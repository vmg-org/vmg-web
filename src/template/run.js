/** @module */
'use strict';

window.videojs.options.flash.swf = './libs/video-js.swf';

var mdlWorkspace = require('./workspace');
window.app = mdlWorkspace.init('window.app');
window.app.start();
