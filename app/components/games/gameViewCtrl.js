(function() {
    'use strict';
    
    angular
        .module('mahjong.games')
        .controller('GameViewController', GameViewController);
    
    GameViewController.$inject = ['game', 'gameService', 'ngToast', 'socket', 'config'];
    
    function GameViewController(game, gameService, ngToast, socket, config)
    {
        /* jshint validthis: true */
        var vm = this;

        vm.game = game.data;
        vm.startGame = startGame;
        vm.canJoinGame = canJoinGame;
        vm.joinGame = joinGame;

        function startGame()
        {
            gameService.start(vm.game._id).then(function(res) {
                ngToast.create({className: 'success', content: res.data});
            }, function(res) {
                ngToast.create({className: 'warning', content: res.data.message});
            });
        }

        function canJoinGame() {
            return gameService.canJoinGame(vm.game);
        }

        function joinGame() {
            gameService.join(vm.game._id).then(function(res) {
                ngToast.create("Game joined!");
            }, function(res) {
                ngToast.create({className: 'warning', content: res.data.message});
            });
        }

        // Initialize dynamic socket endpoint
        var socketEndPoint = config.apiUrl + '?gameId='+vm.game._id;
        socket.initialize(io(socketEndPoint));
    }
})();