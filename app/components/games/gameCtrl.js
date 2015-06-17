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
angular.module('mahjong.games').controller('GameViewController', [
    '$scope',
    'game',
    'players',
    'tiles',
    'gameFactory',
    'ngToast',
    'socket',
    'config',
    function($scope, game, players, tiles, gameFactory, ngToast, socket, config) {

    /**
     * The game object.
     * @type Object
     */
    $scope.game     = game.data;

    /**
     * The players (this is in a different variable because we append players
     * to it from the socket
     * @type Object
     */
    $scope.players  = players.data;

    // Check if the tiles are represent!
    if (typeof(tiles) == 'object' && tiles != null) {
        $scope.tiles = tiles.data;
    }

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
     * Test socket
     */
    $scope.testSocket = function()
    {
        gameFactory.test($scope.game._id, 'match').then(function(res) {
            console.log('Response from test request', res);
        });
    };

    var socketEndPoint = config.apiUrl + '?gameId='+$scope.game._id;
    socket.initialize(io(socketEndPoint));

    /**
     * Listen to start event on socket
     */
    socket.on('start', function(res) {
        // Load game tiles
        ngToast.create({className: 'info', content: 'Game started! Loading tiles...'});

        gameFactory.getGameTiles($scope.game._id).then(function(res) {
            $scope.tiles = res.data;

            ngToast.create({className: 'info', content: 'Tiles loaded! Enjoy the game'});
        });
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

                $state.go('mahjong.view', { gameId : response.data._id });
                // ngToast
                // Redirect: response.data._id
            }, function(response) {
                console.log('het ging fout', response);
            });
        }
    }
}]);