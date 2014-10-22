var es = require('event-stream');
var ngDep = require('ng-dependencies');
var extend = require('extend');
var gutil = require('gulp-util');
var Buffer = require('buffer').Buffer;
var mainBowerFiles = require('main-bower-files');
var fs = require('fs');
var path = require('path');
var PluginError = gutil.PluginError;
var File = gutil.File;

const PLUGIN_NAME = 'gulp-require-angular';
const ANGULAR_MODULE = 'ng';

function output(a) {
	var out = '';
	a.forEach(function (v) {
		out += "require('" + v + "');\n";
	});
	return out;
}
/*
console.log('Current directory: ' + process.cwd());
var bowerFiles = mainBowerFiles();
console.log('bowerFiles', bowerFiles);
bowerFiles.forEach(function (file) {
	var relative = path.relative('./src', file);
	//console.log(relative);
	var contents = fs.readFileSync(file);
	//console.log(ngDep(contents));
});
*/
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
	var files = [], allModules = {},
		options = extend({
			filename: PLUGIN_NAME + '.generated.js',
			rebase: './',
			relativeTo: './src',
			bower: true,
			errorOnMissingModules: false
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
		files.push({
			file: path.relative(options.relativeTo, file.base + file.relative).replace(/\\/g, '/'),
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
			var isFound = false;
			files.forEach(function (file) {
				if (file.deps.modules[module]) {
					if (!isFound) {
						pushDistinct(defines, options.rebase + file.file);
						isFound = true;
					}
				} else if (file.deps.dependencies.indexOf(module) > -1) {
					pushDistinct(references, options.rebase + file.file);
				}
			});
			// if the module definition was not found in
			// any file, push to missing array
			if (!isFound) {
				pushDistinct(missing, module);
			}
		});

		// if a non existant mainModule is passed, defines will be empty
		if (!defines.length) {
			return this.emit('error', new PluginError(PLUGIN_NAME, 'Did not find any file where angular module \'' + mainModule + '\' is defined'));
		}

		// now have two arrays of distinct file paths, defines and references
		// create a final set of distinct file paths, with defines listed first
		finalSet = defines.slice();
		references.forEach(function (item) {
			pushDistinct(finalSet, item);
		});

		var file = new File();
		file.contents = new Buffer(output(finalSet).trim());
		file.base = __dirname;
		file.path = __dirname + '/' + options.filename;

		// if any module cannot be found, it will be in missing
		var msg;
		if (missing.length) {
			msg = 'Could not find a file where the follow modules are defined: ' + JSON.stringify(missing);
			if (options.errorOnMissingModules) {
				return this.emit('error', new PluginError(PLUGIN_NAME, msg));
			} else {
				gutil.log(msg);
			}
		}

		this.emit('data', file);
		this.emit('end');
	});
};