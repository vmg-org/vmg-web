// todo #33! js docs
//* @todo #44! If a user wants to change order of episodes

var ehr = require('./ehr');

var mdlWorkspace = require('./workspace');

window.app = mdlWorkspace.init('window.app');
$.extend(window.app, ehr);
window.app.startFlow();
