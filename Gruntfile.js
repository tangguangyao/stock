module.exports = function(grunt){
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        my_target: {
          files: {
            'public/js/min/header.min.js': ['public/js/tgy/header.js']
          }
        }
      },
      jshint: {
        files: ['public/js/tgy/*.js'],
        options: {
            globals: {
                exports: true
            }
        }
      }
      // qunit: {
      //   files: ['test/*.html']
      // }
    });
    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    // 默认任务
    grunt.registerTask('default', ['uglify','jshint']);
    //grunt.registerTask('default', ['qunit']);
}