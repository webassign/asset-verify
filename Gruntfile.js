/*global module:false*/
module.exports = function(grunt) {

	var path = require('path');

	// get project target
	var target = grunt.option('target');
	if (!target) {
		grunt.fatal('Must specify a target to run tests on. "--target [project_name]"');
	} else if (target[target.length-1] == '/') {
		// remove the trailing "/"
		target = target.substr(0,target.length-1);
	}

	// Project configuration.
	grunt.initConfig({
		nodeunit: {
			files: ['namespace.js']
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
			all: ['grunt.js', target + '/js/*.js']
		},
		csslint: {
			base_theme: {
				src: target + '/css/*.css',
				rules: {
					'import': false,
					'overqualified-elements': 2
				}
			}
		}
	});

	// load plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-css');

	// all tasks
	grunt.registerTask('all', ['jshint', 'csslint', 'namespace']);

	grunt.registerTask('namespace', 'Run namespace checking on all js files', function(params) {
		var files = grunt.file.expand(target + '/js/*.js');
		var paths = files.map(function(filepath) {
			return path.resolve(filepath);
		});
		
		// store paths in a safe global so we can access them in the test
		// @todo make this less of a hack
		global.WebAssign = paths;

		// run the nodeunit task
		grunt.task.run('nodeunit');
	});
};