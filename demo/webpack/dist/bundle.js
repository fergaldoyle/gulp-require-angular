/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***********************************************!*\
  !*** ./src/gulp-require-angular.generated.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./app.js */ 1);
	__webpack_require__(/*! ./moduleA/moduleA.js */ 2);
	__webpack_require__(/*! ./common/piechart.js */ 3);
	__webpack_require__(/*! ./moduleB/moduleB.js */ 5);
	__webpack_require__(/*! ./moduleA/moduleA.ctrl.js */ 6);
	__webpack_require__(/*! ./moduleB/moduleB.ctrl.js */ 7);

/***/ },
/* 1 */
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	angular.module('myApp', ['moduleA', 'moduleB'])

	.config(function () {
		// stuff
	})

	.run(function () {
		// stuff
	});

/***/ },
/* 2 */
/*!********************************!*\
  !*** ./src/moduleA/moduleA.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	angular.module('moduleA', ['pieChart'])

	.config(function () {
		// stuff
	})

	.run(function () {
		// stuff
	});

/***/ },
/* 3 */
/*!********************************!*\
  !*** ./src/common/piechart.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	var nonAngularPieChart = __webpack_require__(/*! ./nonAngularPieChart */ 4);

	angular.module('pieChart', []).directive('pieChart', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var options = scope.$eval(attrs.chartOptions);
				nonAngularPieChart(element, options); 
			}
		};
	});

/***/ },
/* 4 */
/*!******************************************!*\
  !*** ./src/common/nonAngularPieChart.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	// some pre-existing charting library
	module.exports = function (el, options) {

	};

/***/ },
/* 5 */
/*!********************************!*\
  !*** ./src/moduleB/moduleB.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	angular.module('moduleB', [])

	.config(function () {
		// stuff
	})

	.run(function () {
		// stuff
	});

/***/ },
/* 6 */
/*!*************************************!*\
  !*** ./src/moduleA/moduleA.ctrl.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	angular.module('moduleA').controller(function ($scope) {
		// stuff
	});

/***/ },
/* 7 */
/*!*************************************!*\
  !*** ./src/moduleB/moduleB.ctrl.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	angular.module('moduleB').controller(function ($scope) {
		// stuff
	});

/***/ }
/******/ ])