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