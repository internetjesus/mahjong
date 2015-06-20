(function() {
    'use strict';

    angular
        .module('mahjong.games')
        .controller('GameListController', GameListController);

    GameListController.$inject = ['templates', 'gameService', 'ngToast', '$state'];

    function GameListController(templates, gameService, ngToast, $state)
    {
        var vm = this;

        vm.sortType = 'createdOn';
        vm.sortReverse = true;
        vm.bigTotalItems = 0;
        vm.currentPage = 1;
        vm.maxSize = 5;
        vm.gamesFilter  = {
            'createdBy' : '',
            'state' : '',
            'gameTemplate' : ''
        };

        vm.games = null;
        vm.templates = {};

        vm.pageChanged = pageChanged;
        vm.joinGame = joinGame;
        vm.canJoinGame = canJoinGame;
        vm.loadGames = loadGames;

        init();

        function init()
        {
            vm.templates = templates.data;
            loadGames();
        }

        function pageChanged()
        {
            vm.loadGames();
        }

        function loadGames()
        {
            gameService
                .getAll(12, vm.currentPage, vm.gamesFilter.gameTemplate, vm.gamesFilter.state, vm.gamesFilter.createdBy)
                .success(function(response, status, headers) {
                    vm.bigTotalItems = parseInt(headers('X-total-count'));
                    vm.games = response;
                });
        }

        function joinGame(id)
        {
            gameService
                .join(id)
                .then(function(res) {
                    ngToast.create("Game joined. Redirect...");
                    $state.go('mahjong.view.players', { gameId : id });
                }, function(res) {
                    ngToast.create({className: 'warning', content: res.data.message});
                });
        }

        function canJoinGame(game)
        {
            return gameService.canJoinGame(game);
        }
    }
})();