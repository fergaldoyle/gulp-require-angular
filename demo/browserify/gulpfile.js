var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var requireAngular = require('gulp-require-angular');

function logAndContinue(err) {
	gutil.log(err.toString());
}

// 'requireAngular-browserify' is a dependency 
// of the 'watch' task so will run to create an 
// inital build before any files are changed
gulp.task('watch', ['requireAngular-browserify'], function () {
	// make sure to ignore the generated js file
	gulp.watch([
		'src/**/*.js',
		'!src/gulp-require-angular.generated.js'
	], [
		'requireAngular-browserify'
	]);
});

gulp.task('requireAngular-browserify', function () {
	gulp.src(['src/**/*.js'])
        .pipe(requireAngular('myApp'))
        .pipe(browserify())
        .pipe(gulp.dest('build/'));
});

gulp.task('default', [
	'watch'
]);