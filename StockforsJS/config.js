//const { Game } = require("phaser");

var config = {
        type: Phaser.AUTO,
        width: 1920,
        height: 1080,
        soundOn: true,
        musicOn: true,

        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        
        physics: {
            default: 'matter',
            matter: {
                debug: true,
                enablesleeping: true,
                gravity: {
                    y: 0
                }
            },
            arcade: {
                //gravity: { y: 0 },
                debug: true
            }
        },

        scene: [ OpeningScene, StockforsScene, MenuScene, KirkkoScene, PatruunaScene, PakkausMuseoScene, OptionsMenuScene ]
        
       
    };

    //Currently active map
    var currentMap;

    //Whether if player is ready to move
    var readyToMove = false;
    
    function saveGame()
    {
        var file = {
            map: currentMap.scene.key,
            posX: currentMap.player.x, 
            posY: currentMap.player.y, 
        };

        localStorage.setItem('saveFile', JSON.stringify(file));

        console.log('Game saved.');
    };

    function loadGame()
    {
        var file = JSON.parse(localStorage.getItem('saveFile'));

        //currentMap = this.scene.scene.getScene(file.map);

        //return playerPosition = { x: file.posX, y: file.posY };

        return file;

        //currentMap.player.setPosition(file.posX, file.posY);
    };


    



