module.exports = function(grunt){
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */',
            mangle:true
        },
        my_target: {
          files: {
            'public/js/min/header.min.js': ['public/js/tgy/header.js']
          }
        }
      },
      jshint: {
        files: ['public/js/tgy/*.js','models/*.js','routes/*.js'],
        options: {
            globals: {
                exports: true
            }
        }
      },
      watch: {
        files: ['public/js/tgy/header.js'],
        tasks: ['uglify']
      },
      qunit: {
        files: ['test/*.html']
      }
    });
    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //uglify插件需要解决生产环境和开发环境切换问题，开发环境需要随时调试没有压缩的js

    grunt.loadNpmTasks('grunt-contrib-jshint');
    //jshint 很好用，规范代码

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-qunit');
    // 默认任务
    grunt.registerTask('default', ['uglify','jshint']);
    //grunt.registerTask('default', ['qunit']);
}