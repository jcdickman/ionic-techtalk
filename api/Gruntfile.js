module.exports = function ( grunt ) {

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-apidoc');
    grunt.loadNpmTasks('grunt-jsdoc');

    /**
     * Load in our build configuration file.
     */
    var userConfig = require( './build.config.js' );

    /**
     * This is the configuration object Grunt uses to give each plugin its
     * instructions.
     */
    var taskConfig = {
        /**
         * API Docs Documentation Task
         */
        apidoc: {
            nodeSeed: {
                src: '<%= apidocs_src_dir %>',
                dest: '<%= apidocs_build_dir %>'
            }
        },

        /**
         * JSDoc Documentation Task
         */
        jsdoc: {
            dist: {
                src: [ '<%= jsdocs_src %>' ],
                dest: '<%= jsdocs_build_dir %>'
            },
            options: {
                template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
            }
        },

        /**
         * We read in our `package.json` file so we can access the package name and
         * version. It's already there, so we don't repeat ourselves here.
         */
        pkg: grunt.file.readJSON("package.json"),

        /**
         * The directories to delete when `grunt clean` is executed.
         */
        clean: [
            '<%= apidocs_build_dir %>',
            '<%= jsdocs_build_dir %>'
        ]//,

        /**
         * `jshint` defines the rules of our linter as well as which files we
         * should check. This file, all javascript sources, and all our unit tests
         * are linted based on the policies listed in `options`. But we can also
         * specify exclusionary patterns by prefixing them with an exclamation
         * point (!); this is useful when code comes from a third party but is
         * nonetheless inside `src/`.
         */
        //jshint: {
        //    src: [
        //        '<%= app_files.js %>'
        //    ],
        //    test: [
        //        '<%= app_files.jsunit %>'
        //    ],
        //    gruntfile: [
        //        'Gruntfile.js'
        //    ],
        //    options: {
        //        curly: true,
        //        immed: true,
        //        newcap: true,
        //        noarg: true,
        //        sub: true,
        //        boss: true,
        //        eqnull: true
        //    },
        //    globals: {}
        //}
    };

    grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

    /**
     * The default task is to build and compile.
     */
    grunt.registerTask( 'default', [ 'build' ] );

    /**
     * The `build` task gets your app ready to run for development and testing.
     */
    grunt.registerTask( 'build', [
        'clean', 'apidoc', 'jsdoc'
    ]);

    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS ( files ) {
        return files.filter( function ( file ) {
            return file.match( /\.js$/ );
        });
    }

};
