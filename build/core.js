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
                        return null;
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

/**
 * Game module
 */
angular.module('mahjong.games', []);
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
/**
 * Game factory
 */
angular.module('mahjong.games').factory('gameFactory', ['config', '$http', '$q', function(config, $http, $q) {

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


    gameFactory.test = function(id, action)
    {
        return $http({method: 'GET', url: config.apiUrl + '/test/'+id+'/'+action});
    };

    ///**
    // * Start AND load the games tiles and all
    // *
    // * @param id
    // * @returns {*}
    // */
    //gameFactory.startAndLoad = function(id)
    //{
    //    var deferred = $q.defer();
    //    var promises = [];
    //
    //    // Don't add start to the $q because if the game doesn't start
    //    // we don't want the rest of the requests to be made
    //    gameFactory.start(id).then(function(response) {
    //        promises.push(gameFactory.getById(id));
    //        promises.push(gameFactory.getGameTiles(id));
    //    }, function(response) {
    //        console.log('Could not start game!');
    //    });
    //
    //    $q.all(promises).then(function(results) {
    //        deferred.resolve({objects : results});
    //    }, function(err) {
    //        console.log('Cannot handle one of the requests. Following error occured', err);
    //    });
    //
    //    return deferred.promise;
    //};

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
            elem.css('z-index', scope.tile.zPos);
            elem.css('top', (scope.tile.yPos * 37.5) + 'px');
            elem.css('left', (scope.tile.xPos * 35.5) + 'px');

            elem.bind('mouseover', function() {
                elem.css('cursor', 'pointer');
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