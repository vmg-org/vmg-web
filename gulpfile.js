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
var exec = require('child_process').exec;
var gulpExec = require('gulp-exec');
//var http = require('http');
var minifyCss = require('gulp-minify-css');
//var rename = require('gulp-rename');
var bemLayoutHtml = require('./bem-layout-task');
var translator = require('./translator-task');
var concat = require('gulp-concat');
var mkdirp = require('mkdirp');
var gulpGhPages = require('gulp-gh-pages');
var gitLog = require('git-log');
var pth = require('./gulp-paths');
var uglify = require('gulp-uglify');
var dict = require('vmg-dict').getLocale('en');
// for dst - change 'browserify_js' to 'uglify' (it is included)
gulp.task('build', ['layout', 'handle_css', 'copy_fonts', 'copy_libs', 'copy_img', 'browserify_js'], function() {
  // copy to dst or dev

  // handle all files
});

gulp.task('clean', function(next) {
  del([pth.dst + '**/*'], next);
});

var cssLayout = pth.vws.layout + 'layout.css';

gulp.task('handle_css', ['css_index', 'css_watch', 'css_template'], function() {
  // concat and minify
});

gulp.task('css_index', function() {
  return gulp.src([cssLayout, pth.vws.index + 'index.css'])
    .pipe(concat('index-bundle.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(pth.dst + 'css/'));
});

gulp.task('css_watch', function() {
  return gulp.src([cssLayout, pth.vws.watch + 'watch.css'])
    .pipe(concat('watch-bundle.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(pth.dst + 'css/'));
});
gulp.task('css_template', function() {
  return gulp.src([cssLayout, pth.vws.template + 'template.css'])
    .pipe(concat('template-bundle.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(pth.dst + 'css/'));
});

gulp.task('copy_fonts', function() {
  return gulp.src([pth.fonts + '**/*'])
    .pipe(gulp.dest(pth.dst + 'css/fonts/'));
});

gulp.task('copy_img', function() {
  return gulp.src(pth.images + '**/*')
    .pipe(gulp.dest(pth.dst + 'css/img/'));
});

gulp.task('copy_libs', function() {
  return gulp.src([
      pth.libs.jquery,
      pth.libs.modernizr
    ])
    .pipe(gulp.dest(pth.dst + 'static/libs/'));
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
  return gulp.src(['./*.js', pth.scripts])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(notify(jshintNotify));

  // If error pop up a notify alert
  //    .on('error', notify.onError(function(error) {
  //    return error.message;
  // }));
});

gulp.task('mkdir-js', function(cb) {
  mkdirp(pth.dst + 'js/', cb);
});

gulp.task('browserify_index', ['jshint', 'mkdir-js'], function() {
  var srcFile = pth.src + 'cjs/main.js';
  var bundleFile = pth.dst + 'js/index-bundle.js';
  var shellCommand = 'browserify ' + srcFile +
    ' -o ' + bundleFile +
    ' --exclude ' + pth.libs.modernizr +
    ' --exclude ' + pth.libs.jquery;

  return gulp.src(srcFile)
    .pipe(gulpExec(shellCommand))
    .on('error', notify.onError(function(err) {
      return err.message;
    }));
  //.pipe(gulpExec.reporter())
  //.pipe(notify(function(status) {
  //}));
  //exec(shellCommand, function(err) {
  //if (err) {
  // notify(err.message);
  //}
  // done();
  //});
});

gulp.task('browserify_js', ['browserify_index'], function() {

});


gulp.task('layout', ['jshint'], function() {
  var layoutFilePath = pth.vws.layout + 'layout.html';
  return gulp.src([pth.vws.index + 'index.html', pth.vws.watch + 'watch.html', pth.vws.template + 'template.html'])
    .pipe(bemLayoutHtml.run(layoutFilePath))
    .pipe(translator.run(dict))
    .pipe(gulp.dest(pth.dst));
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
  //  gulp.watch(pth.scripts, ['browserify_js'], notifyLiveReload);
  gulp.watch(pth.dst + '**/*', notifyLiveReload);
});

gulp.task('watch_js', function() {
  gulp.watch(pth.scripts, ['browserify_js']);
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
