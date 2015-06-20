(function() {
    
    angular
        .module('mahjong.games')
        .controller('GameCreateController', GameCreateController);
    
    GameCreateController.$inject = ['$state', 'gameService', 'ngToast', 'templates'];
    
    function GameCreateController($state, gameService, ngToast, templates)
    {
        var vm = this;
        
        vm.game = {};
        vm.templates = {};
        vm.createGame = createGame;

        init();

        function init()
        {
            vm.templates = templates.data;
        }

        function createGame(isValid)
        {
            if (isValid) {
                gameService.createNew(vm.game.templateName, vm.game.minPlayers, vm.game.maxPlayers).then(function(response) {
                    ngToast.create({className: 'success', content: 'Game created! Have fun'})
                    $state.go('mahjong.view.board', { gameId : response.data._id });
                }, function(res) {
                    ngToast.create({className: 'warning', content: res.data.message})
                });
            }
        }
    }
})();