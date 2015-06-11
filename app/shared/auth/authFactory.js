/**
 * Auth factory
 */
angular.module('mahjong.auth')
    .factory('authFactory', ['config', 'localStorageService', function(config, localStorageService) {

        var authFactory = {};

        authFactory.username = '';

        authFactory.initialize = function () {
            authFactory.username = authFactory.getUsername();
        };

        /**
         * Is guest
         * @returns {boolean}
         */
        authFactory.isGuest = function()
        {
            return (localStorageService.get('token') == null);
        };

        /**
         * Store user oAuth data
         */
        authFactory.store = function(username, token)
        {
            authFactory.username = username;
            localStorageService.set('username', username);
            localStorageService.set('token', token);
        };

        /**
         * Log the user out
         */
        authFactory.destroy = function()
        {
            authFactory.username = '';
            localStorageService.remove('username', 'token');
            localStorageService.clearAll();

            return true;
        };

        /**
         * Get the username
         * @returns {*}
         */
        authFactory.getUsername = function()
        {
            return localStorageService.get('username');
        };

        /**
         * Get the token
         * @returns {*}
         */
        authFactory.getToken = function()
        {
            return localStorageService.get('token');
        };

        return authFactory;
    }]);