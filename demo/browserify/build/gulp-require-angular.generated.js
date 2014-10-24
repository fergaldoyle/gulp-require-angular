(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('myApp', ['moduleA', 'moduleB'])

.config(function () {
	// stuff
})
 
.run(function () {
	// stuff
});
},{}],2:[function(require,module,exports){
// some pre-existing charting library
module.exports = function (el, options) {

};
},{}],3:[function(require,module,exports){
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
},{"./nonAngularPieChart":2}],4:[function(require,module,exports){
require('./app.js');
require('./moduleA/moduleA.js');
require('./common/piechart.js');
require('./moduleB/moduleB.js');
require('./moduleA/moduleA.ctrl.js');
require('./moduleB/moduleB.ctrl.js');
},{"./app.js":1,"./common/piechart.js":3,"./moduleA/moduleA.ctrl.js":5,"./moduleA/moduleA.js":6,"./moduleB/moduleB.ctrl.js":7,"./moduleB/moduleB.js":8}],5:[function(require,module,exports){
angular.module('moduleA').controller(function ($scope) {
	// stuff
});
},{}],6:[function(require,module,exports){
angular.module('moduleA', ['pieChart'])

.config(function () {
	// stuff
})

.run(function () {
	// stuff
});
},{}],7:[function(require,module,exports){
angular.module('moduleB').controller(function ($scope) {
	// stuff
});
},{}],8:[function(require,module,exports){
angular.module('moduleB', [])

.config(function () {
	// stuff
})

.run(function () {
	// stuff
});
},{}]},{},[4])