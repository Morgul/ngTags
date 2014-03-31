// ---------------------------------------------------------------------------------------------------------------------
// Grunt build script
// ---------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dist: 'dist',
        tmp: '<%= dist %>/tmp',

        clean: {
            tmp: '<%= tmp %>',
            dist: '<%= dist %>'
        },
        html2js: {
            tags: {
                src: ['partials/**/*.tpl.html'],
                dest: '<%= tmp %>/templates.js',
                options: {
                    base: 'partials',
                    module: 'ui.ngTags.templates',
                    rename: function (moduleName) {
                        return '/' + moduleName.replace('.tpl', '');
                    }
                }
            }
        },
        less: {
            min: {
                options: {
                    paths: ['less'],
                    compress: true
                },
                files: {
                    '<%= dist %>/ng-tags-<%= pkg.version %>.min.css': ['less/**/*.less']
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= dist %>/ng-tags-<%= pkg.version %>.min.js': ['ng-tags.directive.js', '<%= tmp %>/templates.js']
                }
            }
        }
    });

    // Grunt Tasks.
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Setup the build task.
    grunt.registerTask('build', ['clean:dist', 'html2js', 'uglify', 'less', 'clean:tmp']);
};

// ---------------------------------------------------------------------------------------------------------------------