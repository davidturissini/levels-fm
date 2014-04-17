module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		watch: {
		  scripts: {
		    files: ['./src/js/**/*.js'],
		    tasks: ['browserify']
		  },
		  css: {
		    files: ['./src/scss/**/*.scss'],
		    tasks: ['sass']
		  }
		},

		sass: {
			dist: {
				files: {
					'public/styles/levelsfm.css': 'src/scss/levelsfm.scss'
					}
				}
		},

		browserify: {
			dist: {
			    src: 'src/js/levelsfm.js',
			    dest: 'public/js/levelsfm.js'
			}
		}

	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-newer');

	grunt.registerTask('default', ['browserify', 'sass']);

}