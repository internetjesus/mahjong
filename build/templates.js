angular.module('mahjong').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/components/games/gameBoard.html',
    "<div class=\"game-board\"><div class=\"tile-wrapper tile-style-1\" ng-show=\"vm.tiles != null\"><tile ng-repeat=\"tile in vm.tiles\" ng-click=\"vm.tileClick(tile)\" tile=\"tile\"></tile></div><img src=\"/assets/img/tumblr_mf71km11Pd1rl8vbqo1_400.gif\" class=\"waiting\" ng-show=\"vm.tiles==null\"></div>"
  );


  $templateCache.put('app/components/games/gameCreate.html',
    "<div class=\"row\"><div class=\"col-md-4 col-md-offset-4\"><form name=\"newGame\" ng-submit=\"vm.createGame(newGame.$valid)\" novalidate><h4 class=\"form-header\">Start new Mahjong game</h4><div class=\"form-group\"><label class=\"control-label\">Template</label><select class=\"form-control\" ng-model=\"vm.game.templateName\"><option value=\"{{template._id}}\" ng-repeat=\"template in vm.templates\">{{template._id}}</option></select><p class=\"help-block\">Choose the game board layout</p></div><div class=\"form-group\"><div class=\"row\"><div class=\"col-md-6\"><label class=\"control-label\">Min players</label><input type=\"number\" ng-model=\"vm.game.minPlayers\" ng-required=\"true\" class=\"form-control\" name=\"minPlayers\" placeholder=\"1\"></div><div class=\"col-md-6\"><label class=\"control-label\">Max players</label><input type=\"number\" ng-model=\"vm.game.maxPlayers\" ng-required=\"true\" class=\"form-control\" name=\"maxPlayers\" placeholder=\"4\"></div></div></div><hr><button type=\"submit\" class=\"btn btn-primary btn-block\" ng-disabled=\"newGame.$invalid\">Create game</button></form></div></div>"
  );


  $templateCache.put('app/components/games/gameList.html',
    "<div class=\"row\"><div class=\"col-md-9\"><div class=\"row\"><div class=\"col-xs-12 col-sm-4 col-md-4 col-lg-4\" ng-repeat=\"game in vm.games\"><div class=\"box\"><div class=\"box-icon\"><img ng-src=\"/assets/img/{{game.gameTemplate.id}}.png\" alt=\"Board preview\" class=\"img-circle\"></div><div class=\"info text-center\"><h4>{{ game.gameTemplate.id}}</h4><p><i>Created by {{ game.createdBy.name }} on {{ game.createdOn | date:'medium'}} | Status : {{ game.state }}</i></p><div class=\"btn-group\" role=\"group\"><a type=\"button\" ng-click=\"vm.joinGame(game._id)\" ng-disabled=\"!vm.canJoinGame(game)\" class=\"btn btn-sm btn-primary\">Join</a> <a ui-sref=\"mahjong.view.board({gameId : game._id})\" type=\"button\" class=\"btn btn-sm btn-default\">View</a></div></div></div></div></div><hr><nav class=\"table-footer\"><pagination total-items=\"vm.bigTotalItems\" ng-change=\"vm.pageChanged()\" ng-model=\"vm.currentPage\" max-size=\"vm.maxSize\" class=\"pagination-sm\" boundary-links=\"true\"></pagination></nav></div><div class=\"col-md-3\"><div class=\"filter panel panel-default\"><div class=\"panel-heading\"><h5><span class=\"glyphicon glyphicon-search\"></span> Search</h5></div><div class=\"panel-body\"><form class=\"form-horizontal\"><div class=\"form-group\"><label>Created by</label><input type=\"text\" ng-model=\"vm.gamesFilter.createdBy\" placeholder=\"Avans e-mail\" class=\"form-control\"></div><div class=\"form-group\"><label>Template</label><select class=\"form-control\" ng-model=\"vm.gamesFilter.gameTemplate\"><option value=\"\">All</option><option value=\"{{template._id}}\" ng-repeat=\"template in vm.templates\">{{template._id}}</option></select></div><div class=\"form-group\"><label>State</label><select class=\"form-control\" ng-model=\"vm.gamesFilter.state\"><option value=\"\">Any</option><option value=\"playing\">Playing</option><option value=\"finished\">Finished</option><option value=\"open\">Open</option></select></div><div class=\"form-group\"><button class=\"btn btn-block btn-primary\" ng-click=\"vm.loadGames()\">Search</button></div></form></div><div class=\"panel-footer\"></div></div></div></div>"
  );


  $templateCache.put('app/components/games/gameView.html',
    "<div class=\"row\"><div class=\"col-md-10\"><div ui-view></div></div><div class=\"col-md-2\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><h5>Menu</h5></div><div class=\"panel-body\"><a ui-sref=\"mahjong.view.board\" type=\"button\" class=\"btn btn-lg btn-block btn-default\"><span class=\"glyphicon glyphicon-th pull-left\"></span> Board</a> <a ui-sref=\"mahjong.view.players\" type=\"button\" class=\"btn btn-lg btn-block btn-default\"><span class=\"glyphicon glyphicon-user pull-left\"></span> Lobby</a> <a ui-sref=\"mahjong.view.players\" type=\"button\" class=\"btn btn-lg btn-block btn-default\"><span class=\"glyphicon glyphicon-eye-open pull-left\"></span> Matches</a> <a ui-sref=\"mahjong.view.players\" type=\"button\" class=\"btn btn-lg btn-block btn-default\"><span class=\"glyphicon glyphicon-question-sign pull-left\"></span> Help</a><hr><button class=\"btn btn-lg btn-block btn-default\" ng-click=\"vm.joinGame()\" ng-disabled=\"!vm.canJoinGame()\">Join this game!</button> <button class=\"btn btn-lg btn-block btn-default\">Change tiles</button> <button class=\"btn btn-lg btn-block btn-success\" ng-click=\"vm.startGame()\" ng-hide=\"vm.game.createdBy._id != $root.auth.username || vm.game.state != 'open'\">Start game</button></div><div class=\"panel-footer\"></div></div></div></div>"
  );


  $templateCache.put('app/components/players/playerList.html',
    "<table class=\"table table-responsive\"><thead><tr><td>Name</td><td>Matches</td></tr></thead><tbody><tr ng-repeat=\"player in vm.players\"><td>{{ player.name }}</td><td>{{ player.numberOfMatches }}</td></tr></tbody></table>"
  );


  $templateCache.put('app/components/templates/chooseTemplateDirective.html',
    "<select class=\"form-control\"><option></option><option ng-repeat=\"template in templates\">{{ template._id }}</option></select>"
  );


  $templateCache.put('app/components/tiles/tileTemplate.html',
    "<div class=\"tile\"></div>"
  );


  $templateCache.put('app/shared/base/baseMaster.html',
    "<nav class=\"navbar navbar-default navbar-fixed-top\"><div class=\"container-fluid\"><div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#main-nav-collapse\"><span class=\"sr-only\">Toggle navigation</span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span></button><!--<a class=\"navbar-brand\" href=\"#/\">Mahjong</a>--></div><div class=\"collapse navbar-collapse\" id=\"main-nav-collapse\"><ul class=\"nav navbar-nav\"><li><a ui-sref=\"mahjong.games\"><span class=\"glyphicon glyphicon-list\"></span> View games</a></li><li><a ui-sref=\"mahjong.create\"><span class=\"glyphicon glyphicon-plus\"></span> Create your own game</a></li></ul><a href=\"{{oAuthUrl}}\" ng-show=\"$root.auth.isGuest()\" type=\"button\" class=\"btn btn-sm btn-default navbar-btn navbar-right nav-auth\">Sign in <span class=\"glyphicon glyphicon-log-in\"></span></a> <button ng-hide=\"$root.auth.isGuest()\" ng-click=\"signOut()\" type=\"button\" class=\"btn btn-sm btn-default navbar-btn navbar-right nav-auth\">Sign out <span class=\"glyphicon glyphicon-log-out\"></span></button><p ng-hide=\"$root.auth.isGuest()\" class=\"navbar-text navbar-right\">Signed in as {{ $root.auth.username }}</p></div></div></nav><div id=\"wrapper\"><div class=\"container-fluid\"><div ui-view></div></div></div>"
  );

}]);
