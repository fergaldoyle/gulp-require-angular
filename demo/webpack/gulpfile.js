var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpWebpack = require('gulp-webpack');
var webpack = require('webpack');
var requireAngular = require('gulp-require-angular');

function logAndContinue(err) {
	gutil.log(err.toString());
}



// ################ Example using gulp-webpack plugin ################ //

gulp.task('watch', function () {
	// do it once
	gulp.start('requireAngularwithGulpWebpackPlugin');
	
	// then watch - make sure to ignore the generated js file
	gulp.watch(['src/**/*.js', '!src/gulp-require-angular.generated.js'], ['requireAngularwithGulpWebpackPlugin']);
});

gulp.task('requireAngularwithGulpWebpackPlugin', function () {

	gulp.src(['./src/**/*.js'])
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




// ################ Example using webpack directly (faster incremental builds) ################ //

gulp.task('watch2', function () {
	// do it once
	gulp.start('requireAngularWithManualWebpack');
	
	// then watch - make sure to ignore the generated js file
	gulp.watch(['src/**/*.js', '!src/gulp-require-angular.generated.js'], [
		'requireAngularWithManualWebpack', 
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

gulp.task('requireAngularWithManualWebpack', function (cb) {
	gulp.src(['./src/**/*.js'])
        .pipe(requireAngular('myApp'))
		.on('error', logAndContinue) // don't break watch on error
        .pipe(gulp.dest('src/'))
		.on('end', function (err, files) {
			compiler.run(function (err, stats) {
				gutil.log(stats.toString({
					colors: true,
					hash: false,
					chunks: false
				}));
				cb();
			});

		});
});

gulp.task('someTaskAfterWebpack', ['requireAngularWithManualWebpack'], function () {
	console.log('running someTaskAfterWebpack');
});


gulp.task('default', [
	//'watch',
	//'watch2'
]);