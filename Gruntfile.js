module.exports = function(grunt) {

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        files: {
          'build/Release/<%= pkg.version %>/baas.io.js': [
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
          'baas.io.min.js': [ 'build/Release/<%= pkg.version %>/baas.io.min.js' ],
          'baas.io.js': [ 'build/Release/<%= pkg.version %>/baas.io.js' ]
        }
      },

      kitchen: {
        files: {
          'kitchen_sink/desktop/js/baas.io.min.js': [ 'build/Release/<%= pkg.version %>/baas.io.min.js' ],
          'kitchen_sink/desktop/js/baas.io.js': [ 'build/Release/<%= pkg.version %>/baas.io.js' ],
          'kitchen_sink/demo/js/baas.io.min.js': [ 'build/Release/<%= pkg.version %>/baas.io.min.js' ],
          'kitchen_sink/demo/js/baas.io.js': [ 'build/Release/<%= pkg.version %>/baas.io.js' ]
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
          'build/Release/<%= pkg.version %>/baas.io.min.js': [ 'build/Release/<%= pkg.version %>/baas.io.js' ]
        }
      }
    },

    compress: {
      startup: {
        options: {
          archive: 'build/Release/<%= pkg.version %>/baasio_js_client_SDK_V<%= pkg.version %>.zip'
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
        command: 'rm -rf build/docs/*'
      }
    }
  });


  grunt.registerTask('default', ['concat:dist', 'uglify:dist']);
  grunt.registerTask('release', ['concat:release', 'concat:kitchen', 'compress:startup' ]);
  grunt.registerTask('docs', [ 'shell:base' ]);
  grunt.registerTask('clean', [ 'shell:clean' ]);
};
