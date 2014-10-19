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