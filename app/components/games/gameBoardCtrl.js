/**
 * Game board controller
 */
angular.module('mahjong.games')
    .controller('GameBoardController', ['$scope', 'socket', 'tiles', 'matchedTiles', 'gameFactory', function($scope, socket, tiles, matchedTiles, gameFactory) {

        /**
         * Matched tiles
         * @type Array
         */
        $scope.matchedTiles = (matchedTiles) ? matchedTiles.data : null;

        /**
         * Non matched Tiles
         * @type Array
         */
        $scope.tiles        = (tiles) ? tiles.data : null;

        /**
         * Clicked tiles
         * @type {Array}
         */
        $scope.matchQueue = [];

        /**
         * Check for match
         * @param tile
         */
        $scope.checkMatch = function(tile)
        {
            $scope.matchQueue.push(tile);

            if ($scope.matchQueue.length == 2) {
                // Send match to API
                gameFactory.match($scope.game._id, $scope.matchQueue[0]._id, $scope.matchQueue[1]._id).then(function (res) {
                    $scope.matchQueue = [];
                }, function(res) {
                    $scope.matchQueue = [];
                });
            }

            console.log($scope.matchQueue);
        };


        /**
         * Listen to match even
         */
        socket.on('match', function(res) {
            console.log('A match has been made! Response from server:', res);

            for (var i = 0, len = $scope.tiles.length; i < len; i++) {
                if ($scope.tiles[i]._id == res[0]._id
                    || $scope.tiles[i]._id == res[0].match.otherTileId)
                {
                    $scope.tiles.splice(i, 1);
                }
            }
        });

        /**
         * Load tiles on game start socket event
         */
        socket.on('start', function(res) {
            $scope.game.state = 'playing';

            gameFactory.getGameTiles($scope.game._id).then(function(res) {
                $scope.tiles = res.data;
            }, function(res) {
                console.log('Tiles could not be loaded', res);
            });
        });

        /**
         * Listen to game end event
         */
        socket.on('end', function(res) {
            console.log('Game has ended! Response from server:', res);
        });

    }]);