'use strict';

module.exports = function (grunt) {
    var localConfig;
    try {
        localConfig = require('./app/config/local.env');
    } catch(e) {
        localConfig = {};
    }

    require('jit-grunt')(grunt, {
        express: 'grunt-express-server'
    });

    require('time-grunt')(grunt);

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
	// Add coverage tasks.
    grunt.loadNpmTasks('grunt-mocha-istanbul')

    grunt.initConfig({
        mocha_istanbul: {
            coverage: {
                src: 'test', // a folder works nicely
                options: {
                    mask: '*.spec.js'
                }
            },
            coverageSpecial: {
                src: ['testSpecial/*/*.js', 'testUnique/*/*.js'], // specifying file patterns works as well
                options: {
                    coverageFolder: 'coverageSpecial',
                    mask: '*.spec.js',
                    mochaOptions: ['--harmony','--async-only'], // any extra options
                    istanbulOptions: ['--harmony','--handle-sigint']
                }
            },
            coveralls: {
                src: ['test', 'testSpecial', 'testUnique'], // multiple folders also works
                options: {
                    coverage:true, // this will make the grunt.event.on('coverage') event listener to be triggered
                    check: {
                        lines: 75,
                        statements: 75
                    },
                    root: './lib', // define where the cover task should consider the root of libraries that are covered by tests
                    reportFormats: ['cobertura','lcovonly']
                }
            }
        },
        istanbul_check_coverage: {
          default: {
            options: {
              coverageFolder: 'coverage*', // will check both coverage folders and merge the coverage results
              check: {
                lines: 50,
                statements: 50
              }
            }
          }
        }

			
			
			, 
        pkg: grunt.file.readJSON('package.json'),
// Configure a mochaTest task
         mochaTest: {
           test: {
             options: {
               reporter: 'spec',
               captureFile: 'mocharesults.txt', // Optionally capture the reporter output to a file
               quiet: false, // Optionally suppress output to standard out (defaults to false)
               clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
             },
             src: ['test/**/*.js']
           }
         },
        express: {
            options: {
                port: process.env.PORT || 9000
            },
            dev: {
                options: {
                    script: './app/app.js',
                    debug: true
                }
            },
            prod: {
                options: {
                    script: 'dist/app/app.js'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: 'app/.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: ['./**/*.js', '!./**/*.spec.js', '!./**/*.mock.js'],
            test: ['./**/*.spec.js', './**/*.mock.js']
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'dist/*',
                        '!dist/.git*',
                        '!dist/.openshift',
                        '!dist/Procfile'
                    ]
                }]
            },
            server: '.tmp'
        },
        'node-inspector': {
            custom: {
                options: {
                    'web-host': 'localhost'
                }
            }
        },

        watch: {
            mochaTest: {
                files: ['app/**/*.spec.js'],
                tasks: ['env:test', 'mochaTest']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            express: {
                files: [
                    'app/**/*.{js,json}'
                ],
                tasks: ['express:dev', 'wait'],
                options: {
                    livereload: 1234,
                    nospawn: true //Without this option specified express won't be reloaded
                }
            }
        },

        nodemon: {
            debug: {
                script: 'app/app.js',
                options: {
                    nodeArgs: ['--debug-brk'],
                    env: {
                        PORT: process.env.PORT || 9000
                    },
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });

                        // opens browser on initial server start
                        nodemon.on('config:update', function () {
                            setTimeout(function () {
                                require('open')('http://localhost:8080/debug?port=5858');
                            }, 500);
                        });
                    }
                }
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true, 
                    dest: './dist',
                    src: [
                        'package.json',
                        'fig.yml',
                        'Dockerfile',
                        'app/**/*']}]
            }
        },

        dockerBuild: {
        },
        env: {
            test: {
                NODE_ENV: 'test'
            },
            prod: {
                NODE_ENV: 'production'
            },
            all: localConfig
        },
    });

    grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
        this.async();
    });

    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'env:all', 'env:prod', 'express:prod', 'express-keepalive']);
        }

        if (target === 'debug') {
            return grunt.task.run([
                'clean:server',
                'env:all']);
        }

        grunt.task.run([
            'clean:server',
            'env:all',
            'express:dev', 
            'watch'
        ]);
    });

    grunt.registerTask('test', function(target) {
        grunt.task.run([
            'mochaTest']);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
		grunt.registerTask('test', 'mochaTest');

    grunt.event.on('coverage', function(lcovFileContents, done){
        // Check below on the section "The coverage event"
        done();
    });
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    grunt.registerTask('coveralls', ['mocha_istanbul:coveralls']);
    grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
}
