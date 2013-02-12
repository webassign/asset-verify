/*global module:false*/
module.exports = function(grunt) {

	var path = require('path');

	// Project configuration.
	grunt.initConfig({
		nodeunit: {
			files: ['test.js']
		},
		namespace: {
			files: ['*.js'],
			options: {
				foo: 'bar'
			}
		},
		jshint: {
			options: {
				undef     : true,
				browser   : true,
				laxbreak  : true,
				laxcomma  : true,
				loopfunc  : true,
				onecase   : true,
				scripturl : true,
				smarttabs : true,
				sub       : true,
				supernew  : true,
				globals: {
					External: false
				}
			},
			all: ['grunt.js', 'examples/astro/js/*.js']
		},
		csslint: {
			base_theme: {
				src: "examples/astro/css/*.css",
				rules: {
					"import": false,
					"overqualified-elements": 2
				}
			}
		}
	});

	// load plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-css');

	// all tasks
	grunt.registerTask('all', ['jshint', 'nodeunit', 'csslint', 'namespace']);

	grunt.registerTask('namespace', 'Run namespace checking on all js files', function(params) {
		// get project target
		var target = grunt.option('target');
		if (!target) {
			grunt.fatal('Must specify a target to run tests on. "--target [project_name]"');
		}

		var files = grunt.file.expand(target + '/js/*.js');
		var paths = files.map(function(filepath) {
			return path.resolve(filepath);
		});
		console.log(paths);

		var nodeunit = require('nodeunit');
		var fs = require('fs');
		fs.writeFileSync('filelist.txt', paths.join("\n"));
		console.log((('' + paths[0]).indexOf('\u0000') !== -1));
		console.log(paths[0], fs.statSync(paths[0]));
		return nodeunit.reporters.verbose.run(['test.js'], {});
	});
};