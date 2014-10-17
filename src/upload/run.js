//var indexBem = require('../../bower_components/vmg-bem/bems/upload.bemjson');
var bem = require('../../../vmg-bem/bems/upload.bemjson');
//
var commonVwjs = require('../vmg-helpers/vwjs.js');
var vwjs = require('./vwjs');

// https://github.com/mailru/FileAPI
window.FileAPI = {
  staticPath: './libs/file-api/',
  cors: true
};

window.app = {};
//
commonVwjs.run(window.app, bem);
vwjs.run(window.app, bem);
