/**
 * Tile directive
 */
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
            link: function(scope, elem, attrs) {
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