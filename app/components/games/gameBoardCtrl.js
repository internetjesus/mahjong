(function() {
    'use strict';

    angular
        .module('mahjong.games')
        .controller('GameBoardController', GameBoardController);

    GameBoardController.$inject = ['game', 'socket', 'tiles', 'gameService', 'ngToast'];

    function GameBoardController(game, socket, tiles, gameService, ngToast)
    {
        /* jshint validthis: true */
        var vm = this;

        vm.game = {};
        vm.tiles = {};
        vm.tileSet = [];
        vm.tileClick = tileClick;
        vm.tileIsAlright = tileIsAlright;

        init();

        function init()
        {
            vm.game = game.data;
            vm.tiles = (tiles) ? tiles.data : null;
        }

        function tileClick(tile)
        {
            vm.tileSet.push(tile);

            if (vm.tileSet.length == 2) {

                if (!vm.tileIsAlright(vm.tileSet[0]) || !vm.tileIsAlright(vm.tileSet[1])) {
                    vm.tileSet = [];
                    return false;
                }

                gameService.match(vm.game._id, vm.tileSet[0]._id, vm.tileSet[1]._id).then(function (res) {

                    ngToast.create({className:'success', content: "Congratulations! You made a match"});
                    vm.tileSet = [];
                }, function(res) {

                    ngToast.create({className:'info', content: res.data.message});
                    vm.tileSet = [];
                });
            }
        }

        function tileIsAlright(tile)
        {
            return true;
        }

        socket.on('match', function(res)
        {
            console.log(res);

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

        socket.on('start', function(res)
        {
            vm.game.state = 'playing';

            gameService.getGameTiles(vm.game._id).then(function(res) {
                vm.tiles = res.data;
            });
        });

        socket.on('end', function(res)
        {
            ngToast.create({className:'info', content: 'This game has ended!'});
        });
    }
})();