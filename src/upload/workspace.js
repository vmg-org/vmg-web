/** @module */

//var dhr = require('../vmg-helpers/dom');
//var ahr = require('../vmg-helpers/app');

var Wsp = function(esc, idOfMediaSpec) {
  this.esc = esc;
  this.idOfMediaSpec = idOfMediaSpec;
};

exports.init = function() {
  // add methods
  var obj = Object.create(Wsp.prototype);
  // add props
  Wsp.apply(obj, arguments);
  // return created object
  return obj;
  //  return new Wsp.bind(this, arguments);
};

module.exports = exports;
