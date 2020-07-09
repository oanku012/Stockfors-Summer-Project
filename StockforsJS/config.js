//const { Game } = require("phaser");

var config = {
        type: Phaser.AUTO,
        width: 1920,
        height: 1080,
        soundOn: true,
        musicOn: true,
        parent: 'game',

        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
           
        },

        dom: {
            createContainer: true
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

        

        scene: [ OpeningScene, StockforsScene, MenuScene, KirkkoScene, PatruunantaloScene, PakkausmuseoScene, OptionsMenuScene, MuistiPeliScene ]
        
       
    };

    //Currently active map
    var currentMap;

    //Whether if player is ready to move
    var readyToMove = false;

    //This is updated every time player enters a building, player can then be spawned back to that position when exiting the building
    var playerExitPosition;

    //Collision layers, these are global because to my understanding the value given by this.matter.world.nextcategory() doesn't go back to the start when re-creating a scene and collision would break after entering and re-entering a scene certain amount of times
    var collisionCat1;
    var collisionCat2;
    
    //Sometimes the player seems to appear at the wrong spot when loading?
    function saveGame()
    {
        var file = {
            map: currentMap.scene.key,
            posX: currentMap.player.x, 
            posY: currentMap.player.y 
        };

        localStorage.setItem('saveFile', JSON.stringify(file));

        console.log('Game saved. Player position: ' + file.posX, file.posY);
    };

    function saveSettings()
    {
        var file = { 
            MusicOn: config.musicOn,
            SoundOn: config.soundOn 
        };

        localStorage.setItem('settings', JSON.stringify(file));

        console.log('Settings saved.');
    }

    function loadGame()
    {
        var file = JSON.parse(localStorage.getItem('saveFile'));
        
        if(file != null)
        {
        
            //Moved this to the opening scene class so that loadgame can be used just to get specific values
            //config.musicOn = file.MusicOn;
            //config.soundOn = file.SoundOn;

        }
        
        return file;

    };

    function loadSettings()
    {
        var file = JSON.parse(localStorage.getItem('settings'));

        return file;
    }

    //Moved this here so the options menu could be added to the opening scene as well, some things like pointerOverUI only apply to map scenes
    function createButton(posX, posY, scene, runOnTop, scrollFactor, scale, context) {
        // Button
        let buttonBG = context.add.image(0, 0, 'buttonBG');
        let buttonText = context.add.image(0, 0, 'buttonText');

        let button = context.add.container(posX, posY, [buttonBG, buttonText]);
        button.setSize(buttonBG.width, buttonBG.height);
        button.setInteractive();

        button.setScrollFactor(scrollFactor).setDepth(9999).setScale(scale);

        var pressed = false;

        button.on('pointerover', function () {

            buttonBG.setTint(0x44ff44);

            //This is just to stop the player from moving when clicking options menu
            context.scene.pointerOverUI = true;

        });

        button.on('pointerout', function () {

            buttonBG.clearTint();
            pressed = false;

            //Enable clicking movement when cursor goes away from the UI-button
            context.scene.pointerOverUI = false;

        });

        button.on('pointerdown', function () {

            pressed = true;



        });

        button.on('pointerup', function (event) {


            if (pressed) {
                readyToMove = false;

                //Only affects timer events, have to be setup separately for physics
                //this.time.paused = true;

                if (runOnTop == true) {
                    context.scene.run(scene);
                }
                else {
                    context.scene.start(scene);
                }

            }
        }, context);


        return button;

    }



    



