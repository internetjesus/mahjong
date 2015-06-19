/**
 * Tile directive
 */
angular.module('mahjong.games').directive('tile', function() {
    return {
        name: 'tile',
        restrict: 'E',
        replace: true,
        templateUrl: 'app/components/tiles/tileTemplate.html',
        link: function(scope, elem, attrs) {
            // Calculate the z-index
            elem.css('z-index', (scope.tile.yPos ) + ((scope.tile.zPos+1) * 50) - scope.tile.xPos);

            // Calculate the x and y position
            var l = scope.tile.xPos * 33 + (scope.tile.zPos * 10);
            var t = scope.tile.yPos * 43 - (scope.tile.zPos * 10);

            elem.css('top', (t) + 'px');
            elem.css('left', (l) + 'px');

            // Bind the click function
            /*elem.bind('click', function() {
                if (scope.highlight) {
                    scope.highlight = false;
                    elem.removeClass('selected');
                } else {
                    scope.highlight = true;
                    elem.addClass('selected');
                }
            });*/
        }
    }
});