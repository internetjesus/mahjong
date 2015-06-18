/**
 * Game factory
 */
angular.module('mahjong.games').factory('gameFactory', ['config', '$http', '$q', 'authFactory', function(config, $http, $q, authFactory) {

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
     * Create a new game. Required authentication
     *
     * @param template
     * @param minPlayers
     * @param maxPlayers
     * @returns {*}
     */
    gameFactory.createNew = function(template, minPlayers, maxPlayers)
    {
        var postBody = {
            templateName : template,
            minPlayers : minPlayers,
            maxPlayers : maxPlayers
        };

        return $http({method: 'POST', url: config.apiUrl + '/Games', data: postBody});
    };

    /**
     * Get game players
     *
     * @param id
     * @returns {*}
     */
    gameFactory.getGamePlayers = function(id)
    {
        return $http({method: 'GET', url: config.apiUrl + '/Games/' + id + '/Players'});
    };

    /**
     * Get game tiles
     *
     * @param id
     * @returns {*}
     */
    gameFactory.getGameTiles = function(id)
    {
        return $http({method: 'GET', url: config.apiUrl + '/Games/' + id + '/Tiles'});
    };

    /**
     * Start a game. Requires the current auth session to be the games owner
     *
     * @param id
     */
    gameFactory.start = function(id)
    {
        return $http({method: 'POST', url: config.apiUrl + '/Games/' + id + '/Start', data: {}});
    };

    /**
     * Test a socket call
     *
     * @param id
     * @param action
     * @returns {*}
     */
    gameFactory.test = function(id, action)
    {
        return $http({method: 'GET', url: config.apiUrl + '/test/'+id+'/'+action});
    };

    /**
     * Checks if a user can join a game
     * @param game
     * @returns {boolean}
     */
    gameFactory.canJoinGame = function(game)
    {
        var canJoin = true;

        if (game.state != 'open' || game.players.length == game.maxPlayers) {
            canJoin = false;
        } else {
            for (var i = 0, len = game.players.length; i < len; i++) {
                if (game.players[i]._id == authFactory.getUsername()) {
                    canJoin = false;
                    break;
                }
            }
        }

        return canJoin;
    }

    /**
     * Join a game
     *
     * @param id
     */
    gameFactory.join = function(id)
    {
        return $http({method: 'POST', url: config.apiUrl + '/Games/' + id + '/Players'});
    };

    return gameFactory;
}]);