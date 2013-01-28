module.exports = function(grunt) {

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    buildPath: 'build/Release/<%= pkg.version %>',

    concat: {
      dist: {
        files: {
          '<%= buildPath %>/baas.io.js': [
                'src/build.before.js',
                'src/base/core/core.js',
                'src/base/entity/entity.js', 
                'src/base/collection/collection.js', 
                'src/build.after.js'
            ]
        }
      },

      release: {
        options: {
          stripBanners: true,
          banner: '// baas.io.js - v<%= pkg.version %>\n' +
                  '// <%= pkg.homepage %>\n' +
                  '// <%= pkg.description %>\n' +
                  '// (c) 2012-2013 KTH, <%= pkg.author %>\n'
        },
        files: {
          'baas.io.min.js': [ '<%= buildPath %>/baas.io.min.js' ],
          'baas.io.js': [ '<%= buildPath %>/baas.io.js' ]
        }
      },

      kitchen: {
        files: {
          'kitchen_sink/desktop/js/baas.io.min.js': [ '<%= buildPath %>/baas.io.min.js' ],
          'kitchen_sink/desktop/js/baas.io.js': [ '<%= buildPath %>/baas.io.js' ],
          'kitchen_sink/demo/js/baas.io.min.js': [ '<%= buildPath %>/baas.io.min.js' ],
          'kitchen_sink/demo/js/baas.io.js': [ '<%= buildPath %>/baas.io.js' ]
        }
      }
    },

    uglify: {
      dist: {
        options: {
          compress: true,
          mangle: true,
          beautify: {
            width: 80
          }
        },
        files: {
          '<%= buildPath %>/baas.io.min.js': [ '<%= buildPath %>/baas.io.js' ]
        }
      }
    },

    compress: {
      release: {
        options: {
          archive: '<%= buildPath %>/sdk/baasio_js_sdk_V<%= pkg.version %>.zip'
        },

        files: [
          { expand: true, cwd: '<%= buildPath %>/', src: ['*.js'] }
        ]
      },
      startup: {
        options: {
          archive: '<%= buildPath %>/startup/baasio_js_startup_V<%= pkg.version %>.zip'
        },

        files: [
          { expand: true, cwd: 'kitchen_sink/startup/', src: ['**'] }
        ]
      }
    },

    shell: {
      base: {
        command: 'dox-foundation --title "baas.io Javascript SDK v<%= pkg.version %>" -s ./src/base -T ./build/Release/<%= pkg.version %>/docs'
      },
      clean: {
        command: 'rm -rf <%= buildPath %>/docs/*'
      },
      cpdoc: {
        command: 'cp -R <%= buildPath %>/docs/* <%= pkg.deploy.docs %>'
      },
      cpsdk: {
        command: 'cp -R <%= buildPath %>/sdk/* <%= pkg.deploy.sdk %>'
      },
      cpstartup: {
        command: 'cp -R <%= buildPath %>/startup/* <%= pkg.deploy.sdk %>'
      }
    }
  });


  grunt.registerTask('default', ['concat:dist', 'uglify:dist']);
  grunt.registerTask('release', ['concat:release', 'concat:kitchen', 'compress:release', 'compress:startup' ]);
  grunt.registerTask('docs', [ 'shell:clean', 'shell:base' ]);
  grunt.registerTask('clean', [ 'shell:clean' ]);
  grunt.registerTask('deploy', [ 'shell:cpdoc', 'shell:cpsdk', 'shell:cpstartup' ]);
};
