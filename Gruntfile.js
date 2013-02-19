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
			embed: {
				src: ['namespace_embed.js']
			},
			popup: {
				src: ['namespace_popup.js']
			}
		},
		namespace: {
			options: {
				src: [target + '/js/*.js']
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
			},
			popup: {
				options: {
					globals: {
						External: true
					}
				},
				src: [target + '/js/*.js']
			},
			embed: {
				options: {
					globals: {
						External: false
					}
				},
				src: [target + '/js/*.js']
			}
		},
		csslint: {
			popup: {
				src: target + '/css/*.css',
				rules: {
					'import'                 : false,
					'overqualified-elements' : false,
					'adjoining-classes'      : false,
					'box-sizing'             : false,
					'float'                  : false,
					'font-faces'             : false,
					'font-sizes'             : false,
					'qualified-headings'     : false,
					'unique-headings'        : false,
					'known-properties'       : 2,
					'universal-selector'     : 2,
					'unqualified-attributes' : 2,
					'box-model'              : false,
					'ids'                    : false,
					'imports'                : false,
					'shorthand'              : false,
					'text-indent'            : false,
					'zero-units'             : false
				}
			},
			embed: {
				src: target + '/css/*.css',
				rules: {
					'import': false,
					'overqualified-elements': 2
				}
			}
		},
		imagecheck: {
			options: {
				path: target,
				filename: 'screenshot.png'
			}
		}
	});

	// load plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-css');

	// all tasks
	grunt.registerTask('all:popup', ['jshint:popup', 'csslint:popup', 'imagecheck']);
	grunt.registerTask('all:embed', ['jshint:embed', 'csslint:embed', 'namespace:embed']);

	grunt.registerTask('namespace', 'Run namespace checking on all js files', function(task) {
		var files = grunt.file.expand(this.options().src);
		var paths = files.map(function(filepath) {
			return path.resolve(filepath);
		});
		
		// store paths in a safe global so we can access them in the test
		// @todo make this less of a hack
		global.WebAssign = paths;

		// run the nodeunit task
		grunt.task.run('nodeunit:' + task);
	});

	grunt.registerTask('imagecheck', 'Ensure there is a screenshot', function() {
		fs = require('fs');

		// check for file
		var file = this.options().path + '/' + this.options().filename;
		var found = fs.existsSync(file, function(exists) {
			return exists;
		});

		// log any errors and return status
		if (!found) {
			grunt.log.error('No file ' + file + ' found');
		} else {
			grunt.log.ok('screenshot.png found');
		}
		return found;
	});
};