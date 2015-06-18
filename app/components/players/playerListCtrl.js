/**
 * Player List Controller
 */
angular.module('mahjong.games')
    .controller('PlayerListController', ['$scope', 'players', function($scope, players) {

        /**
         * Pass players data to view
         * @type array
         */
        $scope.players = players.data;

    }]);