/**
 * App routes
 */
angular.module('mahjong').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /games
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
                authFactory.store($stateParams.username, $stateParams.token);

                // Redirect to game list
                $state.go('mahjong.games');
            }],
            data: {
                requiredLogin: false
            }
        })
        .state('mahjong.games', {
            url: '/games',
            templateUrl:'app/components/games/gameList.html',
            controller: 'GameListController',
            resolve: {
                games:  ['gameFactory', function(gameFactory){
                    return gameFactory.getAll(100, 1, '', '');
                }]
            },
            data: {
                requiredLogin: false
            }
        })
        .state('mahjong.view', {
            url: '/games/:gameId',
            templateUrl:'app/components/games/gameView.html',
            controller: 'GameViewController',
            resolve: {
                game:  ['gameFactory', '$stateParams', 'ngToast', '$state', function(gameFactory, $stateParams, ngToast, $state){
                    return gameFactory.getById($stateParams.gameId).then(function(r) {
                        return r;
                    }, function(r) {
                        ngToast.create({className: 'warning', content: r.data.message});
                        $state.go('mahjong.games');
                    });
                }],
                players:  ['gameFactory', '$stateParams', 'ngToast', '$state', function(gameFactory, $stateParams, ngToast, $state){
                    return gameFactory.getGamePlayers($stateParams.gameId).then(function(r) {
                        return r;
                    }, function(r) {
                        ngToast.create({className: 'warning', content: r.data.message});
                        $state.go('mahjong.games');
                    });
                }],
                tiles:  ['gameFactory', '$stateParams', 'ngToast', '$state', function(gameFactory, $stateParams, ngToast, $state){
                    return gameFactory.getGameTiles($stateParams.gameId).then(function(r) {
                        return r;
                    }, function(r) {
                        ngToast.create({className: 'warning', content: r.data.message});
                        $state.go('mahjong.games');
                    });
                }]
            },
            data: {
                requiredLogin: true
            }
        })
        .state('mahjong.create', {
            url: '/new',
            templateUrl: 'app/components/games/gameCreate.html',
            controller: 'GameCreateController',
            data: {
                requiredLogin: true
            }
        });
}]);
