/**
 * Player List Controller
 */
angular.module('mahjong.games')
    .controller('PlayerListController', ['$scope', 'players', 'socket', function($scope, players, socket) {

        /**
         * Pass players data to view
         * @type array
         */
        $scope.players = players.data;

        /**
         * Listen to player joined event and add them to the players object
         */
        socket.on('playerJoined', function(res) {
            $scope.players.push(res);
        });

    }]);