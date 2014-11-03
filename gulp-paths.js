/** 
 * Paths for gulp tasks
 *     to change paths you don't need to go to logic
 * @module gulp-paths */

var pth = {};

pth.src = './src/'; // or dst (dist, release, bin ...) for release
pth.dst = './dst/';

pth.bowerLibs = './bower_components/';

//pth.markup = pth.bowerLibs + 'vmg-bem/dst/';

// todo: #41! change paths to bower_component (fot non-local development)
pth.markup = '../vmg-bem/dst/';

// dev path contains unminified bundle js (for speed and debug with comments) and unminified css files 
// and dev urls to other resources

pth.libs = {
  jquery: pth.bowerLibs + 'jquery/dist/jquery.js',
  modernizr: pth.bowerLibs + 'modernizr/modernizr.js'
};

var vjsRoot = pth.bowerLibs + 'video.js/dist/video-js/';

pth.vjs = {
  js: vjsRoot + 'video.js',
  css: vjsRoot + 'video-js.min.css',
  flash: vjsRoot + 'video-js.swf',
  fonts: vjsRoot + 'font/*.*',
  langs: vjsRoot + 'lang/*.js'
};

exports = pth;

module.exports = exports;
