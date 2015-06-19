/**
 * Game board controller
 */
angular.module('mahjong.games')
    .controller('GameBoardController', ['$scope', 'socket', 'tiles', 'gameFactory', 'ngToast', function($scope, socket, tiles, gameFactory, ngToast) {

        /**
         * The tiles
         * @type Array
         */
        $scope.tiles = (tiles) ? tiles.data : null;

        /**
         * Clicked tiles
         * @type {Array}
         */
        $scope.tileSet = [];

        /**
         * Check for match
         * @param tile
         */
        $scope.tileClick = function(tile)
        {
            $scope.tileSet.push(tile);

            if ($scope.tileSet.length == 2) {

                // If one of the tiles is not alright then fuck'em. Don't send the request
                if (!$scope.tileIsAlright($scope.tileSet[0]) || !$scope.tileIsAlright($scope.tileSet[1])) {
                    $scope.tileSet = [];
                    return false;
                }

                // The tiles look good, attempt to send them to the API and see what they think of it
                gameFactory.match($scope.game._id, $scope.tileSet[0]._id, $scope.tileSet[1]._id).then(function (res) {

                    ngToast.create({className:'success', content: "Congratulations! You made a match"});
                    $scope.tileSet = [];
                }, function(res) {

                    ngToast.create({className:'info', content: res.data.message});
                    $scope.tileSet = [];
                });
            }
        };

        /**
         * Check whether or not a tile has nothing on the left, right and top
         */
        $scope.tileIsAlright = function(tile)
        {
            return true;
        };

        /**
         * Listen to tile match even
         * @note use a filter for this and maybe add an animation to it with qLite
         */
        socket.on('match', function(res)
        {
            for (var i = 0; i < $scope.tiles.length; i++)
            {
                if ($scope.tiles[i]._id == res[0]._id)
                {
                    $scope.tiles.splice(i, 1);
                }
                else if ($scope.tiles[i]._id == res[0].match.otherTileId)
                {
                    $scope.tiles.splice(i, 1);
                }
            }
        });

        /**
         * Load tiles on game start socket event
         */
        socket.on('start', function(res)
        {
            $scope.game.state = 'playing';

            gameFactory.getGameTiles($scope.game._id).then(function(res) {
                $scope.tiles = res.data;
            });
        });

        /**
         * Listen to game end event
         */
        socket.on('end', function(res)
        {
            ngToast.create({className:'info', content: 'This game has ended!'});
        });
    }]);