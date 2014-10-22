/** @module */
var dhr = require('../vmg-helpers/dom');

var turnPopup = function(popupName) {
  var targetElems = dhr.getElems('.' + popupName);
  if (dhr.isElems(targetElems, ':visible')) {
    dhr.hideElems(targetElems, 'fast');
  } else {
    dhr.showElems(targetElems, 'fast');
  }
};

var hidePopupByEscape = function(popupName, e) {
  if (e.keyCode === 27) {
    dhr.hideElems('.' + popupName, 'fast');
  }
};

var hidePopupIfOut = function(popupName, e) {
  if (e.currentTarget === e.target.parentElement) {
    dhr.hideElems('.' + popupName, 'fast');
  }
};

exports.addEvents = function(next) {
  var cls = {
    menuCall: 'menu-call',
    menuPopup: 'menu-popup',
    menuViewClose: 'menu-view__close',
    notifWrapClose: 'notif-wrap__close',
    notif: 'notif-wrap__notif'
  };

  var elemMenuCall = dhr.getElem('.' + cls.menuCall);
  dhr.on(elemMenuCall, 'click', turnPopup.bind(null, cls.menuPopup));

  dhr.on(this.doc.body, 'keyup', hidePopupByEscape.bind(null, cls.menuPopup));
  var elemMenuPopup = dhr.getElem('.' + cls.menuPopup);
  dhr.on(elemMenuPopup, 'click', hidePopupIfOut.bind(null, cls.menuPopup));

  var elemClose = dhr.getElem('.' + cls.menuViewClose);
  dhr.on(elemClose, 'click', turnPopup.bind(null, cls.menuPopup));

  var elemNotifWrapClose = dhr.getElem('.' + cls.notifWrapClose);
  dhr.on(elemNotifWrapClose, 'click', turnPopup.bind(null, cls.notif));

  next();
};

module.exports = exports;
