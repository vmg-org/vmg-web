var mdlWorkspace = require('./workspace');

// https://github.com/mailru/FileAPI
window.FileAPI = {
  staticPath: './libs/file-api/',
  cors: true
};

window.app = mdlWorkspace.init('window.app');
window.app.startFlow();
