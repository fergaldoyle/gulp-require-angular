gulp-require-angular with webpack
=================================

Shows how to use gulp-require-angular in sequence with gulp-wepack (and standalone webpack). Demonstrates a directive (pieChart) pulling in some non angular code using require()

Using standalone webpack will give faster incremental builds but is more complex.

###Notes
* `webpack` expects an actual file and not a stream so must use `gulp.dest()` to write the entry file before passing to `gulp-webpack`
* You will want `gulp.watch()` to ignore the generated js file to prevent double callbacks
