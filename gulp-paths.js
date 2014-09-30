/** 
 * Paths for gulp tasks
 *     to change paths you don't need to go to logic
 * @module gulp-paths */

var pth = {};

pth.src = './src/'; // or dst (dist, release, bin ...) for release
pth.dst = './dev/'
pth.fonts = '../vmg-bem/static/fonts/';
pth.images = '../vmg-bem/static/img/';
pth.bowerLibs = './bower_components/';
pth.scripts = pth.src + 'cjs/**/*.js';
// dev path contains unminified bundle js (for speed and debug with comments) and unminified css files 
// and dev urls to other resources

pth.libs = {
  jquery: pth.bowerLibs + 'jquery/dist/jquery.js',
  modernizr: pth.bowerLibs + 'modernizr/modernizr.js'
};

var vwsRoot = '../vmg-bem/desktop.bundles/';

pth.vws = {
  layout: vwsRoot + 'layout/',
  index: vwsRoot + 'index/',
  watch: vwsRoot + 'watch/'
};

exports = pth;

module.exports = exports;
