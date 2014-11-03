var mdlWorkspace = require('./workspace');

window.videojs.options.flash.swf = './libs/video-js.swf';
// https://github.com/mailru/FileAPI
window.FileAPI = {
  staticPath: './libs/file-api/',
  cors: true
};

window.app = mdlWorkspace.init('window.app');
window.app.startFlow();
