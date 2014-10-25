gulp-require-angular
=========================

[![Build Status](https://travis-ci.org/fergaldoyle/gulp-require-angular.svg?branch=master)](https://travis-ci.org/fergaldoyle/gulp-require-angular)

`npm install gulp-require-angular --save-dev`

### What
A gulp plugin which scans your AngularJS project  source files and generates a single js file full of `require()` statements which can be then used as an entry file for Browserify or Webpack. Only AngularJS modules which appear in the dependency tree of your `mainModule` are `require()`'d. Supports modules installed with bower too.

### Why
So that the majority of your code base will be automatically `require()`'d in the correct order while still enabling you use `require()` where you want.

### How

See [demos for working examples](https://github.com/fergaldoyle/gulp-require-angular/tree/master/demo).

Write your app using standard AngularJS syntax. e.g.

app.js
```javascript
angular.module('myApp', ['moduleA']);
```	
moduleA/moduleA.js
```javascript
angular.module('moduleA', []);
```	
moduleA/moduleA.ctrl.js
```javascript
angular.module('moduleA').controller('abc',function ($scope) {
});
```

Use the plugin as part of your gulp task
```javascript
var gulp = require('gulp');
var requireAngular = require('gulp-require-angular');

gulp.task('requireAngular', function () {
	gulp.src(['src/**/*.js'])
        .pipe(requireAngular('myApp'))
        .pipe(gulp.dest('src/'))
});
```
The above will generate a file named (by default) `gulp-require-angular.generated.js` which will contain:
```javascript
require('./app.js');
require('./moduleA/moduleA.js');
require('./moduleA/moduleA.ctrl.js');
```
You then use `gulp-require-angular.generated.js` as the entry file for Browserify or Webpack.  The benefit of this is that all your Angular is automatically required, while you can still use `require()` inside your controllers / services / directives to pull in non angular modules / templates / css depending on your Browserify transforms / Webpack loaders. 
e.g. you might have a charting directive that uses an existing a non angular charting library. One of the cleanest ways to pull in that external library dependency is to `require()` it:
```javascript	
var nonAngularPieChart = require('./nonAngularPieChart');

angular.module('pieChart', []).directive('pieChart', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var options = scope.$eval(attrs.chartOptions);
			nonAngularPieChart(element, options);
		}
	};
});
```

### Usage
The plugin will only find modules if `angular.module` is used. If you alias the variable `angular` or have modules in minifed code, e.g.  `a.module`, it will not be found. You must use unminified versions of third party modules like ui-router, ngResource etc in your project src.

####The function
```javascript
requireAngular('mainModule', options);
```
####mainModule
mainModule is the name of the module entry point used to calculate the module dependency tree. This is your top level module, and is going to be the same module name found in `ng-app`.

####options
Object with the following default properties
```javascript
{		
	filename: 'gulp-require-angular.generated.js',
	rebase: './',
	relativeTo: './src',
	bower: false,
	errorOnMissingModules: false
}
```
#####filename
The name of the generated .js file.

#####rebase
The base path to apply to all require statements.

#####relativeTo
What directory will the require statements be relative to.

#####bower
To look for bower installed packages or not. If `true`, `bower.json` must be present. Will only look for bower packages with are installed, i.e. listed as dependencies in `bower.json`.

#####errorOnMissingModules
When a module appears in the dependency tree, but cannot be found in a file, emit an error or not.


