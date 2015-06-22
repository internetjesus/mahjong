(function() {
    'use strict';

    angular
        .module('mahjong.games')
        .factory('gameService', gameService);

    gameService.$inject = ['config', '$http', 'authFactory'];

    function gameService(config, $http, authFactory)
    {
        var service = {
            getAll: getAll,
            getById: getById,
            createNew: createNew,
            getGamePlayers: getGamePlayers,
            getGameTiles: getGameTiles,
            start: start,
            canJoinGame: canJoinGame,
            match: match,
            join: join
        };

        return service;

        function getAll(pageSize, pageIndex, gameTemplate, state, createdBy)
        {
            var filter = {
                'pageSize' : pageSize,
                'pageIndex': pageIndex,
                'gameTemplate': gameTemplate,
                'state' : state,
                'createdBy' : createdBy
            };

            return $http({method: 'GET', url: config.apiUrl + '/Games', params: filter});
        }

        function getById(id)
        {
            return $http({method: 'GET', url: config.apiUrl + '/Games/' + id});
        }

        function createNew(template, minPlayers, maxPlayers)
        {
            var postBody = {
                templateName : template,
                minPlayers : minPlayers,
                maxPlayers : maxPlayers
            };

            return $http({method: 'POST', url: config.apiUrl + '/Games', data: postBody});
        }

        function getGamePlayers(id)
        {
            return $http({method: 'GET', url: config.apiUrl + '/Games/' + id + '/Players'});
        }

        function getGameTiles(id, matched)
        {
            var matched = (matched) ? 'true' : 'false';
            return $http({method: 'GET', url: config.apiUrl + '/Games/' + id + '/Tiles?matched='+matched});
        }

        function start(id)
        {
            return $http({method: 'POST', url: config.apiUrl + '/Games/' + id + '/Start', data: {}});
        }

        function canJoinGame(game)
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

        function match(gameId, tileOneId, tileTwoId)
        {
            var postBody = {
                tile1Id : tileOneId,
                tile2Id : tileTwoId
            };

            return $http({method: 'POST', url: config.apiUrl + '/Games/'+gameId+'/Tiles/matches', data: postBody});
        }

        function join(id)
        {
            return $http({method: 'POST', url: config.apiUrl + '/Games/' + id + '/Players'});
        }
    }
})();