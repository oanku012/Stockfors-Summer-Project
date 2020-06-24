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
        super.createContainer();
        
    }

    createOptionsMenu()
    {
        this.musicOn = true;
        this.soundOn = true;
         
        this.musicButton = this.add.image(-100, -200, 'checkedBox');
        this.musicText = this.add.text(0, -200, 'Music Enabled', { fontSize: 24, color: "black" });
         
        this.soundButton = this.add.image(-100, -100, 'checkedBox');
        this.soundText = this.add.text(0, -100, 'Sound Enabled', { fontSize: 24, color: "black"});
         
        this.musicButton.setInteractive();
        this.soundButton.setInteractive();

        this.menu.add([this.musicButton, this.musicText, this.soundButton, this.soundText]);

        // Call updateAudio to make sure we have correct values for checkboxes
        this.updateAudio();
         
        this.musicButton.on('pointerdown', function () {
            config.musicOn = !config.musicOn;
            this.updateAudio();
        }.bind(this));
         
        this.soundButton.on('pointerdown', function () {
            config.soundOn = !config.soundOn;
            this.updateAudio();
        }.bind(this));
    }

    updateAudio() {
        if (config.musicOn === false) {
            this.musicButton.setTexture('blankCheckBox');
        }
        else {
            this.musicButton.setTexture('checkedBox');
        }
       
        if (config.soundOn === false) {
            this.soundButton.setTexture('blankCheckBox');
        }
        else {
            this.soundButton.setTexture('checkedBox');
        }
      }
    

    createExitButton() 
    {
        // Exit button
        let exitButtonBG = this.add.image(0,0, 'exitButton');
        let exitButton = this.add.container(this.menuBG.width / 2, -this.menuBG.height / 2, [ exitButtonBG ]);
        exitButton.setSize(exitButtonBG.width, exitButtonBG.height);
        this.menu.add(exitButton);
        exitButton.setInteractive();

        var pressed = false;

        exitButton.on('pointerover', function () {
    
            exitButtonBG.setTint(0xeb4034);
    
        });
    
        exitButton.on('pointerout', function () {
    
            exitButtonBG.clearTint();
            pressed = false;
    
        });

        exitButton.on('pointerdown', function () {
            
            pressed = true;
    
        });
    
        exitButton.on('pointerup', function (event) {
            if (pressed)
            {
                this.scene.stop('OptionsMenuScene');

                readyToMove = true;
            }
          }, this);
    }
}