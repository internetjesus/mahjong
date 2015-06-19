/**
 * Game List Controller
 */
angular.module('mahjong.games')
    .controller('GameListController', ['$scope', 'games', 'templates', 'gameFactory', 'ngToast', '$state', 'authFactory', function($scope, games, templates, gameFactory, ngToast, $state, authFactory) {
        $scope.sortType     = 'createdOn';
        $scope.sortReverse  = true;

        $scope.templates = templates.data;

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
            gameFactory.join(id).then(function(res) {
                ngToast.create("Game joined. Redirect...");
                $state.go('mahjong.view.players', { gameId : id });
            }, function(res) {
                ngToast.create({className: 'warning', content: res.data.message});
            });
        };

        /**
         * Whether or not the current auth user can join this game
         * @param game
         */
        $scope.canJoinGame = function(game) {
            return gameFactory.canJoinGame(game);
        };

        $scope.games = games.data;
    }]);

/**
 * Game Create Controller
 */
angular.module('mahjong.games').controller('GameCreateController', ['$scope', '$state', 'gameFactory', 'ngToast', 'templates', function($scope, $state, gameFactory, ngToast, templates) {

    /**
     * The new game object
     * @type {{}}
     */
    $scope.game = {};

    /**
     * Template list
     * @type {Array}
     */
    $scope.templates = templates.data;

    /**
     * Create a new game
     * @param form
     */
    $scope.createGame = function(isValid) {

        if (isValid) {
            gameFactory.createNew($scope.game.templateName, $scope.game.minPlayers, $scope.game.maxPlayers).then(function(response) {
                ngToast.create({className: 'success', content: 'Game created! Have fun'})
                $state.go('mahjong.view.board', { gameId : response.data._id });
            }, function(res) {
                ngToast.create({className: 'warning', content: res.data.message})
            });
        }
    }
}]);