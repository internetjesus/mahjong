(function() {
    'use strict';
    
    angular
        .module('mahjong.games')
        .controller('GameViewController', GameViewController);
    
    GameViewController.$inject = ['game', 'gameService', 'ngToast'];
    
    function GameViewController(game, gameService, ngToast)
    {
        /* jshint validthis: true */
        var vm = this;

        vm.game = {};
        vm.startGame = startGame;
        vm.canJoinGame = canJoinGame;
        vm.joinGame = joinGame;

        init();

        function init()
        {
            vm.game = game.data;
        }

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
    }
})();