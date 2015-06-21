describe("Game tests", function() {

    beforeEach(module('mahjong'));

    var gameListController, gameService, ngToast, state, templates;

    // Prepare the fake gameService
    beforeEach(function() {
        fakeGameService = {
            getAll: function(pageSize, pageIndex, gameTemplate, state, createdBy) {
                return {
                    success : function(response, status, headers) {
                        deferred = q.defer();
                        deferred.resolve({ "_id": "1234" });
                        return deferred.promise;
                    }
                };
            }
        };

        spyOn(fakeGameService, 'getAll');
    });


    beforeEach(inject(function($controller, $injector){
        // Inject fake templates data
        templates = { data: [{_id: "Ox"}, {_id : "Shanghai"}]};
        ngToast = $injector.get("ngToast");
        state = $injector.get("$state");
        gameService = $injector.get("gameService");

        gameListController = $controller("GameListController", {
            templates: templates,
            gameService : gameService,
            ngToast : ngToast,
            $state : state
        });
    }));

    it('should default sort games by date', function() {
        expect(gameListController.sortType).toEqual('createdOn');
    });

    it('should contain a list of templates', function() {
        expect(gameListController.templates).toEqual([{_id: "Ox"}, {_id : "Shanghai"}]);
    });
});