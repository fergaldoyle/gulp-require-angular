var gulp = require('gulp');
var requireAngular = require('../');
var should = require('should');
var path = require('path');
var assert = require('stream-assert');

require('mocha');

process.chdir('./test');
console.log('cwd: ' + process.cwd());

describe('gulp-require-angular', function () {
	describe('requireAngular()', function () {
		/***/
		it('should throw, when arguments are missing', function () {
			(function () {
				requireAngular();
			}).should.throw('Missing mainModule argument');
		});

		it('should emit error on streamed file', function (done) {
			gulp.src('.\/fixturesA/**\/*.js', { buffer: false })
				.pipe(requireAngular('myApp'))
				.on('error', function (err) {
					err.message.should.eql('Streaming not supported');
					done();
				});
		});

		it('should emit error when bad mainModule is passed', function (done) {
			gulp.src('.\/fixturesA/**\/*.js')
				.pipe(requireAngular('foob'))
				.on('error', function (err) {
					err.message.should.eql('Did not find any file where angular module \'foob\' is defined');
					done();
				});
		});

		it('should emit error if module dependency is not found', function (done) {
			gulp.src('.\/fixtureC/**\/*.js')
				.pipe(requireAngular('myApp', { errorOnMissingModules: true }))
				.on('error', function (err) {
					done();
				});
		});

		it('should emit end', function (done) {
			gulp.src('.\/fixturesA/**\/*.js')
				.pipe(requireAngular('myApp'))
				.on('end', function () {
					done();
				});
		});

		it('should emit a single file', function (done) {
			gulp.src('.\/fixturesA/**\/*.js')
				.pipe(requireAngular('myApp'))
				.pipe(assert.length(1))
				.pipe(assert.end(done));
		});

		it('should include required modules (only)', function (done) {
			gulp.src('.\/fixturesA/**\/*.js')
				.pipe(requireAngular('myApp'))
				.pipe(assert.first(function (f) {
					f.contents.toString().should
					.containEql('app.js')
					.and.containEql('moduleA.js')
					.and.containEql('moduleB.js')
					.and.containEql('moduleD.js')
					.and.not.containEql('moduleC.js');
				}))
				.pipe(assert.end(done));
		});

		it('should include files where required modules (only) are defined and referenced', function (done) {
			gulp.src('.\/fixturesA/**\/*.js')
				.pipe(requireAngular('myApp'))
				.pipe(assert.first(function (f) {
					f.contents.toString().should
					.containEql("'./app.js'")
					.and.containEql("'./moduleA/moduleA.js'")
					.and.containEql("'./moduleB/moduleB.js'")
					.and.containEql("'./moduleD/moduleD.js'")
					.and.containEql("'./app/app.controller.js'")
					.and.containEql("'./moduleA/moduleA.animation.js'")
					.and.containEql("'./moduleA/moduleA.config.js'")
					.and.containEql("'./moduleA/moduleA.constant.js'")
					.and.containEql("'./moduleA/moduleA.controller.js'")
					.and.containEql("'./moduleA/moduleA.directive.js'")
					.and.containEql("'./moduleA/moduleA.factory.js'")
					.and.containEql("'./moduleA/moduleA.filter.js'")
					.and.containEql("'./moduleA/moduleA.provider.js'")
					.and.containEql("'./moduleA/moduleA.run.js'")
					.and.containEql("'./moduleA/moduleA.service.js'")
					.and.containEql("'./moduleA/moduleA.value.js'")
					.and.not.containEql("'./moduleC/moduleC.js'")
					.and.not.containEql("'./moduleC/moduleC.controller.js'")
                    .and.not.containEql("'./moduleE/moduleE.js'")
                    .and.not.containEql("'./moduleE/moduleE.controller.js'");             
                            
				}))
				.pipe(assert.end(done));
		});

		it('should order the files correctly', function (done) {
			gulp.src('.\/fixturesA/**\/*.js')
				.pipe(requireAngular('myApp'))
				.pipe(assert.first(function (f) {
					var lines = f.contents.toString().split('\n');
					lines.indexOf("require('./app.js');")
						.should.be.lessThan(lines.indexOf("require('./app/app.controller.js');"));
				}))
				.pipe(assert.end(done));
		});

		it('should include third party modules', function (done) {
			gulp.src('.\/fixturesB/**\/*.js')
				.pipe(requireAngular('thirdParty'))
				.pipe(assert.first(function (f) {
					f.contents.toString().should
						.containEql("'./app.js'")
						.and.containEql("'./ui/angular-ui-router.js'")
						.and.containEql("'./ui/keypress.js'")
						.and.containEql("'./ng/angular-route.js'")
						.and.containEql("'./ng/angular-sanitize.js'");
				}))
				//.pipe(gulp.dest('./'))
				.pipe(assert.end(done));
		});

		it('should find modules in bower.json', function (done) {
			gulp.src('.\/fixturesD/**\/*.js')
				.pipe(requireAngular('myApp', { bower: true }))
				.pipe(assert.first(function (f) {
					f.contents.toString().should
					.containEql("'./app.js'")
					.and.containEql("'./../bower_components/moduleA/release/moduleA.js'")
					.and.containEql("'./../bower_components/moduleB/release/moduleB.js'");
				}))
				.pipe(gulp.dest('../'))
				.pipe(assert.end(done));
		});

		/***/

	});
});
