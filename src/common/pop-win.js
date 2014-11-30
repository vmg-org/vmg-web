/**
 * Module
 */

var dhr = require('../vmg-helpers/dom');
var ahr = require('../vmg-helpers/app');
var hbrs = require('../vmg-helpers/hbrs');

/**
 * Base class for all popups: varA2, varB1
 *    varA1: few popup windows can exist at one moment
 *          need different indexes and a system to change order
 *    varA2: only one popup window can exist at one moment
 *          one index per all window, close prev window, if opened a new one
 *    varB1: all windows destroyed when closed
 *          js side stores templates for all window, created very quickly from current state
 *    varB2: windows are not destroyed (just hided)
 *           if a state is changed - wrong data
 * @constructor
 */
var Mdl = function(tmplPopup, clsPopupScope, zpath) {

  this.zpath = zpath;

  /** 
   * Element, wrapped all popups
   */
  this.elemWrap = dhr.getElem('.' + clsPopupScope);

  /**
   * Whether the current popup is showed
   * @type {Boolean}
   */
  this.isShow = false;

  /**
   * Compiled template for popup
   */
  this.markupPopup = hbrs.compile(tmplPopup);

  this.fnc_hide_popup = this.zpath + '.hidePopup()';
  this.fnc_hide_popup_if_out = this.zpath + '.hidePopupIfOut(this, event)';
};

Mdl.prototype.redraw = function() {
  if (this.isShow) {
    var curHtml = this.markupPopup(this);
    dhr.html(this.elemWrap, curHtml);
  } else {
    dhr.html(this.elemWrap, '');
  }
};

Mdl.prototype.hidePopup = function() {
  this.isShow = false;
  this.redraw();
};

Mdl.prototype.showPopup = function() {
  this.isShow = true;
  this.redraw();
};

/**
 * When click-out of popup-space
 */
Mdl.prototype.hidePopupIfOut = function(elem, e){
  if (e.currentTarget === e.target) { //.parentElement) {
    this.hidePopup();
  }
};

exports.inhProps = function(cntx, arrArgs){
 Mdl.apply(cntx, arrArgs);
};

exports.inhMethods = function(cntx){
 ahr.inherits(cntx, Mdl);
};

exports.init = function(){
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;
