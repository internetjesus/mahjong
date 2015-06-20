module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            js: {
                files: {
                    'build/core.min.js': ['build/core.js']
                }
            }
        },
        concat: {
            dist: {
                src: ['app/**/*.js'],
                dest: 'build/core.js'
            }
        },
        ngtemplates:  {
            mahjong: {
                src:      'app/**/**.html',
                dest:     'build/templates.js',
                options:    {
                    htmlmin:  { collapseWhitespace: true, collapseBooleanAttributes: true }
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'build/main.css': 'assets/sass/main.scss'
                }
            }
        },
        //cssmin: {
        //    options: {
        //        shorthandCompacting: false,
        //        roundingPrecision: -1
        //    },
        //    target: {
        //        files: {
        //            'assets/css/main.css': ['dist/css/app.css']
        //        }
        //    }
        //},
        watch: {
            js: {
                files: 'app/**/*.js',
                tasks: ['concat']
            },
            sass: {
                files: 'assets/sass/**/*.scss',
                tasks: ['sass']
            },
            html: {
                files: 'app/**/**.html',
                tasks: ['ngtemplates']
            }
        }
    });

    // Load the npm installed tasks
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // The default tasks to run when you type: grunt
    grunt.registerTask('default', ['sass', 'ngtemplates', 'concat', 'uglify', 'watch']);
};