/**
 * Game List Controller
 */
angular.module('mahjong.games')
    .controller('GameListController', ['$scope', 'games', 'gameFactory', 'ngToast', function($scope, games, gameFactory, ngToast) {
        $scope.sortType     = 'createdOn';
        $scope.sortReverse  = true;

        /**
         * Games filter object
         * @type {{createdBy: {name: string}, state: string, gameTemplate: {id: string}}}
         */
        $scope.gamesFilter  = {
            'createdBy' : {
                'name' : ''
            },
            'state' : '',
            'gameTemplate' : {
                'id' : ''
            }
        };

        /**
         * Join a game
         * @param id
         */
        $scope.joinGame = function(id) {
            gameFactory.join(id).then(function(response) {
                ngToast.create("Game joined. Redirect...");
            }, function(response) {
                ngToast.create({className: 'warning', content: response.data.message});
            });
        };

        $scope.games = games.data;
    }]);

/**
 * Game View Controller
 */
angular.module('mahjong.games').controller('GameViewController', ['$scope', 'game', 'players', 'tiles', function($scope, game, players, tiles) {
    $scope.game     = game.data;
    $scope.players  = players.data;
    $scope.tiles    = tiles.data;
}]);

/**
 * Game Create Controller
 */
angular.module('mahjong.games').controller('GameCreateController', ['$scope', function($scope) {

}]);