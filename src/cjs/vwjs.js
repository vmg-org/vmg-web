/** @module viewjs-helper */

var jsvw = require('./jsvw');

exports.run = function() {
  $('.menu-view__close').on('click', jsvw.hideMenuPopup);
  $('.menu-call__full-icon').on('click', jsvw.showMenuPopup);
  $('.menu-popup').on('click', function(e) {
    if (e.currentTarget === e.target) {
      jsvw.hideMenuPopup();
    }
  });
};

module.exports = exports;
