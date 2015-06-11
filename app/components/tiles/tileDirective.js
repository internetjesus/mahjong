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
            elem.css('z-index', scope.tile.zPos);
            elem.css('top', (scope.tile.yPos * 37.5) + 'px');
            elem.css('left', (scope.tile.xPos * 35.5) + 'px');

            elem.bind('mouseover', function() {
                elem.css('cursor', 'pointer');
            });
        }
    }
});