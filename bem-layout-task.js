/** @module */
var through2 = require('through2');
var fs = require('fs');

var getBlockData = function(fileData) {

  var strBegin = '<body class="page">';
  var strEnd = '</body>'

  var indStart = fileData.indexOf(strBegin) + strBegin.length;
  var indEnd = fileData.indexOf(strEnd);
  //  console.log(indStart, indEnd);
  return fileData.substr(indStart, indEnd - indStart);
};

var getNameFromPath = function(filePath) {
  //console.log(file.history); // [ '/home/ivanrave/gvmg/vmg-bem/desktop.bundles/index/index.html' ]
  var arr = filePath.split('/');
  return arr[arr.length - 1];
};

var cbkReadLayout = function(file, enc, cb, err, layoutData) {
  if (err) {
    throw err;
  }

  var fileData = file._contents.toString('utf8'); // content of a file in utf8 (from buffer)
  // get page content
  //  console.log(fileData);

  var blockData = getBlockData(fileData);
  //  console.log(blockData);

  // add main js file for this page
  var elemName = getNameFromPath(file.history[0]).replace('.html', '');

  // add bundle to block data (script)
  //
  //  blockData += '<script src="./js/' + elemName + '-bundle.js"></script>';
  var strToChange = '%%%%%';

  var readyData = layoutData.replace(strToChange, blockData);
  // replace css style

  readyData = readyData.replace('layout.css', './css/' + elemName + '-bundle.css');
  readyData = readyData.replace('page-bundle.js', './js/' + elemName + '-bundle.js');

  // title of a page - no need - it localized string - replaces during gulp-l10n
  //  console.log(readyData);

  file.contents = new Buffer(readyData);

  // context of pushing
  this.push(file);
  cb();
};

function run(layoutFilePath) {
  return through2.obj(function(file, enc, cb) {
    //console.log(file.history); // [ '/home/ivanrave/gvmg/vmg-bem/desktop.bundles/index/index.html' ]
    //console.log(file.cwd); // /home/ivanrave/gvmg/vmg-web
    //console.log(file.base); // /home/ivanrave/gvmg/vmg-bem/desktop.bundles/index/
    //console.log(file.stat);  // file stat
    fs.readFile(layoutFilePath, 'utf8', cbkReadLayout.bind(this, file, enc, cb));
  });
};

exports.run = run;

module.exports = exports;
