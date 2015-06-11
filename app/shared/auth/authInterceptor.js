/**
 *
 */
angular.module('mahjong.auth').factory('HttpRequestInterceptor', ['$q', '$log', 'authFactory', function($q, $log, authFactory) {
    return {

        /**
         * Append token and username to the outgoing request
         *
         * @param config
         * @returns {*}
         */
        'request': function(config) {

            if(!authFactory.isGuest()) {
                config.headers['x-username'] = authFactory.getUsername();
                config.headers['x-token']    = authFactory.getToken();
            }

            return config;
        }
    };
}]);