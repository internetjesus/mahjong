/**
 * Template factory
 */
angular.module('mahjong.games').factory('templateFactory', ['config', '$http', function(config, $http) {

    var templateFactory = {};

    /**
     * Get a list of all game templates
     *
     * @returns {*}
     */
    templateFactory.getAll = function()
    {
        return $http({method: 'GET', url: config.apiUrl + '/GameTemplates'});
    };

    return templateFactory;
}]);