module.exports = function(grunt) {

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-exec');

  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/**\n' +
              ' * baas.io.js - v<%= pkg.version %>\n' +
              ' * <%= pkg.homepage %>\n' +
              ' * <%= pkg.description %>\n' +
              ' * (c) 2012-2013 KTH, <%= pkg.author %>\n' +
              // ' * baasio SDK may be freely distributed under the MIT license.\n' +
              ' */'
    },

    concat: {
      dist: {
        src: [ '<banner>', 
                'src/build.before.js', 
                'src/core/base.js', 
                'src/query/query.js', 
                'src/entity/entity.js', 
                'src/collection/collection.js', 
                'src/build.after.js' ],
        dest: 'dest/baas.io.js'
      },

      development: {
        src: [ '<banner>',
                'src/core/underscore.1.4.3.js',
                'dest/baas.io.js'
        ],
        dest: './baas.io.js'
      },

      production: {
        src: [ '<banner>',
                'src/core/underscore.1.4.3.min.js',
                'dest/baas.io.min.js'
        ],
        dest: './baas.io.min.js'
      }
    },

    uglify: {
      my_target: {
        options: {
          mangle: false
        },
        files: {
          'dest/baas.io.min.js': [ 'build/built.js' ]
        }
      } 
    },

    exec: {
      build: {
        command: 'uglifyjs ./build/built.js -o ./dest/baas.io.min.js -p 5 -c -m'
        // stdout: true
      },

      kitchen: {
        command: 'cp -R ./baas.*.js ./kitchen_sink/desktop/js/'
      }
    }
  });


  // grunt.registerTask('default', 'init');
  grunt.registerTask('default', 'concat:dist exec:build concat:release');
  grunt.registerTask('release', 'concat:development concat:production');
  grunt.registerTask('kitchen', 'exec:kitchen');
};
