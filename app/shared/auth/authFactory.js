(function() {
    'use strict';

    angular
        .module('mahjong.auth')
        .factory('authFactory', authFactory);

    authFactory.$inject = ['config', 'localStorageService'];

    function authFactory(config, localStorageService)
    {
        var username = '';

        var factory = {
            username : username,
            initialize : initialize,
            isGuest : isGuest,
            store : store,
            destroy : destroy,
            getUsername : getUsername,
            getToken : getToken
        };

        return factory;

        function initialize()
        {
            username = getUsername();
        }

        function isGuest()
        {
            return (localStorageService.get('token') == null);
        }

        function store(oauthName, token)
        {
            username = oauthName;

            localStorageService.set('username', username);
            localStorageService.set('token', token);
        }

        function destroy()
        {
            username = '';
            localStorageService.remove('username', 'token');
            localStorageService.clearAll();

            return true;
        }

        function getUsername()
        {
            return localStorageService.get('username');
        }

        function getToken()
        {
            return localStorageService.get('token');
        }
    }
})();