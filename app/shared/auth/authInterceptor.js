(function() {
    'use strict';

    angular
        .module('mahjong.auth')
        .factory('HttpRequestInterceptor', HttpRequestInterceptor);

    HttpRequestInterceptor.$inject = ['authFactory'];

    function HttpRequestInterceptor(authFactory)
    {
        return {
            'request': function(config) {

                if(!authFactory.isGuest()) {
                    config.headers['x-username'] = authFactory.getUsername();
                    config.headers['x-token']    = authFactory.getToken();
                }

                return config;
            }
        };
    }

})();