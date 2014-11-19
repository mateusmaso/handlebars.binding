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
        src: 'src/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['uglify', 'concat', 'mocha']);
};
