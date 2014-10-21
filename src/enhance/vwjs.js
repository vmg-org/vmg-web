/**
 * @module
 */
'use strict';

var dhr = require('../vmg-helpers/dom');
var workspace = require('./workspace');

exports.run = function(app, bem, idOfMediaSpec) {
  app.initData = function(elem, e, clsLoader, clsPlayer, clsSlider, clsFncCut, clsInpStart, clsInpStop, clsNotif) {
    var esc = {
      notif: dhr.getElem('.' + clsNotif),
      loader: dhr.getElem('.' + clsLoader),
      player: dhr.getElem('.' + clsPlayer),
      slider: dhr.getElem('.' + clsSlider),
      fncCut: dhr.getElem('.' + clsFncCut),
      inpStart: dhr.getElem('.' + clsInpStart),
      inpStop: dhr.getElem('.' + clsInpStop)
    };

    var wsp = workspace.init(esc, idOfMediaSpec);
    wsp.getBidInfo();
  };
};

module.exports = exports;
