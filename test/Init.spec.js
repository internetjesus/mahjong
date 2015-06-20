var scope;
var gameFactory;
var gameController;

beforeEach(module('mahjong'));

beforeEach(inject(function($rootScope,$controller,$injector){
    scope = $rootScope.$new();

    templates = $injector.get("templateService");
    gameService = $injector.get("gameService");



    //GameListController.$inject = ['templates', 'gameService', 'ngToast', '$state'];

    gameListController = $controller("GameListController",{$scope:scope,GameFactory:gameFactory});
}));