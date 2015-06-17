/**
 * Game factory
 */
angular.module('mahjong.games').factory('gameFactory', ['config', '$http', '$q', function(config, $http, $q) {

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


    gameFactory.test = function(id, action)
    {
        return $http({method: 'GET', url: config.apiUrl + '/test/'+id+'/'+action});
    };

    ///**
    // * Start AND load the games tiles and all
    // *
    // * @param id
    // * @returns {*}
    // */
    //gameFactory.startAndLoad = function(id)
    //{
    //    var deferred = $q.defer();
    //    var promises = [];
    //
    //    // Don't add start to the $q because if the game doesn't start
    //    // we don't want the rest of the requests to be made
    //    gameFactory.start(id).then(function(response) {
    //        promises.push(gameFactory.getById(id));
    //        promises.push(gameFactory.getGameTiles(id));
    //    }, function(response) {
    //        console.log('Could not start game!');
    //    });
    //
    //    $q.all(promises).then(function(results) {
    //        deferred.resolve({objects : results});
    //    }, function(err) {
    //        console.log('Cannot handle one of the requests. Following error occured', err);
    //    });
    //
    //    return deferred.promise;
    //};

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