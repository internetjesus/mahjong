/**
 * Game View Controller
 */
angular.module('mahjong.games')
    .controller('GameViewController', ['$scope', 'game', 'gameFactory', 'ngToast', 'socket', 'config', '$state', function($scope, game, gameFactory, ngToast, socket, config, $state) {

        /**
         * The game object.
         * @type Object
         */
        $scope.game = game.data;

        /**
         * Start the game
         */
        $scope.startGame = function()
        {
            gameFactory.start($scope.game._id).then(function(res) {
                ngToast.create({className: 'success', content: res.data});
            }, function(res) {
                ngToast.create({className: 'warning', content: res.data.message});
            });
        };

        /**
         * Whether or not the current auth user can join this game
         * @param game
         */
        $scope.canJoinGame = function() {
            return gameFactory.canJoinGame($scope.game);
        };

        /**
         * Join a game
         * @param id
         */
        $scope.joinGame = function() {
            gameFactory.join($scope.game._id).then(function(res) {
                ngToast.create("Game joined!");
            }, function(res) {
                ngToast.create({className: 'warning', content: res.data.message});
            });
        };

        // Initialize dynamic socket endpoint
        var socketEndPoint = config.apiUrl + '?gameId='+$scope.game._id;
        socket.initialize(io(socketEndPoint));


    }]);
