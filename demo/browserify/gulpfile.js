var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var requireAngular = require('gulp-require-angular');

function log(err) {
	gutil.log(err.toString());
}

// globs for watch and requireAngular
// ignore generated files to avoid
// unnessesary watch callbacks and require recursion
var jsFiles = [
	'src/**/*.js',
	'!src/gulp-require-angular.generated.js',
	'!src/bundle.js'
];

// watch for changes, run browserify. browserify is 
// a dependency of watch so will run an inital time
// before any watch callbacks.
gulp.task('watch', ['browserify'], function () {
	gulp.watch(jsFiles, ['browserify']);
});

// requireAngular task uses a done callback to let
// other tasks know when it's finished
gulp.task('requireAngular', function (done) {
	gulp.src(jsFiles)
        .pipe(requireAngular('myApp'))
		.on('error', log)
        .pipe(gulp.dest('src/'))
		.on('end', function () {
			done();
		});
});

// the browserify task, will only run once requireAngular is finished
// and has generated the entry point.
gulp.task('browserify', ['requireAngular'], function () {
	return browserify('./src/gulp-require-angular.generated.js')
	.bundle()
	//Pass desired output filename to vinyl-source-stream
	.pipe(source('bundle.js'))
	// Start piping stream to tasks!
	.pipe(gulp.dest('./build/'));
});

gulp.task('default', [
	'watch'
]);