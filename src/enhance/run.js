var mdlWorkspace = require('./workspace');
window.videojs.options.flash.swf = './libs/video-js.swf';

window.app = mdlWorkspace.init('window.app');
window.app.startFlow();
