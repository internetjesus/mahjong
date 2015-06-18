/**
 * Tile directive
 */
angular.module('mahjong.games').directive('tile', function() {
    return {
        name: 'tile',
        restrict: 'E',
        replace: true,
        templateUrl: 'app/components/tiles/tileTemplate.html',
        controller: ['$scope', function($scope) {

        }],
        link: function(scope, elem, attrs) {
            // Calculate the z-index
            elem.css('z-index', (scope.tile.yPos ) + ((scope.tile.zPos+1) * 50) - scope.tile.xPos);

            // Calculate the x and y position
            var l = scope.tile.xPos * 35 + (scope.tile.zPos * 8);
            var t = scope.tile.yPos * 43 - (scope.tile.zPos * 8);

            elem.css('top', (t) + 'px');
            elem.css('left', (l) + 'px');

            // Bind the click function
            elem.bind('click', function() {
                elem.remove();
                console.log(scope.tile);
            });
        }
    }
});