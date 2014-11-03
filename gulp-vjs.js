/** 
 * Copy vjs files tasks
 * @module
 */
'use strict';

exports.run = function(gulp, pth) {
  gulp.task('copy_fonts', function(){
    return gulp.src([pth.vjs.fonts])
      .pipe(gulp.dest(pth.dst + 'css/font/'));
  });

  gulp.task('copy_css', function(){
    return gulp.src([pth.vjs.css])
      .pipe(gulp.dest(pth.dst + 'css/'));
  });


  gulp.task('copy_langs', function(){
    return gulp.src([pth.vjs.langs])
      .pipe(gulp.dest(pth.dst + 'lang/'));
  });

  gulp.task('copy_vjs', ['copy_langs', 'copy_css', 'copy_fonts'], function() {
    return gulp.src([pth.vjs.js, pth.vjs.flash])
      .pipe(gulp.dest(pth.dst + 'libs/'));
  });
};

module.exports = exports;
