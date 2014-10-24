var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var gulp = require('gulp');

gulp.task('lint', function () {
	return gulp.src(['index.js', 'gulpfile.js', 'test/main.js', 'demo/**/gulpfile.js'])
		.pipe(jshint({node: true, esnext: true}))
		.pipe(jshint.reporter(stylish))
		.pipe(jshint.reporter('fail'));
});

gulp.task('default', ['lint']);