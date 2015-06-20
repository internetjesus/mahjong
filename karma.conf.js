module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'app/**/*.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'test/*.spec.js',
            'app/**/*.html'
        ],
        browsers: ['Chrome']
    });
};