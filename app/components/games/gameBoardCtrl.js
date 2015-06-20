(function() {
    'use strict';

    angular
        .module('mahjong.games')
        .controller('GameBoardController', GameBoardController);

    GameBoardController.$inject = ['game', 'socket', 'tiles', 'gameService', 'ngToast', 'authFactory'];

    function GameBoardController(game, socket, tiles, gameService, ngToast, authFactory)
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

                            clearTileSet()
                            ngToast.create({className:'success', content: "Congratulations! You made a match"});

                        }, function(res) {

                            clearTileSet()
                            ngToast.create({className:'info', content: res.data.message});

                        });
                    } else {

                        clearTileSet()
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
            ngToast.create({className:'info', content: 'This game has ended!'});
        });
    }
})();