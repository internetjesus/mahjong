/**
 * Game List Controller
 */
angular.module('mahjong.games')
    .controller('GameListController', ['$scope', 'templates', 'gameFactory', 'ngToast', '$state', 'authFactory', function($scope, templates, gameFactory, ngToast, $state, authFactory) {
        $scope.sortType      = 'createdOn';
        $scope.sortReverse   = true;

        $scope.bigTotalItems = 0;
        $scope.currentPage = 1;
        $scope.maxSize = 5;

        $scope.pageChanged = function() {
            $scope.loadGames();
        };

        $scope.games = null;
        $scope.templates = templates.data;

        /**
         * Load games from API
         */
        $scope.loadGames = function()
        {
            gameFactory.getAll(12, $scope.currentPage, $scope.gamesFilter.gameTemplate, $scope.gamesFilter.state, $scope.gamesFilter.createdBy).success(function(response, status, headers) {
                $scope.bigTotalItems = parseInt(headers('X-total-count'));
                $scope.games = response;
            });
        };

        /**
         * Games filter object
         * @type {{createdBy: {name: string}, state: string, gameTemplate: {id: string}}}
         */
        $scope.gamesFilter  = {
            'createdBy' : '',
            'state' : '',
            'gameTemplate' : ''
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


        $scope.loadGames();
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