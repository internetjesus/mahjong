(function() {
    'use strict';

    angular
        .module('mahjong.games')
        .factory('templateService', templateService);

    templateService.$inject = ['config', '$http'];

    function templateService(config, $http)
    {
        var service = {
            getAll : getAll
        };

        return service;

        function getAll()
        {
            return $http({method: 'GET', url: config.apiUrl + '/GameTemplates'});
        }
    }
})();