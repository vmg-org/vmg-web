/**
 * Init model with auth issuer
 */
var hbrs = require('../vmg-helpers/hbrs');

var Mdl = function(dto, root) {
  this.root = root;
  this.id = dto.id;

  this.markupAuthButton = hbrs.compile(this.root.markups.authButton);
  this.calcProps();
};

Mdl.prototype.calcProps = function() {
  switch (this.id) {
    case 'goog':
      this.icon_key = 'c';
      break;
    case 'fb':
      this.icon_key = 'b';
      break;
    case 'dev':
      this.icon_key = 'i';
      break;
  }

  this.loggin_with = 'Logging with'; // plus name of provider, if needed (or icons not loaded)
};

exports.init = function(dto, root) {
  return new Mdl(dto, root);
};

module.exports = exports;
