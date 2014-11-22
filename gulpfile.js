/** 
 * Gulp tasks
 * @todo #23! Create a separate page for ready bids: canceled, approved etc
 *            With a movie player to watch my episodes
 * @todo #42! add a most popular jquery dns link instead local (on production)
 * @todo #44! add tap for dragging files on mobile devices
 * @todo: #33! Cutting may be used later, if user have a cut error
 *        Besides cutting, may be addtnal filters: processing instead cutting or enhance (like in Yt)
 *        After uploading: start an output job and redirect to Enhance page (while the job is in process - An user download a page)
 *        If an error of cutting - re-create the job (or re-upload the file)
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

var gulpVjs = require('./gulp-vjs');
gulpVjs.run(gulp, pth); //import tasks for video js

// add new pages only here
var pages = ['index', 'explore', 'upload', 'watch', 'template', 'template-editor', 'enhance', 'cabinet'];

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

//var LR_PORT = 35729;
//var lr;
//
//function startLiveReload() {
//  lr = require('tiny-lr')();
//  lr.listen(LR_PORT);
//}

function startExpress() {
  var express = require('express');
  var app = express();
  //  app.use(require('connect-livereload')({
  //    port: LR_PORT
  //      //	  ignore: ['js', 'svg']
  //  }));
  app.use(express.static(pth.dst));
  app.listen(4000);
  console.log('http://localhost:4000');
}

//function notifyLiveReload(e) {
//  // `gulp.watch()` events provide an absolute path
//  // so we need to make it relative to the server root
//  var fileName = require('path').relative(pth.dst, e.path);
//
//  lr.changed({
//    body: {
//      files: [fileName]
//    }
//  });
//}

// =============== TASK DECLARATION ===============================
// for dst - change 'bwf' to 'uglify' (it is included)
gulp.task('build', ['copy_markup', 'copy_libs', 'copy_vjs', 'jshint', 'bwf'], function() {});

// This is a separate task, don't clean for every build - just replace
// Clean a dst folder, if there are unrequired files
gulp.task('clean', function(cbk) {
  del([pth.dst + '**/*'], cbk);
});

// Create this folder after full clean - it is required for browserify
gulp.task('mkdir_js', function(cbk) {
  mkdirp(pth.dst + 'js/', cbk);
});

gulp.task('copy_markup', function() {
  return gulp.src(pth.markup + '**/*')
    .pipe(gulp.dest(pth.dst));
});


gulp.task('copy_libs', function() {
  return gulp.src([
      pth.libs.jquery,
      pth.libs.modernizr
    ])
    .pipe(gulp.dest(pth.dst + 'libs/'));
});

gulp.task('jshint', function() {
  return gulp.src(['./*.js', pth.src + '**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(notify(jshintNotify));
});

pages.forEach(function(pge) {
  gulp.task('bwf_' + pge, ['jshint'], function() {
    return runBwf(pth.src + pge + '/run.js', pth.dst + 'js/' + pge + '-bundle.js');
  });
});

gulp.task('bwf', pages.map(function(pge) {
  return 'bwf_' + pge;
}));

gulp.task('connect', function() {
  //  startLiveReload();
  startExpress();
  //gulp.watch(pth.dst + '**/*', notifyLiveReload);
});

// Watch only scripts
gulp.task('watch', function() {
  gulp.watch(pth.src + '**/*.js', ['bwf']);
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
  var logFilePath = 'doc/log-201410.log';
  var afterDate = new Date(2014, 9, 1); //new Date(Date.now() - (1000 * 60 * 60 * 24));
  var beforeDate = new Date(2014, 10, 4);

  var shellCommand = 'git log ' + gitLog.generateArgs(afterDate, beforeDate, tmpFilePath).join(' ');
  console.log(shellCommand);

  exec(shellCommand, function(err) {
    if (err) {
      return done(err);
    }

    gitLog.createLog(tmpFilePath, logFilePath, done);
  });
});
