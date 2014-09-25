/** Gulp tasks */

var gulp = require('gulp');
// This will keeps pipes working after error event
//var plumber = require('gulp-plumber');
var del = require('del');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var notify = require('gulp-notify');
var exec = require('child_process').exec;
//var map = require('map-stream');
//var events = require('events');
//var emmitter = new events.EventEmitter();
var gulpExec = require('gulp-exec');
var http = require('http');
var sass = require('gulp-ruby-sass');
   var autoprefixer = require('gulp-autoprefixer');
var    minifycss = require('gulp-minify-css');
   var  rename = require('gulp-rename');


// dev path contains unminified bundle js (for speed and debug with comments) and unminified css files 
// and dev urls to other resources
var paths = {
  dst: 'dev', // or dst (dist, release, bin ...) for release
  src: 'src'
};

// only js files (no directories)
paths.scripts = ['src/cjs/**/*.js'];

gulp.task('default', ['copy_html', 'browserify'], function() {
  // copy to dst

  // handle all files
});

gulp.task('clean', function(next) {
  del([paths.dst], next);
});

gulp.task('copy_html', ['clean'], function() {
  return gulp.src(paths.src + '/index.html')
    .pipe(gulp.dest(paths.dst + '/'));
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
  return gulp.src(paths.scripts)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(notify(jshintNotify));

  // If error pop up a notify alert
  //    .on('error', notify.onError(function(error) {
  //    return error.message;
  // }));
});

gulp.task('browserify', ['jshint'], function() {
  var bundlePath = paths.dst + '/bundle.js';
  var shellCommand = 'browserify ' + paths.src + '/cjs/main.js -o ' + bundlePath;

  gulp.src('./src/cjs/main.js')
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

gulp.task('connect', function() {
  var express = require('express');
  var app = express();
  app.use(express.static(paths.dst));
  app.listen(4000);
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['browserify']);
});
