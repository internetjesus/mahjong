'use strict';

/**
 * Define the app
 */
var mahjong;
mahjong = angular.module('mahjong', [
    'ui.router',
    'ui.bootstrap',

    'LocalStorageModule',
    'angular-loading-bar',

    'ngToast',

    'mahjong.games',
    'mahjong.auth'
]);

/**
 * Declare app constants
 */
mahjong.constant('config', {
    apiUrl: 'http://mahjongmayhem.herokuapp.com'
});

/**
 * Share the ui-router state across the root scope so it's available in every controller
 */
mahjong.run(['$rootScope', '$state', '$stateParams', 'authFactory', function ($rootScope, $state, $stateParams, authFactory) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    authFactory.initialize();
    $rootScope.auth = authFactory;
}]);

/**
 * Configure the ng toast
 */
mahjong.config(['ngToastProvider', function(ngToastProvider) {
    ngToastProvider.configure({
        animation: 'slide',
        timeout: 3000,
        dismissButton: true,
        dismissButtonHtml: '&times;',
        dismissOnClick: true,
        horizontalPosition: 'center',
        maxNumber: 3
    });
}]);

/**
 * Configure the loading bar to not show the spinner
 */
mahjong.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);

/**
 * Configure the local storage service provider
 */
mahjong.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('mahjong');
}]);

/**
 * Push custom request interceptor into the httpProvider
 */
mahjong.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('HttpRequestInterceptor');
}]);

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
                    return gameFactory.getAll(25, 1, '', '');
                }]
            },
            data: {
                requiredLogin: false
            }
        })
        .state('mahjong.view', {
            url: '/games/:gameId',
            abstract: true,
            templateUrl: 'app/components/games/gameView.html',
            controller: 'GameViewController',
            resolve: {
                game:  ['gameFactory', '$stateParams', 'ngToast', '$state', function(gameFactory, $stateParams, ngToast, $state){
                    return gameFactory.getById($stateParams.gameId).then(function(r) {
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
            controller: 'GameBoardController',
            resolve: {
                tiles:  ['gameFactory', '$stateParams', 'ngToast', '$state', function(gameFactory, $stateParams, ngToast, $state){
                    return gameFactory.getGameTiles($stateParams.gameId).then(function(r) {
                        return r;
                    }, function(r) {
                        //ngToast.create({className: 'warning', content: r.data.message});
                        return null;
                    });
                }]
            }
        })
        .state('mahjong.view.players', {
            url: '/players',
            templateUrl: 'app/components/players/playerList.html',
            controller: 'PlayerListController',
            resolve: {
                players:  ['gameFactory', '$stateParams', 'ngToast', '$state', function(gameFactory, $stateParams, ngToast, $state){
                    return gameFactory.getGamePlayers($stateParams.gameId).then(function(r) {
                        return r;
                    }, function(r) {
                        ngToast.create({className: 'warning', content: r.data.message});
                        $state.go('mahjong.games');
                    });
                }]
            }
        })
        .state('mahjong.view.matches', {

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

/**
 * Game module
 */
angular.module('mahjong.games', []);
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
/**
 * Game factory
 */
angular.module('mahjong.games').factory('gameFactory', ['config', '$http', '$q', 'authFactory', function(config, $http, $q, authFactory) {

    var gameFactory = {};

    /**
     * Get a list of all games
     *
     * @param pageSize
     * @param pageIndex
     * @param gameTemplate
     * @param state
     * @returns {*}
     */
    gameFactory.getAll = function(pageSize, pageIndex, gameTemplate, state)
    {
        var filter = {
            'pageSize' : pageSize,
            'pageIndex': pageIndex,
            'gameTemplate': gameTemplate,
            'state' : state
        };

        return $http({method: 'GET', url: config.apiUrl + '/Games?pageSize=' + filter.pageSize});
    };

    /**
     * Get a game by id
     *
     * @param id
     */
    gameFactory.getById = function(id)
    {
        return $http({method: 'GET', url: config.apiUrl + '/Games/' + id});
    };

    /**
     * Create a new game. Required authentication
     *
     * @param template
     * @param minPlayers
     * @param maxPlayers
     * @returns {*}
     */
    gameFactory.createNew = function(template, minPlayers, maxPlayers)
    {
        var postBody = {
            templateName : template,
            minPlayers : minPlayers,
            maxPlayers : maxPlayers
        };

        return $http({method: 'POST', url: config.apiUrl + '/Games', data: postBody});
    };

    /**
     * Get game players
     *
     * @param id
     * @returns {*}
     */
    gameFactory.getGamePlayers = function(id)
    {
        return $http({method: 'GET', url: config.apiUrl + '/Games/' + id + '/Players'});
    };

    /**
     * Get game tiles
     *
     * @param id
     * @returns {*}
     */
    gameFactory.getGameTiles = function(id)
    {
        return $http({method: 'GET', url: config.apiUrl + '/Games/' + id + '/Tiles'});
    };

    /**
     * Start a game. Requires the current auth session to be the games owner
     *
     * @param id
     */
    gameFactory.start = function(id)
    {
        return $http({method: 'POST', url: config.apiUrl + '/Games/' + id + '/Start', data: {}});
    };

    /**
     * Test a socket call
     *
     * @param id
     * @param action
     * @returns {*}
     */
    gameFactory.test = function(id, action)
    {
        return $http({method: 'GET', url: config.apiUrl + '/test/'+id+'/'+action});
    };

    /**
     * Checks if a user can join a game
     * @param game
     * @returns {boolean}
     */
    gameFactory.canJoinGame = function(game)
    {
        var canJoin = true;

        if (game.state != 'open' || game.players.length == game.maxPlayers) {
            canJoin = false;
        } else {
            for (var i = 0, len = game.players.length; i < len; i++) {
                if (game.players[i]._id == authFactory.getUsername()) {
                    canJoin = false;
                    break;
                }
            }
        }

        return canJoin;
    }

    /**
     * Join a game
     *
     * @param id
     */
    gameFactory.join = function(id)
    {
        return $http({method: 'POST', url: config.apiUrl + '/Games/' + id + '/Players'});
    };

    return gameFactory;
}]);
/**
 * Player List Controller
 */
angular.module('mahjong.games')
    .controller('PlayerListController', ['$scope', 'players', function($scope, players) {

        /**
         * Pass players data to view
         * @type array
         */
        $scope.players = players.data;

    }]);
/**
 * Tile directive
 */
angular.module('mahjong.games').directive('chooseTemplate', function() {
    return {
        name: 'chooseTemplate',
        restrict: 'E',
        replace: true,
        templateUrl: 'app/components/templates/chooseTemplateDirective.html',
        controller: ['$scope', 'templateFactory', function($scope, templateFactory) {
            templateFactory.getAll().then(function(response) {
                $scope.templates = response.data;
            });
        }],
        link: function(scope, elem, attrs) {

        }
    }
});
/**
 * Template factory
 */
angular.module('mahjong.games').factory('templateFactory', ['config', '$http', function(config, $http) {

    var templateFactory = {};

    /**
     * Get a list of all game templates
     *
     * @returns {*}
     */
    templateFactory.getAll = function()
    {
        return $http({method: 'GET', url: config.apiUrl + '/GameTemplates'});
    };

    return templateFactory;
}]);
/**
 * Tile directive
 */
angular.module('mahjong.games').directive('tile', function() {
    return {
        name: 'tile',
        restrict: 'E',
        replace: true,
        templateUrl: 'app/components/tiles/tileTemplate.html',
        controller: ['$scope', function($scope) {

        }],
        link: function(scope, elem, attrs) {
            // Calculate the z-index
            elem.css('z-index', (scope.tile.yPos ) + ((scope.tile.zPos+1) * 50) - scope.tile.xPos);

            // Calculate the x and y position
            var l = scope.tile.xPos * 35 + (scope.tile.zPos * 8);
            var t = scope.tile.yPos * 43 - (scope.tile.zPos * 8);

            elem.css('top', (t) + 'px');
            elem.css('left', (l) + 'px');

            // Bind the click function
            elem.bind('click', function() {
                elem.remove();
                console.log(scope.tile);
            });
        }
    }
});
/**
 * Authentication module
 */
angular.module('mahjong.auth', []);
/**
 * Auth factory
 */
angular.module('mahjong.auth')
    .factory('authFactory', ['config', 'localStorageService', function(config, localStorageService) {

        var authFactory = {};

        authFactory.username = '';

        authFactory.initialize = function () {
            authFactory.username = authFactory.getUsername();
        };

        /**
         * Is guest
         * @returns {boolean}
         */
        authFactory.isGuest = function()
        {
            return (localStorageService.get('token') == null);
        };

        /**
         * Store user oAuth data
         */
        authFactory.store = function(username, token)
        {
            authFactory.username = username;
            localStorageService.set('username', username);
            localStorageService.set('token', token);
        };

        /**
         * Log the user out
         */
        authFactory.destroy = function()
        {
            authFactory.username = '';
            localStorageService.remove('username', 'token');
            localStorageService.clearAll();

            return true;
        };

        /**
         * Get the username
         * @returns {*}
         */
        authFactory.getUsername = function()
        {
            return localStorageService.get('username');
        };

        /**
         * Get the token
         * @returns {*}
         */
        authFactory.getToken = function()
        {
            return localStorageService.get('token');
        };

        return authFactory;
    }]);
/**
 *
 */
angular.module('mahjong.auth').factory('HttpRequestInterceptor', ['$q', '$log', 'authFactory', function($q, $log, authFactory) {
    return {

        /**
         * Append token and username to the outgoing request
         *
         * @param config
         * @returns {*}
         */
        'request': function(config) {

            if(!authFactory.isGuest()) {
                config.headers['x-username'] = authFactory.getUsername();
                config.headers['x-token']    = authFactory.getToken();
            }

            return config;
        }
    };
}]);
/**
 * Base controller
 */
angular.module('mahjong').controller('BaseController', ['$scope', 'config', 'authFactory', function($scope, config, authFactory) {

    /**
     * The login url
     * @type {string}
     */
    $scope.oAuthUrl = config.apiUrl + '/auth/avans?callbackUrl=' + encodeURIComponent("http://localhost:8080/#/callback");

    /**
     * Destroy the local user data
     */
    $scope.signOut = function()
    {
        authFactory.destroy();
    }
}]);
/**
 * Socket factory
 */
angular.module('mahjong').factory('socket', ['$rootScope', function($rootScope) {
    var socket = null;
    return {
        initialize: function(connection) {
            socket = connection;
        },
        on: function (eventName, callback) {
            if (socket == null) {
                return;
            }

            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            if (socket == null) {
                return;
            }

            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
}]);