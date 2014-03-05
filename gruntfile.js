module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		watch: {
		  scripts: {
		    files: ['./src/js/**/*.js', '!./src/js/levelsfm.js'],
		    tasks: ['default']
		  }
		},

		browserify: {
			dist: {
			    src: 'src/js/server.js',
			    dest: 'src/js/levelsfm.js'
			}
		}

	});


	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('default', ['browserify']);

}