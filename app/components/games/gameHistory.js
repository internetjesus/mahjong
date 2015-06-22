(function() {
    'use strict';

    angular
        .module('mahjong.games')
        .controller('GameHistoryController', GameHistoryController);

    GameHistoryController.$inject = ['game', 'socket', 'matchedTiles'];

    function GameHistoryController(game, socket, matchedTiles)
    {
        /* jshint validthis: true */
        var vm = this;



    }


})();