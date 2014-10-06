/** @module viewjs-helper */

var dhr = require('../vmg-helpers/dom');

exports.run = function(app) {
  app.turnPopup = function(elem, popupName) {
    var targetElems = dhr.getElems('.' + popupName);
    if (dhr.isElems(targetElems, ':visible')) {
      dhr.hideElems(targetElems, 'fast');
    } else {
      dhr.showElems(targetElems, 'fast');
    }
  };

  app.hidePopupByEscape = function(elem, e, popupName) {
    if (e.keyCode === 27) {
      dhr.hideElems('.' + popupName, 'fast');
    }
  };

  app.hidePopupIfOut = function(elem, e, popupName) {
    if (e.currentTarget === e.target.parentElement) {
      dhr.hideElems('.' + popupName, 'fast');
    }
  };

  var googBtnClass = '.auth-no__auth-button_social_goog';

  // add event during showing element -> if an user is not auth, or after logoff event (one time)
  dhr.on(googBtnClass, 'click', function() {
    dhr.alert('hello');
    console.log(this);
  });
};

module.exports = exports;
