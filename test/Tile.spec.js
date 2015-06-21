describe("Game tests", function() {

    beforeEach(module('mahjong'));

    var gameBoardController, game, socket, tiles, gameService, ngToast, authFactory, $state;

    // Prepare the fake gameService
    beforeEach(function() {

    });


    beforeEach(inject(function($controller, $injector){
        // Inject fake templates data
        game = {
            data : {
                _id : '1234',
                state : 'playing'
            }
        };

        tiles = {
            data : [{"xPos":25,"yPos":8,"zPos":2,"tile":{"_id":21,"suit":"Circle","name":"6","matchesWholeSuit":false,"__v":0,"id":"21"},"_id":"5585166e87046a110078a916"},{"xPos":17,"yPos":8,"zPos":2,"tile":{"_id":87,"suit":"Character","name":"4","matchesWholeSuit":false,"__v":0,"id":"87"},"_id":"5585166e87046a110078a913"},{"xPos":15,"yPos":7,"zPos":2,"tile":{"_id":88,"suit":"Character","name":"5","matchesWholeSuit":false,"__v":0,"id":"88"},"_id":"5585166e87046a110078a911"},{"xPos":13,"yPos":7,"zPos":2,"tile":{"_id":79,"suit":"Character","name":"2","matchesWholeSuit":false,"__v":0,"id":"79"},"_id":"5585166e87046a110078a910"},{"xPos":23,"yPos":6,"zPos":2,"tile":{"_id":46,"suit":"Bamboo","name":"3","matchesWholeSuit":false,"__v":0,"id":"46"},"_id":"5585166e87046a110078a90c"},{"xPos":25,"yPos":9,"zPos":1,"tile":{"_id":114,"suit":"Wind","name":"East","matchesWholeSuit":false,"__v":0,"id":"114"},"_id":"5585166e87046a110078a8f9"},{"xPos":23,"yPos":9,"zPos":1,"tile":{"_id":120,"suit":"Wind","name":"West","matchesWholeSuit":false,"__v":0,"id":"120"},"_id":"5585166e87046a110078a8f8"},{"xPos":17,"yPos":9,"zPos":1,"tile":{"_id":122,"suit":"Wind","name":"West","matchesWholeSuit":false,"__v":0,"id":"122"},"_id":"5585166e87046a110078a8f6"},{"xPos":25,"yPos":7,"zPos":1,"tile":{"_id":41,"suit":"Bamboo","name":"2","matchesWholeSuit":false,"__v":0,"id":"41"},"_id":"5585166e87046a110078a8f2"},{"xPos":23,"yPos":7,"zPos":1,"tile":{"_id":93,"suit":"Character","name":"6","matchesWholeSuit":false,"__v":0,"id":"93"},"_id":"5585166e87046a110078a8f1"},{"xPos":21,"yPos":7,"zPos":1,"tile":{"_id":143,"suit":"Flower","name":"Bamboo","matchesWholeSuit":true,"__v":0,"id":"143"},"_id":"5585166e87046a110078a8f0"},{"xPos":19,"yPos":7,"zPos":1,"tile":{"_id":14,"suit":"Circle","name":"4","matchesWholeSuit":false,"__v":0,"id":"14"},"_id":"5585166e87046a110078a8ef"},{"xPos":17,"yPos":7,"zPos":1,"tile":{"_id":13,"suit":"Circle","name":"4","matchesWholeSuit":false,"__v":0,"id":"13"},"_id":"5585166e87046a110078a8ee"},{"xPos":15,"yPos":7,"zPos":1,"tile":{"_id":108,"suit":"Wind","name":"North","matchesWholeSuit":false,"__v":0,"id":"108"},"_id":"5585166e87046a110078a8ed"},{"xPos":13,"yPos":7,"zPos":1,"tile":{"_id":115,"suit":"Wind","name":"East","matchesWholeSuit":false,"__v":0,"id":"115"},"_id":"5585166e87046a110078a8ec"},{"xPos":3,"yPos":7,"zPos":1,"tile":{"_id":80,"suit":"Character","name":"3","matchesWholeSuit":false,"__v":0,"id":"80"},"_id":"5585166e87046a110078a8e9"},{"xPos":23,"yPos":5,"zPos":1,"tile":{"_id":111,"suit":"Wind","name":"North","matchesWholeSuit":false,"__v":0,"id":"111"},"_id":"5585166e87046a110078a8e5"},{"xPos":15,"yPos":5,"zPos":1,"tile":{"_id":134,"suit":"Dragon","name":"White","matchesWholeSuit":false,"__v":0,"id":"134"},"_id":"5585166e87046a110078a8e3"},{"xPos":13,"yPos":5,"zPos":1,"tile":{"_id":57,"suit":"Bamboo","name":"6","matchesWholeSuit":false,"__v":0,"id":"57"},"_id":"5585166e87046a110078a8e2"},{"xPos":5,"yPos":5,"zPos":1,"tile":{"_id":137,"suit":"Season","name":"Winter","matchesWholeSuit":true,"__v":0,"id":"137"},"_id":"5585166e87046a110078a8e0"},{"xPos":13,"yPos":3,"zPos":1,"tile":{"_id":42,"suit":"Bamboo","name":"2","matchesWholeSuit":false,"__v":0,"id":"42"},"_id":"5585166e87046a110078a8db"},{"xPos":18,"yPos":1,"zPos":1,"tile":{"_id":101,"suit":"Character","name":"8","matchesWholeSuit":false,"__v":0,"id":"101"},"_id":"5585166e87046a110078a8d6"},{"xPos":9,"yPos":15,"zPos":0,"tile":{"_id":7,"suit":"Circle","name":"2","matchesWholeSuit":false,"__v":0,"id":"7"},"_id":"5585166e87046a110078a8d0"},{"xPos":25,"yPos":9,"zPos":0,"tile":{"_id":128,"suit":"Dragon","name":"Green","matchesWholeSuit":false,"__v":0,"id":"128"},"_id":"5585166e87046a110078a8c3"},{"xPos":23,"yPos":9,"zPos":0,"tile":{"_id":100,"suit":"Character","name":"8","matchesWholeSuit":false,"__v":0,"id":"100"},"_id":"5585166e87046a110078a8c2"},{"xPos":19,"yPos":9,"zPos":0,"tile":{"_id":117,"suit":"Wind","name":"South","matchesWholeSuit":false,"__v":0,"id":"117"},"_id":"5585166e87046a110078a8c1"},{"xPos":17,"yPos":9,"zPos":0,"tile":{"_id":119,"suit":"Wind","name":"South","matchesWholeSuit":false,"__v":0,"id":"119"},"_id":"5585166e87046a110078a8c0"},{"xPos":21,"yPos":8,"zPos":0,"tile":{"_id":118,"suit":"Wind","name":"South","matchesWholeSuit":false,"__v":0,"id":"118"},"_id":"5585166e87046a110078a8bb"},{"xPos":25,"yPos":7,"zPos":0,"tile":{"_id":47,"suit":"Bamboo","name":"3","matchesWholeSuit":false,"__v":0,"id":"47"},"_id":"5585166e87046a110078a8b9"},{"xPos":23,"yPos":7,"zPos":0,"tile":{"_id":66,"suit":"Bamboo","name":"8","matchesWholeSuit":false,"__v":0,"id":"66"},"_id":"5585166e87046a110078a8b8"},{"xPos":19,"yPos":7,"zPos":0,"tile":{"_id":26,"suit":"Circle","name":"7","matchesWholeSuit":false,"__v":0,"id":"26"},"_id":"5585166e87046a110078a8b7"},{"xPos":17,"yPos":7,"zPos":0,"tile":{"_id":22,"suit":"Circle","name":"6","matchesWholeSuit":false,"__v":0,"id":"22"},"_id":"5585166e87046a110078a8b6"},{"xPos":15,"yPos":7,"zPos":0,"tile":{"_id":139,"suit":"Season","name":"Autumn","matchesWholeSuit":true,"__v":0,"id":"139"},"_id":"5585166e87046a110078a8b5"},{"xPos":13,"yPos":7,"zPos":0,"tile":{"_id":49,"suit":"Bamboo","name":"4","matchesWholeSuit":false,"__v":0,"id":"49"},"_id":"5585166e87046a110078a8b4"},{"xPos":3,"yPos":7,"zPos":0,"tile":{"_id":65,"suit":"Bamboo","name":"8","matchesWholeSuit":false,"__v":0,"id":"65"},"_id":"5585166e87046a110078a8b0"},{"xPos":21,"yPos":6,"zPos":0,"tile":{"_id":116,"suit":"Wind","name":"South","matchesWholeSuit":false,"__v":0,"id":"116"},"_id":"5585166e87046a110078a8ae"},{"xPos":23,"yPos":5,"zPos":0,"tile":{"_id":64,"suit":"Bamboo","name":"8","matchesWholeSuit":false,"__v":0,"id":"64"},"_id":"5585166e87046a110078a8aa"},{"xPos":15,"yPos":5,"zPos":0,"tile":{"_id":10,"suit":"Circle","name":"3","matchesWholeSuit":false,"__v":0,"id":"10"},"_id":"5585166e87046a110078a8a8"},{"xPos":13,"yPos":5,"zPos":0,"tile":{"_id":133,"suit":"Dragon","name":"White","matchesWholeSuit":false,"__v":0,"id":"133"},"_id":"5585166e87046a110078a8a7"},{"xPos":11,"yPos":5,"zPos":0,"tile":{"_id":81,"suit":"Character","name":"3","matchesWholeSuit":false,"__v":0,"id":"81"},"_id":"5585166e87046a110078a8a6"},{"xPos":9,"yPos":5,"zPos":0,"tile":{"_id":5,"suit":"Circle","name":"2","matchesWholeSuit":false,"__v":0,"id":"5"},"_id":"5585166e87046a110078a8a5"},{"xPos":7,"yPos":5,"zPos":0,"tile":{"_id":56,"suit":"Bamboo","name":"6","matchesWholeSuit":false,"__v":0,"id":"56"},"_id":"5585166e87046a110078a8a4"},{"xPos":5,"yPos":5,"zPos":0,"tile":{"_id":95,"suit":"Character","name":"6","matchesWholeSuit":false,"__v":0,"id":"95"},"_id":"5585166e87046a110078a8a3"},{"xPos":25,"yPos":3,"zPos":0,"tile":{"_id":141,"suit":"Flower","name":"Orchid","matchesWholeSuit":true,"__v":0,"id":"141"},"_id":"5585166e87046a110078a8a1"},{"xPos":18,"yPos":3,"zPos":0,"tile":{"_id":130,"suit":"Dragon","name":"Green","matchesWholeSuit":false,"__v":0,"id":"130"},"_id":"5585166e87046a110078a8a0"},{"xPos":16,"yPos":3,"zPos":0,"tile":{"_id":77,"suit":"Character","name":"2","matchesWholeSuit":false,"__v":0,"id":"77"},"_id":"5585166e87046a110078a89f"},{"xPos":14,"yPos":3,"zPos":0,"tile":{"_id":11,"suit":"Circle","name":"3","matchesWholeSuit":false,"__v":0,"id":"11"},"_id":"5585166e87046a110078a89e"},{"xPos":12,"yPos":3,"zPos":0,"tile":{"_id":86,"suit":"Character","name":"4","matchesWholeSuit":false,"__v":0,"id":"86"},"_id":"5585166e87046a110078a89d"},{"xPos":19,"yPos":1,"zPos":0,"tile":{"_id":67,"suit":"Bamboo","name":"8","matchesWholeSuit":false,"__v":0,"id":"67"},"_id":"5585166e87046a110078a896"},{"xPos":17,"yPos":1,"zPos":0,"tile":{"_id":89,"suit":"Character","name":"5","matchesWholeSuit":false,"__v":0,"id":"89"},"_id":"5585166e87046a110078a895"},{"xPos":15,"yPos":1,"zPos":0,"tile":{"_id":27,"suit":"Circle","name":"7","matchesWholeSuit":false,"__v":0,"id":"27"},"_id":"5585166e87046a110078a894"},{"xPos":13,"yPos":1,"zPos":0,"tile":{"_id":51,"suit":"Bamboo","name":"4","matchesWholeSuit":false,"__v":0,"id":"51"},"_id":"5585166e87046a110078a893"}]
        };

        socket = $injector.get('socket');
        gameService = $injector.get('gameService');
        ngToast = $injector.get('ngToast');
        authFactory = $injector.get('authFactory');
        $state = $injector.get('$state');

        gameBoardController = $controller("GameBoardController", {
            game: game,
            socket : socket,
            tiles : tiles,
            gameService : gameService,
            ngToast : ngToast,
            authFactory : authFactory,
            $state : $state
        });
    }));

    it('should contain a list of tiles', function() {
        expect(gameBoardController.tiles.length).toEqual(52);
    });

    it('should not be possible to click a tile when its not clear', function() {
        var tile = {
            _id: "5584622e33f25d1100b870c2",
            clicked: true,
            tile : {
                _id: "89",
                matchesWholeSuit: false,
                name: "5",
                suit: "Character"
            },
            xPos: 26,
            yPos: 2,
            zPos: 1
        };

        var result = gameBoardController.tileClick(tile);

        expect(result).toEqual(false);
    });

    it('should be possible to click on a tile when its clear', function() {
        var tile = {"xPos":25,"yPos":8,"zPos":2,"tile":{"_id":21,"suit":"Circle","name":"6","matchesWholeSuit":false,"__v":0,"id":"21"},"_id":"5585166e87046a110078a916"};

        var result = gameBoardController.tileClick(tile);

        expect(result).toEqual(false);
    });
});