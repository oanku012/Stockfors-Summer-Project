class OptionsMenuScene extends Phaser.Scene
{
    constructor()
    {
        super('OptionsMenuScene');

        this.title = 'Options';
        this.description = '';

    }

    preload ()
    {
        
    }

    create ()
    {
        this.createContainer();
        this.createOptionsMenu();
        this.createExitButton();

        // Reorganize the UI when the game gets resized
        //this.scale.on('resize', this.resize, this);
    }

    createContainer () 
    {
        
        // Menu
        this.menuBG = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/Settings');
        this.menu = this.add.container(this.cameras.main.centerX - 18, this.cameras.main.centerY, [ this.menuBG ]).setScale(0.56);
        //This is just to move all the elements that are separate from the backgrounds
        this.menuElements = this.add.container(40, 0);

        // title and description
        let title = this.add.text(0, 0, this.title);
        title.setPosition(-title.width * 2, -350);
        title.setFontSize(48);
        title.setColor("black");
        this.menu.add(title);
        
    }

    createOptionsMenu()
    {

        this.musicOn = true;
        this.soundOn = true;

        let firstRow = -170;

        let rowGap = 135;

        let fontsize = 48;

        //The text align doesn't work on one line text
        this.musicButton = this.add.sprite(-400, firstRow, 'MenuAtlas', 'UI Buttons/CheckmarkON').setOrigin(0.5, 0.3);
        this.musicText = this.add.text(-200, firstRow, 'Music Enabled \n ', { fontSize: fontsize, color: "black", align: 'center', origin: { x: 0.5, y: 0.5 }});
        this.musicText.setPosition(-this.musicText.width * 0.5, firstRow);

        this.soundButton = this.add.image(-400, firstRow + rowGap, 'MenuAtlas', 'UI Buttons/CheckmarkON').setOrigin(0.5, 0.3);
        this.soundText = this.add.text(-200, firstRow + rowGap, 'Sound Enabled \n ', { fontSize: fontsize, color: "black", align: 'center', origin: { x: 0.5, y: 0.5 }});
        this.soundText.setPosition(-this.soundText.width * 0.5, firstRow + rowGap);


        this.fullScreenButton = this.add.image(-400, firstRow + rowGap * 2, 'MenuAtlas', 'UI Buttons/CheckmarkOFF').setOrigin(0.5, 0.3);
        this.fullScreenText = this.add.text(-200, firstRow + rowGap * 2, 'Fullscreen \n ', { fontSize: fontsize, color: "black", align: 'center', origin: { x: 0.5, y: 0.5 }});
        this.fullScreenText.setPosition(-this.fullScreenText.width * 0.5, firstRow + rowGap * 2);
        
        
        this.isFullscreen = this.scale.isFullscreen;
         
        this.musicButton.setInteractive();
        this.soundButton.setInteractive();
        this.fullScreenButton.setInteractive();

        //this.optionColumn = new uiWidgets.Column(this.game, -100, -200);

        this.menuElements.add([this.musicButton, this.musicText, this.soundButton, this.soundText, this.fullScreenButton, this.fullScreenText]);

        this.menu.add(this.menuElements);

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

            this.isFullscreen = !this.isFullscreen;

            this.updateFullScreen();


        }.bind(this));

        this.menu.setScale(0.56);
        
    }

    updateAudio() {
        if (config.musicOn == false) {
            this.musicButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkOFF');
        }
        else {
            this.musicButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkON');
        }
       
        if (config.soundOn == false) {
            this.soundButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkOFF');
        }
        else {
            this.soundButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkON');
        }
      }

      updateFullScreen() {
        if (this.isFullscreen) {
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
        //let exitButton = this.add.sprite(35, 400, 'MenuAtlas', 'UI Buttons/Sulje');
        let exitButton = CreateTextButton(this, 35, 400, 'UI Buttons/Nappi', 'Sulje');
        //let exitButton = this.add.container(this.menuBG.width / 2, -this.menuBG.height / 2, [ exitButtonBG ]);
        //exitButton.setSize(exitButtonBG.width, exitButtonBG.height);
        this.menu.add(exitButton);
        exitButton.setInteractive();

        var pressed = false;

        exitButton.on('pointerover', function () {
    
            //exitButtonBG.setTint(0xeb4034);
            
        });
    
        exitButton.on('pointerout', function () {
            exitButton.bg.setTexture('MenuAtlas', 'UI Buttons/Nappi');
            exitButton.bg.clearTint();
            pressed = false;
    
        });

        exitButton.on('pointerdown', function () {
            //exitButton.bg.setTexture('MenuAtlas', 'UI Buttons/Nappi_Pressed');
            exitButton.bg.setTint(0xd5d1c7);
            pressed = true;
    
        });
    
        exitButton.on('pointerup', function (event) {
            if (pressed)
            {
                exitButton.bg.setTexture('MenuAtlas', 'UI Buttons/Nappi');

                saveGame({musicOn: config.musicOn, soundOn: config.soundOn});

                this.scene.stop(this.scene.key);

                //this.time.paused = false;

                readyToMove = true;
            }
          }, this);

        
    }
}