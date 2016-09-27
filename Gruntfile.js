module.exports = function (grunt) {

  // load npm tasks
  grunt.loadNpmTasks('grunt-screeps');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jscs');

  // unix LF
  grunt.util.linefeed = '\n';

  // register tasks
  grunt.registerTask('sync', ['concat', 'eslint', 'screeps']);

  // grunt init config
  grunt.initConfig({
    concat: {
      submodule_perf: {
        src: ['screeps-perf/screeps-perf.js'],
        dest: 'dist/screeps-perf.js'
      },
      submodule_profiler: {
        src: ['screeps-profiler/screeps-profiler.js'],
        dest: 'dist/screeps-profiler.js'
      },
      options: {
        banner: 'var component = {};\n\n',
        footer: '\nmodule.exports = component;',
      },
      dist_ai: {
        src: ['src/ai/*.js'],
        dest: 'dist/ai.js',
      },
      dist_controller: {
        src: ['src/controller/*.js'],
        dest: 'dist/controller.js',
      },
      dist_templates: {
        src: ['src/template/*.js'],
        dest: 'dist/template.js',
      },
      dist_main: {
        options: {
          banner: '',
          footer: '',
        },
        src: 'src/main.js',
        dest: 'dist/main.js',
      }
    },
    eslint: {
      target: ['src/**.js'],
    },
    screeps: {
      options: {
        email: process.env.SCREEPS_EMAIL,
        password: process.env.SCREEPS_PASSWORD,
        branch: 'screeps',
      },
      dist: {
        src: ['dist/*.js'],
      },
    },
    watch: {
      scripts: {
        files: ['src/*/*.js'],
        tasks: ['sync'],
        options: {
          interrupt: false,
        },
      },
    },
  });



};
