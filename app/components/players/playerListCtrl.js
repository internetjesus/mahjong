(function() {
    'use strict';

    angular
        .module('mahjong.games')
        .controller('PlayerListController', PlayerListController);

    PlayerListController.$inject = ['game', 'players', 'config'];

    function PlayerListController(game, players, config)
    {
        /* jshint validthis: true */
        var vm = this;

        vm.players = {};
        vm.game = {};

        init();

        function init()
        {
            vm.game = game.data;
            vm.players = players.data;

            initializeSockets();
        }

        function initializeSockets()
        {
            var socketEndPoint = config.apiUrl + '?gameId='+vm.game._id;
            var socket = io(socketEndPoint, {"force new connection":true});

            socket.on('playerJoined', function(res) {
                vm.players.push(res);
            });
        }
    }
})();