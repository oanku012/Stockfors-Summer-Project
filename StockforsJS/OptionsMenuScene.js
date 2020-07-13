class OptionsMenuScene extends MenuScene
{
    constructor()
    {
        super('OptionsMenuScene');

        this.title = 'Options';
        this.description = '';

    }

    preload ()
    {
        super.preload();
    }

    create ()
    {
        this.createContainer();
        this.createOptionsMenu();
        this.createExitButton();

        // Reorganize the UI when the game gets resized
        this.scale.on('resize', this.resize, this);
    }

    createContainer () 
    {
        super.createContainer('MenuAtlas', 'UI Pohjat/Settings');
        
    }

    createOptionsMenu()
    {
        this.musicOn = true;
        this.soundOn = true;
         
        this.musicButton = this.add.sprite(-100, -200, 'MenuAtlas', 'UI Buttons/CheckmarkON');
        this.musicText = this.add.text(0, -200, 'Music Enabled', { fontSize: 24, color: "black" });
         
        this.soundButton = this.add.image(-100, -100, 'MenuAtlas', 'UI Buttons/CheckmarkON');
        this.soundText = this.add.text(0, -100, 'Sound Enabled', { fontSize: 24, color: "black"});

        this.fullScreenButton = this.add.image(-100, 0, 'MenuAtlas', 'UI Buttons/CheckmarkOFF');
        this.fullScreenText = this.add.text(0, 0, 'Fullscreen', { fontSize: 24, color: "black"});
         
        this.musicButton.setInteractive();
        this.soundButton.setInteractive();
        this.fullScreenButton.setInteractive();

        this.menu.add([this.musicButton, this.musicText, this.soundButton, this.soundText, this.fullScreenButton, this.fullScreenText]);

        // Call updateAudio to make sure we have correct values for checkboxes
        this.updateAudio();
        this.updateFullScreen();
         
        this.musicButton.on('pointerdown', function () {
            config.musicOn = !config.musicOn;
            this.updateAudio();
        }.bind(this));
         
        this.soundButton.on('pointerdown', function () {
            config.soundOn = !config.soundOn;
            this.updateAudio();
        }.bind(this));

        this.fullScreenButton.on('pointerdown', function() {
            this.scale.toggleFullscreen();
            this.updateFullScreen();
        }.bind(this));

        this.menu.setScale(0.56);
        
    }

    updateAudio() {
        if (config.musicOn === false) {
            this.musicButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkOFF');
        }
        else {
            this.musicButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkON');
        }
       
        if (config.soundOn === false) {
            this.soundButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkOFF');
        }
        else {
            this.soundButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkON');
        }
      }

      updateFullScreen() {
        if (this.scale.isFullscreen) {
            // On start full screen
            this.fullScreenButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkON')
        } else {
            // On stop full screen
            this.fullScreenButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkOFF')
        }
      }
    

    createExitButton() 
    {
        // Exit button
        let exitButton = this.add.sprite(35, 400, 'MenuAtlas', 'UI Buttons/Sulje');
        //let exitButton = this.add.container(this.menuBG.width / 2, -this.menuBG.height / 2, [ exitButtonBG ]);
        //exitButton.setSize(exitButtonBG.width, exitButtonBG.height);
        this.menu.add(exitButton);
        exitButton.setInteractive();

        var pressed = false;

        exitButton.on('pointerover', function () {
    
            //exitButtonBG.setTint(0xeb4034);
            
        });
    
        exitButton.on('pointerout', function () {
            exitButton.setTexture('MenuAtlas', 'UI Buttons/Sulje');
            //exitButtonBG.clearTint();
            pressed = false;
    
        });

        exitButton.on('pointerdown', function () {
            exitButton.setTexture('MenuAtlas', 'UI Buttons/Sulje_Pressed');
            pressed = true;
    
        });
    
        exitButton.on('pointerup', function (event) {
            if (pressed)
            {
                exitButton.setTexture('MenuAtlas', 'UI Buttons/Sulje');


                //Uses default values from function declaration when undefined is set
                //saveGame(undefined, undefined, undefined, config.musicOn, config.soundOn);
                saveGame({musicOn: config.musicOn, soundOn: config.soundOn});

                this.scene.stop(this.scene.key);

                //this.time.paused = false;

                readyToMove = true;
            }
          }, this);

        
    }
}