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

        scene: [ OpeningScene, StockforsScene, MenuScene, KirkkoScene, PatruunantaloScene, PakkausmuseoScene, OptionsMenuScene ]
        
       
    };

    //Currently active map
    var currentMap;

    //Whether if player is ready to move
    var readyToMove = false;
    
    //Sometimes the player seems to appear at the wrong spot when loading?
    function saveGame()
    {
        var file = {
            map: currentMap.scene.key,
            posX: currentMap.player.x, 
            posY: currentMap.player.y, 
            MusicOn: config.musicOn,
            SoundOn: config.soundOn 
        };

        localStorage.setItem('saveFile', JSON.stringify(file));

        console.log('Game saved. Player position: ' + file.posX, file.posY);
    };

    function loadGame()
    {
        var file = JSON.parse(localStorage.getItem('saveFile'));

        if(file != null)
        {
        
        config.musicOn = file.MusicOn;
        config.soundOn = file.SoundOn;

        }
        
        return file;

    };


    



