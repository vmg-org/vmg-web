/** 
 * Gulp tasks
 * @todo #42! add a most popular jquery dns link instead local (on production)
 */

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
var exec = require('child_process').exec;
var gulpExec = require('gulp-exec');
//var http = require('http');
var mkdirp = require('mkdirp');
var gulpGhPages = require('gulp-gh-pages');
var gitLog = require('git-log');
var pth = require('./gulp-paths');
var uglify = require('gulp-uglify');

// for dst - change 'bwf_js' to 'uglify' (it is included)
gulp.task('build', ['clean', 'copy_markup', 'copy_libs', 'bwf_js'], function() {});

gulp.task('clean', function(next) {
  del([pth.dst + '**/*'], next);
});

gulp.task('copy_markup', ['clean'], function() {
  return gulp.src(pth.markup + '**/*')
    .pipe(gulp.dest(pth.dst));
});

gulp.task('copy_libs', ['clean'], function() {
  return gulp.src([
      pth.libs.jquery,
      pth.libs.modernizr
    ])
    .pipe(gulp.dest(pth.dst + 'libs/'));
});

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
  return gulp.src(['./*.js', pth.src + '**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(notify(jshintNotify));
});

gulp.task('mkdir_js', ['clean'], function(cb) {
  return mkdirp(pth.dst + 'js/', function() {
    cb();
  });
});

var cbkNotifyOnError = function(err) {
  return err.message;
};

var runBwf = function(srcFile, bundleFile) {
  var command = 'browserify <%= file.path %> -o ' + bundleFile +
    ' --exclude ' + pth.libs.modernizr +
    ' --exclude ' + pth.libs.jquery;

  return gulp.src(srcFile)
    .pipe(gulpExec(command))
    .on('error', notify.onError(cbkNotifyOnError));
};

gulp.task('pre_bwf', ['clean', 'jshint', 'mkdir_js']);

gulp.task('bwf_index', ['pre_bwf'], function() {
  return runBwf(pth.src + 'index/run.js', pth.dst + 'js/index-bundle.js');
});

gulp.task('bwf_watch', ['pre_bwf'], function() {
  return runBwf(pth.src + 'watch/run.js', pth.dst + 'js/watch-bundle.js');
});

gulp.task('bwf_js', ['bwf_index', 'bwf_watch']);

var LR_PORT = 35729;
var lr;

function startLiveReload() {
  lr = require('tiny-lr')();
  lr.listen(LR_PORT);
}

function startExpress() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({
    port: LR_PORT
      //	  ignore: ['js', 'svg']
  }));
  app.use(express.static(pth.dst));
  app.listen(4000);
  console.log('http://localhost:4000');
}

function notifyLiveReload(e) {
  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = require('path').relative(pth.dst, e.path);

  lr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('connect', function() {
  startLiveReload();
  startExpress();
  gulp.watch(pth.dst + '**/*', notifyLiveReload);
});

gulp.task('watch_js', function() {
  gulp.watch(pth.src + '**/*.js', ['bwf_js']);
});

gulp.task('uglify', function() {
  return gulp.src(pth.dst + 'js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(pth.dst + 'js/'));
});

gulp.task('deploy', ['uglify'], function() {
  gulp.src(pth.dst + '**/*')
    .pipe(gulpGhPages());
});

gulp.task('gitlog', function(done) {
  var tmpFilePath = 'doc/log-tmp.log';
  var logFilePath = 'doc/log-201409.log';
  var afterDate = new Date(2014, 8, 2); //new Date(Date.now() - (1000 * 60 * 60 * 24));
  var beforeDate = new Date(2014, 9, 1);

  var shellCommand = 'git log ' + gitLog.generateArgs(afterDate, beforeDate, tmpFilePath).join(' ');
  console.log(shellCommand);

  exec(shellCommand, function(err) {
    if (err) {
      return done(err);
    }

    gitLog.createLog(tmpFilePath, logFilePath, done);
  });
});
