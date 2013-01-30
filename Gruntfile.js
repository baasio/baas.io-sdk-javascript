module.exports = function(grunt) {

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');
  // grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-replace');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    dist: 'build/Release/<%= pkg.version %>',

    concat: {
      dist: {
        files: {
          '<%= dist %>/baas.io.js': [
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
          'baas.io.min.js': [ '<%= dist %>/baas.io.min.js' ],
          'baas.io.js': [ '<%= dist %>/baas.io.js' ]
        }
      },

      kitchen: {
        files: {
          'kitchen_sink/desktop/js/baas.io.min.js': [ '<%= dist %>/baas.io.min.js' ],
          'kitchen_sink/desktop/js/baas.io.js': [ '<%= dist %>/baas.io.js' ],
          'kitchen_sink/demo/js/baas.io.min.js': [ '<%= dist %>/baas.io.min.js' ],
          'kitchen_sink/demo/js/baas.io.js': [ '<%= dist %>/baas.io.js' ]
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
          '<%= dist %>/baas.io.min.js': [ '<%= dist %>/baas.io.js' ]
        }
      }
    },

    compress: {
      sdk: {
        options: {
          archive: '<%= dist %>/sdk/baasio_js_sdk_V<%= pkg.version %>.zip'
        },

        files: [
          { expand: true, cwd: '<%= dist %>/', src: [ 'baas.io.js', 'baas.io.min.js' ] }
        ]
      },
      startup: {
        options: {
          archive: '<%= dist %>/startup/baasio_js_startup_V<%= pkg.version %>.zip'
        },

        files: [
          { expand: true, cwd: 'kitchen_sink/startup/', src: ['**'] }
        ]
      },
      startup: {
        options: {
          archive: '<%= dist %>/demo/baasio_js_demoapp_V<%= pkg.version %>.zip'
        },

        files: [
          { expand: true, cwd: 'kitchen_sink/demo/', src: ['**'] }
        ]
      }
    },

    shell: {
      base: {
        command: 'dox-foundation --title "baas.io Javascript SDK v<%= pkg.version %>" -s ./src/base -T <%= dist %>/docs'
      },
      clean: {
        command: 'rm -rf <%= dist %>/docs/*'
      },
      cpdoc: {
        command: 'cp -R <%= dist %>/docs/* <%= pkg.deploy.docs %>'
      },
      sdk: {
        command: 'cp -R <%= dist %>/sdk/* <%= pkg.deploy.sdk %>'
      },
      startup: {
        command: 'cp -R <%= dist %>/startup/* <%= pkg.deploy.sdk %>'
      }
    },

    replace: {
      sdk: {
        options: {
          variables: {
            version: '<%= pkg.version %>'
          },
          prefix: '@@'
        },
        files: {
          '<%= dist %>/baas.io.js': [
            '<%= dist %>/baas.io.js'
          ]
        }
      },
      docs: {
        options: {
          variables: {
            '<a href="../collection/collection.js.html">': '<a href="../reference/collection/collection.js.html">',
            '<a href="../core/core.js.html">': '<a href="../reference/core/core.js.html">',
            '<a href="../entity/entity.js.html">': '<a href="../reference/entity/entity.js.html">'
          },
          prefix: '' //default option
        },
        files: {
          '<%= dist %>/docs/index.html': [
            '<%= dist %>/docs/index.html'
          ]
        }
      }
    }
  });

  grunt.registerTask('default', [ 'build', 'packing' ]);
  grunt.registerTask('build', [ 'concat:dist', 'replace:sdk', 'uglify:dist', 'concat:release', 'shell:base', 'replace:docs' ]);
  grunt.registerTask('packing', [ 'compress:sdk', 'compress:startup' ]);
  grunt.registerTask('deploy', [ 'concat:kitchen','shell:sdk', 'shell:startup', 'shell:cpdoc' ]);
  grunt.registerTask('clean', [ 'shell:clean' ]);
};
