/** @module */
'use strict';

var mdlWorkspace = require('./workspace');
window.app = mdlWorkspace.init(window.document, 'window.app');
window.app.start();
