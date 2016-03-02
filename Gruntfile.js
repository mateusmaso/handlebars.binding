module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '<%= pkg.version %>',
      banner:
        '// <%= pkg.name %>\n' +
        '// ------------------\n' +
        '// v<%= pkg.version %>\n' +
        '//\n' +
        '// Copyright (c) 2013-<%= grunt.template.today("yyyy") %> Mateus Maso\n' +
        '// Distributed under MIT license\n' +
        '//\n' +
        '// <%= pkg.repository.url %>\n' +
        '\n'
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    babel: {
      options: {
        presets: ['es2015']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.js'],
            dest: 'tmp/'
          }
        ]
      }
    },
    browserify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': ['tmp/**/*.js']
        }
      }
    },
    mocha: {
      options: {
        run: true
      },
      test: {
        src: ['spec/**/*.html']
      }
    },
    clean: ['dist']
  });

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['babel', 'browserify', 'uglify', 'mocha']);
};
