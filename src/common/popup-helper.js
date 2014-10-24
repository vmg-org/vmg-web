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
  var elemMenuCall = dhr.getElem('.' + this.cls.menuCall);
  dhr.on(elemMenuCall, 'click', turnPopup.bind(null, this.cls.menuPopup));

  dhr.on(this.doc.body, 'keyup', hidePopupByEscape.bind(null, this.cls.menuPopup));
  var elemMenuPopup = dhr.getElem('.' + this.cls.menuPopup);
  dhr.on(elemMenuPopup, 'click', hidePopupIfOut.bind(null, this.cls.menuPopup));

  var elemClose = dhr.getElem('.' + this.cls.menuViewClose);
  dhr.on(elemClose, 'click', turnPopup.bind(null, this.cls.menuPopup));

  var elemNotifWrapClose = dhr.getElem('.' + this.cls.notifWrapClose);
  dhr.on(elemNotifWrapClose, 'click', turnPopup.bind(null, this.cls.notif));

  next();
};

module.exports = exports;
