/**
 * Game factory
 */
angular.module('mahjong.games').factory('gameFactory', ['config', '$http', function(config, $http) {

    var gameFactory = {};

    /**
     * Get a list of all games
     *
     * @param pageSize
     * @param pageIndex
     * @param gameTemplate
     * @param state
     * @returns {*}
     */
    gameFactory.getAll = function(pageSize, pageIndex, gameTemplate, state)
    {
        var filter = {
            'pageSize' : pageSize,
            'pageIndex': pageIndex,
            'gameTemplate': gameTemplate,
            'state' : state
        };

        return $http({method: 'GET', url: config.apiUrl + '/Games?pageSize=' + filter.pageSize});
    };

    /**
     * Get a game by id
     *
     * @param id
     */
    gameFactory.getById = function(id)
    {
        return $http({method: 'GET', url: config.apiUrl + '/Games/' + id});
    };

    /**
     * Get game players
     *
     * @param id
     * @returns {*}
     */
    gameFactory.getGamePlayers = function(id)
    {
        return $http({method: 'GET', url: config.apiUrl + '/Games/' + id + '/Players'})
    };

    /**
     * Get game tiles
     */
    gameFactory.getGameTiles = function(id)
    {
        return $http({method: 'GET', url: config.apiUrl + '/Games/' + id + '/Tiles'})
    };

    /**
     * Join a game
     *
     * @param id
     */
    gameFactory.join = function(id)
    {
        return $http({method: 'POST', url: config.apiUrl + '/Games/' + id + '/Players'})
    };

    return gameFactory;
}]);