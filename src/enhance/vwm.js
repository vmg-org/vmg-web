/**
 * @module
 */

var dhr = require('../vmg-helpers/dom');
//var lgr = require('../vmg-helpers/lgr');
//var srv = require('../vmg-services/srv');
var ahr = require('../vmg-helpers/app');
var workspace = require('./workspace');

exports.waitDocReady = function(next) {
  $(this.doc).ready(next);
};
exports.loadIdOfMediaSpec = function(next) {
  var mParam = ahr.getQueryParam('m');
  mParam = ahr.toInt(mParam);

  if (!mParam) {
    alert('No param in url: ?m=123 as integer');
    return;
  }

  this.idOfMediaSpec = mParam;
  next();
};

exports.runMachine = function() {
  var esc = {
    notif: dhr.getElem('.' + this.cls.notif),
    loader: dhr.getElem('.' + this.cls.loader),
    player: dhr.getElem('.' + this.cls.player),
    slider: dhr.getElem('.' + this.cls.slider),
    fncCut: dhr.getElem('.' + this.cls.fncCut),
    inpStart: dhr.getElem('.' + this.cls.inpStart),
    inpStop: dhr.getElem('.' + this.cls.inpStop)
  };

  var wsp = workspace.init(esc, this.idOfMediaSpec);
  wsp.getBidInfo();
};

module.exports = exports;
