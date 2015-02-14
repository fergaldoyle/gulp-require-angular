'use strict';
var esprima = require('esprima');
var estraverse = require('estraverse');

function isAngular(node) {
    return node.type === 'MemberExpression' && node.object.name === 'angular' && node.property.name === 'module';
}

function pushDistinct(array, item) {
	if (array.indexOf(item) === -1) {
		array.push(item);
	}
	return array;
}

// Find module definitions and the dependencies of those modules
// Find module references
function parse(source) {

	var moduleDefinitions = {},
		moduleReferences = [];

    estraverse.traverse(esprima.parse(source), {
        leave: function (node, parent) {
			
			if(!isAngular(node)) {
				return;
			}
			
            //console.log('node:', JSON.stringify(node, null, 3));
            //console.log('parent:', JSON.stringify(parent, null, 3));
			
			var moduleName = parent.arguments[0].value;
			
			// if a second argument exists
			// this is a module definition
			if(parent.arguments[1]) {
				if(parent.arguments[1].type === 'ArrayExpression') {
					moduleDefinitions[moduleName] = parent.arguments[1].elements.map(function(item){
						return item['value'];
					});
				} else {
					throw 'Argument must be an ArrayExpression, not a variable';
				}
			} else {
				// is a module reference
				pushDistinct(moduleReferences, moduleName);
			}
					          
        }
    });
		
	return {
		modules: moduleDefinitions,
		references: moduleReferences
	}	
}

module.exports = parse;