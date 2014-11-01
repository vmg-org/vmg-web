/** 
 * Root viewmodel for this page
 * @module
 */
'use strict';

var pblWorkspace = require('../common/workspace');
var ahr = require('../vmg-helpers/app');
var cls = require('./cls');

var Mdl = function(zpath) {
  pblWorkspace.apply(this, [cls]);
  this.zpath = zpath;
};

ahr.inherits(Mdl, pblWorkspace);

exports.init = function(zpath) {
  return new Mdl(zpath);
};

module.exports = exports;
