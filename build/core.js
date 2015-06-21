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
                        return gameService.getById($stateParams.gameId);
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
                            return gameService.getGameTiles(game.data._id, false);
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
                        return gameService.getGamePlayers($stateParams.gameId);
                    }]
                }
            })
            .state('mahjong.view.matches', {
                url: '/matches',
                templateUrl: 'app/components/games/gameMatches.html',
                controller: 'GameMatchesController',
                resolve: {
                    matchedTiles:  ['gameService', '$stateParams', function(gameService, $stateParams){
                        return gameService.getGameTiles($stateParams.gameId, true);
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
(function() {
    'use strict';

    angular.module('mahjong.games', []);

})();

(function() {
    'use strict';

    angular
        .module('mahjong.games')
        .controller('GameBoardController', GameBoardController);

    GameBoardController.$inject = ['game', 'socket', 'tiles', 'gameService', 'ngToast', 'authFactory', '$state'];

    function GameBoardController(game, socket, tiles, gameService, ngToast, authFactory, $state)
    {
        /* jshint validthis: true */
        var vm = this;

        vm.game = {};
        vm.tiles = {};
        vm.tileSet = [];
        vm.tileClick = tileClick;
        vm.canPlay = false;

        init();

        function init()
        {
            if (game == null) {
                $state.go('mahjong.games');
            }

            vm.game = game.data;
            vm.tiles = (tiles) ? tiles.data : null;

            vm.canPlay = isAllowedToPlay();

            if (!vm.canPlay && vm.game.state == 'playing') ngToast.create({className: 'info', content: 'You are spectating this game! You have no power here...'});
        }

        function isAllowedToPlay()
        {
            if (vm.game.state == 'playing') {
                var player = _.find(vm.game.players, function(player) {
                    return player._id == authFactory.getUsername();
                });

                return (player != null);
            }

            return false;
        }

        function tileClick(tile)
        {
            if (!vm.canPlay) return false;

            if (!tileIsBlocked(tile)) {

                vm.tileSet.push(tile);
                tile.clicked = true;

                if (vm.tileSet.length == 2) {

                    if (checkTileSetIsMatch()) {
                        gameService.match(vm.game._id, vm.tileSet[0]._id, vm.tileSet[1]._id).then(function (res) {

                            clearTileSet();

                        }, function(res) {

                            clearTileSet();
                            ngToast.create({className:'info', content: res.data.message});

                        });
                    } else {

                        clearTileSet();
                        ngToast.create({className:'info', content: "That's not a match..."});
                    }
                }
            } else {
                ngToast.create({className:'info', content: "Make sure the tile is clear on the top and left or right!"});
            }
        }

        function clearTileSet()
        {
            if (vm.tileSet[0] != null) vm.tileSet[0].clicked = false;
            if (vm.tileSet[1] != null) vm.tileSet[1].clicked = false;

            vm.tileSet = [];
        }

        function checkTileSetIsMatch()
        {
            if (vm.tileSet.length == 2) {

                var tileOne = vm.tileSet[0], tileTwo = vm.tileSet[1];

                if (tileOne._id == tileTwo._id) return false;

                if (tileOne.tile.matchesWholeSuit || tileTwo.tile.matchesWholeSuit) {
                    return (tileOne.tile.suit === tileTwo.tile.suit);
                } else {
                    if (tileOne.tile.suit === tileTwo.tile.suit) {
                        return (tileOne.tile.name === tileTwo.tile.name);
                    }
                }
            }

           return false;
        }

        function tileIsBlocked(tile)
        {
            var blockedFromLeft = false, blockedFromRight = false, blockedFromTop = false;

            _.each(vm.tiles, function(x) {
                if (tile == x)
                    return true;

                if ((x.xPos + 2) == tile.xPos && tile.zPos <=  x.zPos && (x.yPos == tile.yPos || tile.yPos == x.yPos + 1)) {
                    blockedFromLeft = true;
                } else if ((x.xPos - 2) == tile.xPos && tile.zPos <= x.zPos && (x.yPos == tile.yPos || tile.yPos == x.yPos + 1)) {
                    blockedFromRight = true;
                } else if(x.zPos > tile.zPos
                    && ( (x.xPos + 1 == tile.xPos || x.xPos == tile.xPos || x.xPos - 1 == tile.xPos)
                    && (x.yPos + 1 == tile.yPos || x.yPos == tile.yPos || x.yPos - 1 == tile.yPos)) ){
                    blockedFromTop = true;
                }
            });

            return (blockedFromTop || (blockedFromRight && blockedFromLeft));
        }

        socket.on('start', function(res)
        {
            vm.game.state = 'playing';

            gameService.getGameTiles(vm.game._id, false).then(function(res) {
                vm.tiles = res.data;
            });
        });

        socket.on('match', function(res)
        {
            for (var i = 0; i < vm.tiles.length; i++)
            {
                if (vm.tiles[i]._id == res[0]._id)
                {
                    vm.tiles.splice(i, 1);
                }
                else if (vm.tiles[i]._id == res[0].match.otherTileId)
                {
                    vm.tiles.splice(i, 1);
                }
            }
        });

        socket.on('end', function(res)
        {
            vm.game.state = 'finished';
            vm.canPlay = false;
            ngToast.create({className:'info', content: 'This game has ended!'});
        });
    }
})();
(function() {
    
    angular
        .module('mahjong.games')
        .controller('GameCreateController', GameCreateController);
    
    GameCreateController.$inject = ['$state', 'gameService', 'ngToast', 'templates'];
    
    function GameCreateController($state, gameService, ngToast, templates)
    {
        var vm = this;
        
        vm.game = {};
        vm.templates = {};
        vm.createGame = createGame;

        init();

        function init()
        {
            vm.templates = templates.data;
        }

        function createGame(isValid)
        {
            if (isValid) {
                gameService.createNew(vm.game.templateName, vm.game.minPlayers, vm.game.maxPlayers).then(function(response) {
                    ngToast.create({className: 'success', content: 'Game created! Have fun'})
                    $state.go('mahjong.view.board', { gameId : response.data._id });
                }, function(res) {
                    ngToast.create({className: 'warning', content: res.data.message})
                });
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('mahjong.games')
        .controller('GameListController', GameListController);

    GameListController.$inject = ['templates', 'gameService', 'ngToast', '$state'];

    function GameListController(templates, gameService, ngToast, $state)
    {
        var vm = this;

        vm.sortType = 'createdOn';
        vm.sortReverse = true;
        vm.bigTotalItems = 0;
        vm.currentPage = 1;
        vm.maxSize = 5;
        vm.gamesFilter  = {
            'createdBy' : '',
            'state' : '',
            'gameTemplate' : ''
        };

        vm.games = null;
        vm.templates = {};

        vm.pageChanged = pageChanged;
        vm.joinGame = joinGame;
        vm.canJoinGame = canJoinGame;
        vm.loadGames = loadGames;

        init();

        function init()
        {
            vm.templates = templates.data;
            loadGames();
        }

        function pageChanged()
        {
            vm.loadGames();
        }

        function loadGames()
        {
            gameService
                .getAll(12, vm.currentPage, vm.gamesFilter.gameTemplate, vm.gamesFilter.state, vm.gamesFilter.createdBy)
                .success(function(response, status, headers) {
                    vm.bigTotalItems = parseInt(headers('X-total-count'));
                    vm.games = response;
                });
        }

        function joinGame(id)
        {
            gameService
                .join(id)
                .then(function(res) {
                    ngToast.create("Game joined. Redirect...");
                    $state.go('mahjong.view.players', { gameId : id });
                }, function(res) {
                    ngToast.create({className: 'warning', content: res.data.message});
                });
        }

        function canJoinGame(game)
        {
            return gameService.canJoinGame(game);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('mahjong.games')
        .factory('gameService', gameService);

    gameService.$inject = ['config', '$http', 'authFactory'];

    function gameService(config, $http, authFactory)
    {
        var service = {
            getAll: getAll,
            getById: getById,
            createNew: createNew,
            getGamePlayers: getGamePlayers,
            getGameTiles: getGameTiles,
            start: start,
            canJoinGame: canJoinGame,
            match: match,
            join: join
        };

        return service;


        function getAll(pageSize, pageIndex, gameTemplate, state, createdBy)
        {
            var filter = {
                'pageSize' : pageSize,
                'pageIndex': pageIndex,
                'gameTemplate': gameTemplate,
                'state' : state,
                'createdBy' : createdBy
            };

            return $http({method: 'GET', url: config.apiUrl + '/Games', params: filter});
        }

        function getById(id)
        {
            return $http({method: 'GET', url: config.apiUrl + '/Games/' + id});
        }

        function createNew(template, minPlayers, maxPlayers)
        {
            var postBody = {
                templateName : template,
                minPlayers : minPlayers,
                maxPlayers : maxPlayers
            };

            return $http({method: 'POST', url: config.apiUrl + '/Games', data: postBody});
        }

        function getGamePlayers(id)
        {
            return $http({method: 'GET', url: config.apiUrl + '/Games/' + id + '/Players'});
        }

        function getGameTiles(id, matched)
        {
            var matched = (matched) ? 'true' : 'false';
            return $http({method: 'GET', url: config.apiUrl + '/Games/' + id + '/Tiles?matched='+matched});
        }

        function start(id)
        {
            return $http({method: 'POST', url: config.apiUrl + '/Games/' + id + '/Start', data: {}});
        }

        function canJoinGame(game)
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

        function match(gameId, tileOneId, tileTwoId)
        {
            var postBody = {
                tile1Id : tileOneId,
                tile2Id : tileTwoId
            };

            return $http({method: 'POST', url: config.apiUrl + '/Games/'+gameId+'/Tiles/matches', data: postBody});
        }

        function join(id)
        {
            return $http({method: 'POST', url: config.apiUrl + '/Games/' + id + '/Players'});
        }
    }
})();
(function() {
    'use strict';
    
    angular
        .module('mahjong.games')
        .controller('GameViewController', GameViewController);
    
    GameViewController.$inject = ['game', 'gameService', 'ngToast', 'socket', 'config'];
    
    function GameViewController(game, gameService, ngToast, socket, config)
    {
        /* jshint validthis: true */
        var vm = this;

        vm.game = {};
        vm.startGame = startGame;
        vm.canJoinGame = canJoinGame;
        vm.joinGame = joinGame;

        init();

        function init()
        {
            vm.game = game.data;

            var socketEndPoint = config.apiUrl + '?gameId='+vm.game._id;
            socket.initialize(io(socketEndPoint));
        }

        function startGame()
        {
            gameService.start(vm.game._id).then(function(res) {
                ngToast.create({className: 'success', content: res.data});
            }, function(res) {
                ngToast.create({className: 'warning', content: res.data.message});
            });
        }

        function canJoinGame() {
            return gameService.canJoinGame(vm.game);
        }

        function joinGame() {
            gameService.join(vm.game._id).then(function(res) {
                ngToast.create("Game joined!");
            }, function(res) {
                ngToast.create({className: 'warning', content: res.data.message});
            });
        }

        socket.on('start', function(res)
        {
            vm.game.state = 'playing';
        });

        socket.on('end', function(res)
        {
            vm.game.state = 'finished';
        });
    }
})();
(function() {
    'use strict';

    angular
        .module('mahjong.games')
        .controller('PlayerListController', PlayerListController);

    PlayerListController.$inject = ['players', 'socket'];

    function PlayerListController(players, socket)
    {
        /* */
        var vm = this;

        vm.players = {};

        init();

        function init()
        {
            vm.players = players.data;
        }

        socket.on('playerJoined', function(res) {
            vm.players.push(res);
        });
    }
})();
///**
// * Tile directive
// */
//angular.module('mahjong.games').directive('chooseTemplate', function() {
//    return {
//        name: 'chooseTemplate',
//        restrict: 'E',
//        replace: true,
//        templateUrl: 'app/components/templates/chooseTemplateDirective.html',
//        controller: ['$scope', 'templateService', function($scope, templateService) {
//            templateService.getAll().then(function(response) {
//                $scope.templates = response.data;
//            });
//        }],
//        link: function(scope, elem, attrs) {
//
//        }
//    }
//});
(function() {
    'use strict';

    angular
        .module('mahjong.games')
        .factory('templateService', templateService);

    templateService.$inject = ['config', '$http'];

    function templateService(config, $http)
    {
        var service = {
            getAll : getAll
        };

        return service;

        function getAll()
        {
            return $http({method: 'GET', url: config.apiUrl + '/GameTemplates'});
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('mahjong.games')
        .directive('tile', tile);

    function tile()
    {
        return {
            name: 'tile',
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/tiles/tileTemplate.html',
            link: function(scope, elem, attrs)
            {
                // Manipulate the DOM
                elem.addClass(scope.tile.tile.suit);
                elem.addClass(scope.tile.tile.suit + '-' + scope.tile.tile.name);
                elem.css('z-index', (scope.tile.yPos ) + ((scope.tile.zPos+1) * 50) - scope.tile.xPos);
                elem.css('top', (scope.tile.yPos * 43 - (scope.tile.zPos * 10)) + 'px');
                elem.css('left', (scope.tile.xPos * 33 + (scope.tile.zPos * 10)) + 'px');

                scope.$watch('tile.clicked', function()
                {
                    if (scope.tile.clicked) {
                        elem.addClass("clicked");
                    } else {
                        elem.removeClass("clicked");
                    }
                });
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('mahjong.auth', []);

})();
(function() {
    'use strict';

    angular
        .module('mahjong.auth')
        .factory('authFactory', authFactory);

    authFactory.$inject = ['config', 'localStorageService'];

    function authFactory(config, localStorageService)
    {
        var username = '';

        var factory = {
            username : username,
            initialize : initialize,
            isGuest : isGuest,
            store : store,
            destroy : destroy,
            getUsername : getUsername,
            getToken : getToken
        };

        return factory;

        function initialize()
        {
            username = getUsername();
        }

        function isGuest()
        {
            return (localStorageService.get('token') == null);
        }

        function store(oauthName, token)
        {
            username = oauthName;

            localStorageService.set('username', username);
            localStorageService.set('token', token);
        }

        function destroy()
        {
            username = '';
            localStorageService.remove('username', 'token');
            localStorageService.clearAll();

            return true;
        }

        function getUsername()
        {
            return localStorageService.get('username');
        }

        function getToken()
        {
            return localStorageService.get('token');
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('mahjong.auth')
        .factory('HttpRequestInterceptor', HttpRequestInterceptor);

    HttpRequestInterceptor.$inject = ['authFactory'];

    function HttpRequestInterceptor(authFactory)
    {
        return {
            'request': function(config) {

                if(!authFactory.isGuest()) {
                    config.headers['x-username'] = authFactory.getUsername();
                    config.headers['x-token']    = authFactory.getToken();
                }

                return config;
            }
        };
    }

})();
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
(function() {
    'use strict';

    angular
        .module('mahjong')
        .factory('socket', ['$rootScope', function($rootScope) {
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
})();

