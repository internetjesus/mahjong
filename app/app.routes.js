(function() {
    'use strict';

    angular
        .module('mahjong')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider)
    {
        $urlRouterProvider.otherwise("/games");

        $stateProvider
            .state('mahjong', {
                url: '',
                abstract: true,
                templateUrl: 'app/shared/base/baseMaster.html',
                controller: 'BaseController'
            })
            .state('callback', {
                url: '/callback?username&token',
                template: '',
                controller: ['$scope', '$state', '$stateParams','authFactory', function($scope, $state, $stateParams, authFactory) {
                    // @TODO Check if the params are correct..
                    authFactory.store($stateParams.username, $stateParams.token);
                    $state.go('mahjong.games');
                }]
            })
            .state('mahjong.games', {
                url: '/games',
                templateUrl:'app/components/games/gameList.html',
                controller: 'GameListController as vm',
                resolve: {
                    templates: ['templateService', function(templateService) {
                        return templateService.getAll();
                    }]
                }
            })
            .state('mahjong.view', {
                url: '/games/:gameId',
                abstract: true,
                templateUrl: 'app/components/games/gameView.html',
                controller: 'GameViewController as vm',
                resolve: {
                    game:  ['gameService', '$stateParams', 'ngToast', '$state', function(gameService, $stateParams, ngToast, $state) {

                        return gameService.getById($stateParams.gameId).then(function(r) {
                            return r;
                        }, function(r) {
                            ngToast.create({className: 'warning', content: r.data.message});
                            $state.go('mahjong.games');
                        });

                    }]
                }
            })
            .state('mahjong.view.board', {
                url: '/board',
                templateUrl: 'app/components/games/gameBoard.html',
                controller: 'GameBoardController as vm',
                resolve: {
                    tiles:  ['gameService', '$state', 'game', function(gameService, $state, game){
                        if (game.data.state != 'open') {
                            return gameService.getGameTiles(game.data._id, false).then(function (r) {
                                return r;
                            });
                        } else {
                            return null;
                        }
                    }]
                }
            })
            .state('mahjong.view.players', {
                url: '/players',
                templateUrl: 'app/components/players/playerList.html',
                controller: 'PlayerListController as vm',
                resolve: {
                    players:  ['gameService', '$stateParams', 'ngToast', '$state', function(gameService, $stateParams, ngToast, $state){
                        return gameService.getGamePlayers($stateParams.gameId).then(function(r) {
                            return r;
                        }, function(r) {
                            ngToast.create({className: 'warning', content: r.data.message});
                            $state.go('mahjong.games');
                        });
                    }]
                }
            })
            .state('mahjong.view.matches', {
                url: '/matches',
                templateUrl: 'app/components/games/gameMatches.html',
                controller: 'GameMatchesController',
                resolve: {
                    matchedTiles:  ['gameService', '$stateParams', function(gameService, $stateParams){
                        return gameService.getGameTiles($stateParams.gameId, true).then(function(r) {
                            return r;
                        }, function(r) {
                            return null;
                        });
                    }]
                }
            })
            .state('mahjong.create', {
                url: '/new',
                templateUrl: 'app/components/games/gameCreate.html',
                controller: 'GameCreateController as vm',
                resolve: {
                    templates: ['templateService', function(templateService) {
                        return templateService.getAll();
                    }]
                }
            });
    }
})();