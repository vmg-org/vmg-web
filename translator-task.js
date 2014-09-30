/**
 * Translate, using some dict
 * @module
 * @todo #42! for not uppercase cases
 */

'use strict';

var through2 = require('through2');

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.run = function(dict) {
  return through2.obj(function(file, enc, cbk) {

    var rgx = /%=[a-zA-Z0-9_/-]+=%/g;
    var data = file._contents.toString('utf8');
    //    console.log(data.match(rgx));

    var arr = data.match(rgx);

    arr.forEach(function(item) {
      var key = dict[item.substr(2, item.length - 4)];
      // if word in dictionary
      if (key) {
        data = data.replace(item, capitaliseFirstLetter(key));
      } else {
        console.log('no word in dict ' + item);
      }
    });

    file.contents = new Buffer(data);
    this.push(file);
    cbk();
  });
};

module.exports = exports;
