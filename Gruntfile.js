// Generated on 2013-09-12 using generator-angular 0.4.0
'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);


  // configurable paths
  var bowerConfig = require('./bower.json');
  var appConfig = {
    app: bowerConfig.appPath || 'app',
    dist: 'dist',
    version: bowerConfig.version
  };

  grunt.initConfig({
    yeoman: appConfig,
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        port: 9001,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },
    // not used since Uglify task does concat,
    // but still available if needed
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },
        // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    // concat: {
    //   dist: {}
    // },
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/*.css', '<%= yeoman.dist %>/bower_components/bootstrap/dist/css/*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/img']
      }
    },
    // imagemin: {
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: '<%= yeoman.app %>/images',
    //       src: '{,*/}*.{png,jpg,jpeg,gif}',
    //       dest: '<%= yeoman.dist %>/images'
    //     }]
    //   }
    // },

    // svgmin: {
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: '<%= yeoman.app %>/images',
    //       src: '{,*/}*.svg',
    //       dest: '<%= yeoman.dist %>/images'
    //     }]
    //   }
    // },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*',
            'scripts/themes.js',
            'styles/themes/**/*.css',
            'img/**/*',
         
            'bower_components/angular/**/*.min.js',
            'bower_components/bootstrap/dist/js/*.min.js',
            'bower_components/bootstrap/dist/css/*.min.css',
            'bower_components/bootstrap/dist/fonts/glyphicons-*.*',
            'bower_components/angular-route/**/*.min.js',
            'bower_components/angular-sanitize/**/*.min.js',
            'bower_components/angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker.min.js',
            'bower_components/jquery-ui/jquery-ui.min.js',
            'bower_components/jquery/**/*.min.js',
            'bower_components/spinjs/spin.js',
            'bower_components/FileSaver/FileSaver.min.js',
            'bower_components/spectrum/spectrum.js',

          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: [ 'generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      bower_components: {
        expand: true,
        cwd: 'bower_components',
        dest: '<%= yeoman.app %>/bower_components',
        dot: true,
        src: ['**/*']
      }
    },

    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles'
      ]
    },
    karma: {
      options: {
        runnerPort: 9999
      },
      unit: {
        configFile: 'karma.conf.js',
        singleRun: false
      }
    },

    compress: {
      zip: {
        options: {
          archive: 'my-personal-kanban-'+ appConfig.version +'.zip'
        },
        files: [{expand: true, cwd:'dist', src: ['**'], dest: 'my-personal-kanban'}]
      }
    },

    replace: {
      'localhost_to_remote_in_js': {
        src: ['<%= yeoman.dist %>/scripts/*.js'],             // source files array (supports minimatch)
        dest: '<%= yeoman.dist %>/scripts/',             // destination directory or file
        replacements: [{ 
          from: 'http://localhost:8080',                   // string replacement
          to: 'https://my-personal-kanban.appspot.com' 
        }]
      },      
      'localhost_to_remote_in_html': {
        src: ['<%= yeoman.dist %>/*.html'],             // source files array (supports minimatch)
        dest: '<%= yeoman.dist %>/',             // destination directory or file
        replacements: [{ 
          from: 'http://localhost:8080',                   // string replacement
          to: 'https://my-personal-kanban.appspot.com' 
        }]
      },
      'version': {
        src: ['<%= yeoman.dist %>/*.html'],
        dest: '<%= yeoman.dist %>/', 
        replacements: [{
          from: '@version@',
          to: appConfig.version
        }]
      }
    }
  
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'replace:localhost_to_remote_in_js',
    'replace:localhost_to_remote_in_html',
    'replace:version',
    'compress'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};
