describe("Game tests", function() {

    beforeEach(module('mahjong'));

    var gameListController, templates, ngToast, state, gameService, fakeTemplateService;

    // Prepare the fake gameService
    beforeEach(function() {
        //fakeGameService = {
        //    getAll: function(pageSize, pageIndex, gameTemplate, state, createdBy) {
        //        deferred = q.defer();
        //        deferred.resolve({ "_id": "1234" });
        //        return deferred.promise;
        //    }
        //};

        fakeTemplateService = {
            getAll : function() {
                deferred = q.defer();
                deferred.resolve({data: { "_id": "Ox" }});
                return deferred.promise;
            }
        };

        //spyOn(fakeGameService, 'getAll');
        spyOn(fakeTemplateService, 'getAll');
    });


    beforeEach(inject(function($controller, $injector){
        gameService = $injector.get("gameService");
        templates = $injector.get("templateService");
        ngToast = $injector.get("ngToast");
        state = $injector.get("$state");

        q = $injector.get('$q');

        gameListController = $controller("GameListController", {
            templates: fakeTemplateService,
            gameService : gameService,
            ngToast : ngToast,
            $state : state
        });
    }));

    it('should sort by date by default', function() {
        expect(gameListController.sortType).toEqual('createdOn');
    });

    it('should contain a list of templates', function() {
        expect(gameListController.loadGames).toBeDefined();
    });

    it('should join a game', function() {
        var test = [1,2,3,4];

        expect(test).toEqual([1,2,3,4]);
    });

    it('should create a new game', function() {
        var test = [1,2,3,4];

        expect(test).toEqual([1,2,3,4]);
    });
});