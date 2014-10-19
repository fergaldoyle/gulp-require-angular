var gulp = require('gulp');
var requireAngular = require('gulp-require-angular');

gulp.task('requireAngular', function () {
	gulp.src(['src/**/*.js'])
        .pipe(requireAngular('myApp'))
        .pipe(gulp.dest('src/'))
});

gulp.task('default', [
    'requireAngular',
]);