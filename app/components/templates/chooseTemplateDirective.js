///**
// * Tile directive
// */
//angular.module('mahjong.games').directive('chooseTemplate', function() {
//    return {
//        name: 'chooseTemplate',
//        restrict: 'E',
//        replace: true,
//        templateUrl: 'app/components/templates/chooseTemplateDirective.html',
//        controller: ['$scope', 'templateService', function($scope, templateService) {
//            templateService.getAll().then(function(response) {
//                $scope.templates = response.data;
//            });
//        }],
//        link: function(scope, elem, attrs) {
//
//        }
//    }
//});