/** Gulp tasks */

var gulp = require('gulp');
// This will keeps pipes working after error event
//var plumber = require('gulp-plumber');
var del = require('del');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var notify = require('gulp-notify');
//var exec = require('child_process').exec;
//var map = require('map-stream');
//var events = require('events');
//var emmitter = new events.EventEmitter();
var gulpExec = require('gulp-exec');
//var http = require('http');
//var minifycss = require('gulp-minify-css');
//var rename = require('gulp-rename');
var bemLayoutHtml = require('bem-layout-html');

// dev path contains unminified bundle js (for speed and debug with comments) and unminified css files 
// and dev urls to other resources
var paths = {
  dst: 'dev/', // or dst (dist, release, bin ...) for release
  src: 'src/'
};

paths.rootView = '../vmg-bem/';
paths.indexView = paths.rootView + 'desktop.bundles/index/';
paths.layoutView = paths.rootView + 'desktop.bundles/layout/';
paths.fontsView = paths.rootView + 'fonts/';
paths.bowerLibs = 'bower_components/';

// only js files (no directories)
paths.scripts = paths.src + 'cjs/**/*.js';

paths.libs = {
  jquery: paths.bowerLibs + 'jquery/dist/jquery.js',
  modernizr: paths.bowerLibs + 'modernizr/modernizr.js'
};

gulp.task('default', ['copy_html', 'copy_fonts', 'copy_libs', 'browserify'], function() {
  // copy to dst

  // handle all files
});

gulp.task('clean', function(next) {
  del([paths.dst + '**/*'], next);
});

gulp.task('copy_html', function() {
  return gulp.src([
      paths.indexView + 'index.html',
      paths.indexView + 'index.css'
    ])
    .pipe(gulp.dest(paths.dst));
});

gulp.task('copy_fonts', function() {
  return gulp.src([paths.fontsView + '**/*'])
    .pipe(gulp.dest(paths.dst + 'fonts/'));
});

gulp.task('copy_libs', function() {
  return gulp.src([
      paths.libs.jquery,
      paths.libs.modernizr
    ])
    .pipe(gulp.dest(paths.dst + 'libs/'));
});

//var jsHintErrorReporter = map(function(file, cb) {
//  // console.log(file.jshint, file.path);
//  if (!file.jshint.success) {
//    file.jshint.results.forEach(function(err) {
//      if (err) {
//        var msg = [
//          path.basename(file.path),
//          'Line: ' + err.error.line,
//          'Reason: ' + err.error.reason
//        ];
//
//        // Emit this error event
//        //        emmitter.emit('error', new Error(msg.join('\n')));
//      }
//    });
//
//  }
//  cb(null, file);
//});

var jshintNotify = function(file) {
  if (file.jshint.success) {
    return false;
  }

  var errors = file.jshint.results.map(function(data) {
    if (data.error) {
      return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
    }
  }).join("\n");
  return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
};

gulp.task('jshint', function() {
  return gulp.src(['gulpfile.js', paths.scripts])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(notify(jshintNotify));

  // If error pop up a notify alert
  //    .on('error', notify.onError(function(error) {
  //    return error.message;
  // }));
});

gulp.task('browserify', ['jshint'], function() {
  var srcFile = paths.src + 'cjs/main.js';
  var bundleFile = paths.dst + 'index-bundle.js';
  var shellCommand = 'browserify ' + srcFile +
    ' -o ' + bundleFile +
    ' --exclude ' + paths.libs.modernizr +
    ' --exclude ' + paths.libs.jquery;

  gulp.src(srcFile)
    .pipe(gulpExec(shellCommand))
    .on('error', notify.onError(function(err) {
      return err.message;
    }));
  //    .pipe(gulpExec.reporter())
  //  .pipe(notify(function(status) {
  //  console.log('status', status);
  // }));
  //  exec(shellCommand, function(err) {
  //    if (err) {
  //      console.log(err);
  //      // notify(err.message);
  //      return;
  //    }
  //
  //    console.log('bros');
  //    done();
  //  });
});

gulp.task('layout', ['jshint'], function() {
  var layoutFilePath = paths.layoutView + 'layout.html';
  return gulp.src([paths.indexView + 'index.html', paths.indexView + 'index.css'])
    .pipe(bemLayoutHtml.run(layoutFilePath));
  // get text from layout html file
  // find elem "page__workspace" (to find elem need DOM lib, replace with some template strings)
  // get text from index (and other) html file
  // get content from "page" element
  // add a script to the bottom with format "index-bundle.js"
  // include instead "page_workspace"
  // change a title of result page
  // change a css of result page to "index.css"
  //
  // to create "index.css"
  // concat "layout.css" and "index.css"
  // during minification - remove same classes
});

gulp.task('connect', function() {
  var express = require('express');
  var app = express();
  app.use(express.static(paths.dst));
  app.listen(4000);
  console.log('http://localhost:4000');
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['browserify']);
});
