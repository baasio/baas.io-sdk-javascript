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
        src: [ 
                'src/build.before.js',
                'src/core/usergrid/0.10.3/usergrid.js', 
                'src/core/usergrid/0.10.3/extension/usergrid.validation.js', 
                'src/core/base.js', 
                // 'src/query/query.js', 
                // 'src/entity/entity.js', 
                // 'src/collection/collection.js', 
                'src/build.after.js' ],
        dest: 'dist/baas.io.js'
      },

      development: {
        src: [ '<banner>',
                // 'src/core/underscore.1.4.3.js',
                'dist/baas.io.js'
        ],
        dest: './baas.io.js'
      },

      production: {
        src: [ '<banner>',
                // 'src/core/underscore.1.4.3.min.js',
                'dist/baas.io.min.js'
        ],
        dest: './baas.io.min.js'
      }
    },

    exec: {
      build: {
        command: 'uglifyjs ./dist/baas.io.js -o ./dist/baas.io.min.js -p 5 -c -m'
        // stdout: true
      },

      kitchen: {
        command: 'cp -R ./baas.*.js ./kitchen_sink/desktop/js/'
      },

      sample: {
        command: 'cp -R ./baas.io.min.js ./kitchen_sink/sample/js/'
      }
    }
  });


  // grunt.registerTask('default', 'init');
  grunt.registerTask('default', 'concat:dist exec:build concat:release');
  grunt.registerTask('release', 'concat:development concat:production');
  grunt.registerTask('kitchen', 'exec:kitchen exec:sample');
};
