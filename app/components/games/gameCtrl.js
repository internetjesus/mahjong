/**
 * Game List Controller
 */
angular.module('mahjong.games')
    .controller('GameListController', ['$scope', 'games', 'gameFactory', 'ngToast', '$state', 'authFactory', function($scope, games, gameFactory, ngToast, $state, authFactory) {
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
 * Game Board Controller
 */
angular.module('mahjong.games')
    .controller('GameViewController', ['$scope', 'game', 'gameFactory', 'ngToast', 'socket', 'config', '$state', function($scope, game, gameFactory, ngToast, socket, config, $state) {

    /**
     * The game object.
     * @type Object
     */
    $scope.game = game.data;

    /**
     * Start the game
     */
    $scope.startGame = function()
    {
        gameFactory.start($scope.game._id).then(function(res) {
            ngToast.create({className: 'success', content: res.data});
        }, function(res) {
            ngToast.create({className: 'warning', content: res.data.message});
        });
    };

    /**
     * Whether or not the current auth user can join this game
     * @param game
     */
    $scope.canJoinGame = function() {
        return gameFactory.canJoinGame($scope.game);
    };

    /**
     * Join a game
     * @param id
     */
    $scope.joinGame = function() {
        gameFactory.join($scope.game._id).then(function(res) {
            ngToast.create("Game joined!");
        }, function(res) {
            ngToast.create({className: 'warning', content: res.data.message});
        });
    };

    // Initialize socket endpoint
    var socketEndPoint = config.apiUrl + '?gameId='+$scope.game._id;
    socket.initialize(io(socketEndPoint));

    /**
     * Listen to start event on socket
     */
    socket.on('start', function(res) {
        console.log('Game started event triggered', res);
        console.log($state.current);

        // Update game state
        $scope.game.state = 'playing';

        if ($state.current == 'mahjong.view.board') {
            $state.go($state.current, {}, {reload: true});
        } else {
            $state.go('mahjong.view.board', { gameId : $scope.game._id });
        }
    });

    /**
     * Listen to game end event
     */
    socket.on('end', function(res) {
        console.log('Game has ended! Response from server:', res);
    });

    /**
     * Listen to player joined event
     */
    socket.on('playerJoined', function(res) {
        $scope.players.push(res);
        console.log('Player joined this game! Response from server:', res);
    });

    /**
     * Listen to match even
     */
    socket.on('match', function(res) {
        console.log('A match has been made! Response from server:', res);
    });
}]);

/**
 * Game board controller
 */
angular.module('mahjong.games').controller('GameBoardController', ['$scope', 'tiles', function($scope, tiles) {


    $scope.tiles = (tiles == null) ? null : tiles.data;
}]);

/**
 * Game Create Controller
 */
angular.module('mahjong.games').controller('GameCreateController', ['$scope', '$state', 'gameFactory', 'ngToast', function($scope, $state, gameFactory, ngToast) {

    /**
     * The new game object
     * @type {{}}
     */
    $scope.game = {};

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