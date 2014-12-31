module.exports = function ( grunt ) {
  // load plugins
  [
    'grunt-cafe-mocha',
    'grunt-contrib-jshint'
  ].forEach(function ( task ) {
    grunt.loadNpmTasks(task);
  });

  // configure plugins
  grunt.initConfig({
    cafemocha: {
      all: { src: 'qa/tests-*.js', options: { ui: 'tdd' } }
    },
    jshint: {
      app: ['app.js', 'public/js/**/*.js', 'lib/**/*.js'],
      qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js']
    }
  });

  // register tasks
  grunt.registerTask('default', ['cafemocha', 'jshint']);
};