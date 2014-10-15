var es = require('event-stream');
var ngDep = require('ng-dependencies');
var extend = require('extend');
var gutil = require('gulp-util');
var Buffer = require('buffer').Buffer;
var PluginError = gutil.PluginError;
var File = gutil.File;

const PLUGIN_NAME = 'gulp-require-angular';
const ANGULAR_MODULE = 'ng';

/* ### dot.js template: ###
{{~it :v}}
require('{{=v}}');\n
{{~}}
*/
function template(it) { var out = ''; var arr1 = it; if (arr1) { var v, i1 = -1, l1 = arr1.length - 1; while (i1 < l1) { v = arr1[i1 += 1]; out += 'require(\'' + (v) + '\');\n'; } } return out; }

function findRequiredModules(allModules, mainModule) {
	// recursive function, dive into the dependencies
	function dive(name) {
		// check if this module has already been 
		// processed in case of circular dependency
		if (dive[name]) {
			return;
		}
		dive[name] = true;
		dive.required.push(name);

		var deps = allModules[name] || [];
		deps.forEach(function (item) {
			dive(item);
		});
	}
	dive.required = [];
	dive(mainModule);
	return dive.required;
}

function pushDistinct(array, item) {
	if (array.indexOf(item) === -1) {
		array.push(item);
	}
	return array;
}

module.exports = function (mainModule, opts) {
	if (!mainModule) throw new PluginError(PLUGIN_NAME, 'Missing mainModule argument');
	var files = [], allModules = {}, base,
		options = extend({
			filename: PLUGIN_NAME + '.js',
			base: './'
		}, opts);

	return es.through(function write(file) {
		if (file.isStream()) return this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
		var deps;
		try {
			deps = ngDep(file.contents);
		} catch (err) {
			return this.emit('error', new PluginError(PLUGIN_NAME, 'Error in parsing: "' + file.relative + '", ' + err.message));
		}

		// build up listing of all modules 
		extend(allModules, deps.modules);

		// build up listing of file paths and deps
		base = file.base;
		files.push({
			file: file.relative.replace(/\\/g, '/'),
			deps: deps
		});
	},
	function end() {
		var modules,
			defines = [],
			references = [],
			missing = [],
			finalSet;

		// return only modules are in the dependency tree of mainModule
		modules = findRequiredModules(allModules, mainModule);

		// for each module, find the file in which it is
		// defined, and any file in which it is referenced
		modules.forEach(function (module) {
			if (module === ANGULAR_MODULE) {
				return;
			}
			files.forEach(function (file) {

				// if this module does not appear as a
				// module definition in this file, then add
				// to missing and return
				if (!file.deps.modules[module]) {
					pushDistinct(missing, module);
				//	return;
				}

				if (file.deps.modules[module]) {
					pushDistinct(defines, './' + file.file);
				} else if (file.deps.dependencies.indexOf(module) > -1) {
					pushDistinct(references, './' + file.file);
				}
			});
		});

		// if a non existant mainModule is passed, defines will be empty
		if (!defines.length) {
			return this.emit('error', new PluginError(PLUGIN_NAME, 'Did not find any file where angular module \'' + mainModule + '\' is defined'));
		}

		// if any module cannot be found, it will be in missing
		if (missing.length) {
			return this.emit('error', new PluginError(PLUGIN_NAME, 'Could not find these modules:' + JSON.stringify(missing)));
		}

		// now have two arrays of distinct file paths, defines and references
		// create a final set of distinct file paths, with defines listed first
		finalSet = defines.slice();
		references.forEach(function (item) {
			pushDistinct(finalSet, item);
		});

		var file = new File();
		file.contents = new Buffer(template(finalSet));
		file.base = base;
		file.path = base + '/' + options.filename;

		this.emit('data', file);
		this.emit('end');
	});
};