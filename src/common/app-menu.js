/**
 * Module for app-menu (NOT USED NOW)
 *    divided from root as separate model
 */

var dhr = require('../vmg-helpers/dom');

/**
 * Menu viewmodel
 * @constructor
 */
var Mdl = function(data, root, zpath){
  this.root = root;
  this.zpath = zpath;
  /**
  * Header of menu
  *     for example: list of apps, list of menu items etc.
  * @type {String}
  */
  this.lbl_name = 'Menu';
  
  /**
  * Whether the menu is active
  * @type {Boolean}
  */
  this.is_show = false;
  
  this.fnc_show_menu = this.zpath + '.showMenu()';
  this.fnc_hide_menu = this.zpath + '.hideMenu()';
  this.fnc_hide_menu_out = this.zpath + '.hideMenuIfOut()';

  this.markupAppMenu = this.root.markups.appMenu;

  /**
  * Items of a menu
  * @type {Array}
  */
  this.arr_item = [];
};

/**
 * Redraw a menu on a page
 *    when state is changed
 *    attach 'this' - only fresh settings
 */
Mdl.prototype.redraw = function(){
  var htmlMenu = this.markupAppMenu(this);
  dhr.html('.' + this.root.cls.popupScope, htmlMenu);
};

/**
 * Show a menu
 *    by user's click or at startup
 *    a popup window or a separate page
 */
Mdl.prototype.showMenu = function(){
  this.is_show = true;
  this.redraw();
};

/**
 * Hide a menu
 */
Mdl.prototype.hideMenu = function(){
  this.is_show = false;
  this.redraw();
};

/**
 * Create an instance
 */
exports.init = function(){
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;
