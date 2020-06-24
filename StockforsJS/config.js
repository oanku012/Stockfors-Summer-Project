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

        scene: [ StockforsScene, MenuScene, KirkkoScene, PatruunaScene, PakkausMuseoScene, OptionsMenuScene ]
        
       
    };

    //Currently active map
    var currentMap;

    //Whether if player is ready to move
    var readyToMove = false; 



