module.exports = function(grunt) {

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-dox');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        files: {
          'dist/baas.io.js': [
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
          'baas.io.min.js': [ 'dist/baas.io.min.js' ],
          'baas.io.js': [ 'dist/baas.io.js' ]
        }
      },

      kitchen: {
        files: {
          'kitchen_sink/desktop/js/baas.io.min.js': [ 'dist/baas.io.min.js' ],
          'kitchen_sink/desktop/js/baas.io.js': [ 'dist/baas.io.js' ],
          'kitchen_sink/demo/js/baas.io.min.js': [ 'dist/baas.io.min.js' ],
          'kitchen_sink/demo/js/baas.io.js': [ 'dist/baas.io.js' ]
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
          'dist/baas.io.min.js': [ 'dist/baas.io.js' ]
        }
      }
    },

    dox: {
      files: {
        src: [ 'src/**/*.js' ],
        dest: 'docs'
      }
    },

    shell: {
      base: {
        command: 'dox-foundation --title "baas.io SDK v0.1.0" -s ./src/base -T ./docs -i ./src/usergrid'
      },
      clean: {
        command: 'rm -rf docs/*'
      }
    }
  });


  grunt.registerTask('default', ['concat:dist', 'uglify:dist']);
  grunt.registerTask('release', ['concat:release', 'concat:kitchen']);
  grunt.registerTask('docs', [ 'shell:base' ]);
  grunt.registerTask('clean', [ 'shell:clean' ]);
};
