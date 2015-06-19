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
            // Set class name
            elem.addClass(scope.tile.tile.suit);
            elem.addClass(scope.tile.tile.suit + '-' + scope.tile.tile.name);

            // Set the z-index
            elem.css('z-index', (scope.tile.yPos ) + ((scope.tile.zPos+1) * 50) - scope.tile.xPos);

            // Set the x and y position
            elem.css('top', (scope.tile.yPos * 43 - (scope.tile.zPos * 10)) + 'px');
            elem.css('left', (scope.tile.xPos * 33 + (scope.tile.zPos * 10)) + 'px');

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