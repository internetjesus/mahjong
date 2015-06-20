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

