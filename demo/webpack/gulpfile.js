var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpWebpack = require('gulp-webpack');
var webpack = require('webpack');
var requireAngular = require('gulp-require-angular');

function logAndContinue(err) {
	gutil.log(err.toString());
}


// ################ Example using gulp-webpack plugin ################ //

// 'requireAngular-gulpWebpack' is a dependency 
// of the 'watch' task so will run to create an 
// inital build before any files are changed
gulp.task('watch', ['requireAngular-gulpWebpack'], function () {
	// make sure to ignore the generated js file
	gulp.watch([
		'src/**/*.js',
		'!src/gulp-require-angular.generated.js'
	], [
		'requireAngular-gulpWebpack'
	]);
});

gulp.task('requireAngular-gulpWebpack', function () {

	gulp.src(['src/**/*.js'])
        .pipe(requireAngular('myApp'))
        // file needs to physically exist for webpack
		// use gulp.dest to create it
        .pipe(gulp.dest('src/'))
        .pipe(gulpWebpack({
        	stats: { timings: true },
        	output: {
        		filename: 'bundle.js',
        		pathinfo: true
        	}
        }))
        .pipe(gulp.dest('dist/'));
});

// ################################################################### //





// ################ Example using webpack directly (faster incremental builds) ################ //

// 'requireAngular-webpack' is a dependency 
// of the 'watch' task so will run to create an 
// inital build before any files are changed
gulp.task('watch2', ['requireAngular-webpack'], function () {
	// make sure to ignore the generated js file
	gulp.watch([
		'src/**/*.js',
		'!src/gulp-require-angular.generated.js'
	], [
		'requireAngular-webpack',
		'someTaskAfterWebpack'
	]);
});

var compiler = webpack({
	entry: './src/gulp-require-angular.generated.js',
	output: {
		filename: 'dist/bundle.js',
		pathinfo: true
	}
});

gulp.task('requireAngular-webpack', function (cb) {
	gulp.src(['src/**/*.js'])
        .pipe(requireAngular('myApp'))
		.on('error', logAndContinue) // don't break watch on error
        .pipe(gulp.dest('src/'))
		.on('end', function () {
			// run the webpack compiler - will do fast incremental builds
			compiler.run(function (err, stats) {
				gutil.log(stats.toString({
					colors: true,
					hash: false,
					chunks: false
				}));
				// must callback to let gulp know when this task is finished
				cb();
			});

		});
});

gulp.task('someTaskAfterWebpack', ['requireAngular-webpack'], function () {
	console.log('running someTaskAfterWebpack');
});

// ############################################################################################ //

gulp.task('default', [
	'watch',
	//'watch2'
]);