module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'node_modules/angular/angular.js',
            'node_modules/angular-ui-router/build/angular-ui-router.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-local-storage/dist/angular-local-storage.js',
            'node_modules/angular-loading-bar/build/loading-bar.js',
            'node_modules/underscore/underscore-min.js',
            'bower_components/angular-sanitize/angular-sanitize.min.js',
            'bower_components/ngtoast/dist/ngToast.min.js',
            'bower_components/angular-bootstrap/ui-bootstrap.min.js',

            'app/**/*.js',
            'test/*.spec.js',
            'app/**/*.html'
        ],
        browsers: ['Chrome'],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            'app/**/*.js': ['coverage'],
            'app/**/*.html': ['ng-html2js']
        },
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },
        port: 9876,
        colors: true
    });
};