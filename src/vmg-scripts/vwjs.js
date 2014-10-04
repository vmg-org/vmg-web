/** @module viewjs-helper */

var jsvw = require('../vmg-scripts/jsvw');
var dhr = require('../vmg-helpers/dom');

exports.run = function() {
  dhr.on('.menu-view__close', 'click', jsvw.hideMenuPopup);
  dhr.on('.menu-call__full-icon', 'click', jsvw.showMenuPopup);
  dhr.on('.menu-popup', 'click', function(e) {
    if (e.currentTarget === e.target) {
      jsvw.hideMenuPopup();
    }
  });
  dhr.on(document, 'keyup', function(e) {
    if (e.keyCode === 27) {
      jsvw.hideMenuPopup();
    }
  });

  var googBtnClass = '.auth-no__auth-button_social_goog';

  // add event during showing element -> if an user is not auth, or after logoff event (one time)
  dhr.on(googBtnClass, 'click', function() {
    dhr.alert('hello');
    console.log(this);
  });
};

module.exports = exports;
