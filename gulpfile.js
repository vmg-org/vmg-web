var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var paths = {
  dst: 'dst',
  src: 'src'
};

paths.scripts = ['src/js/main.js'];

gulp.task('default', function() {

});

gulp.task('clean', function(next) {
  del([paths.dst], next);
});

gulp.task('jshint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['jshint']);
});
