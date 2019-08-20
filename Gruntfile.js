module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  var _ = require('lodash');

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return _.extend(options, customOptions, travisOptions);
  };

  var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    less: {
      development: {
        options: {
          // compress: true,
          // yuicompress: true,
          // optimization: 2
        },
        files: {
          'dist/angular-multi-select-tree-<%= pkg.version %>.css': "src/multi-select-tree.less" // destination file and source file
        }
      }
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
        tasks: ['clean', 'jshint', 'concat', 'ngtemplates', 'ngmin', 'less', 'cssmin', 'ngtemplates', 'uglify']
      },
      styles: {
        files: ['src/**/*.less'],
        tasks: ['less', 'cssmin']
      },
      templates: {
        files: ['src/**/*.html'],
        tasks: ['ngtemplates']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        eqeqeq: true,
        globals: {
          angular: true
        }
      }
    },
    concat: {
      js: {
        src: ['src/**/*main.js',
              'src/**/*.js'],
        dest: 'dist/angular-multi-select-tree-<%= pkg.version %>.js'
      }
    },
    ngtemplates: {
      'multi-select-tree': {
        src: 'src/**/*.html',
        dest: 'dist/angular-multi-select-tree-<%= pkg.version %>.tpl.js'
      }
    },
    uglify: {
      src: {
        files: {
          'dist/angular-multi-select-tree-<%= pkg.version %>.min.js': '<%= concat.js.dest %>'
        }
      }
    },

    // connect
    connect: {
      options: {
        port: 3333,
        livereload: 93729,
        hostname: 'localhost'
      },
      demo: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '')
            ];
          }
        }
      }
    },

    // open
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>/demo/'
      }
    },

    karma: {
      unit: {
        options: karmaConfig('karma.conf.js', {
          singleRun: true
        })
      },
      server: {
        options: karmaConfig('karma.conf.js', {
          singleRun: false
        })
      }
    },
    changelog: {
      options: {
        dest: 'CHANGELOG.md'
      }
    },
    ngmin: {
      src: {
        src: '<%= concat.js.dest %>',
        dest: '<%= concat.js.dest %>'
      }
    },
    cssmin: {
        css: {
          src: 'dist/angular-multi-select-tree-<%= pkg.version %>.css',
          dest: 'dist/angular-multi-select-tree-<%= pkg.version %>.min.css'
        }
    },
    clean: ['dist/*']
  });

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', []);
  grunt.registerTask('test-server', ['karma:server']);
  grunt.registerTask('server', ['open', 'connect:demo', 'watch']);
  grunt.registerTask('build', ['clean', 'jshint', 'concat', 'less', 'ngtemplates', 'ngmin', 'cssmin', 'uglify']);
};
