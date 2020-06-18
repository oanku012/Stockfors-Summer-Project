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
        super.create();
    }

    createContainer () 
    {
        super.createContainer();
    }

    createExitButton(menuBG, menu) 
    {
        // Exit button
        let exitButtonBG = this.add.image(0,0, 'exitButton');
        let exitButton = this.add.container(menuBG.width / 2, -menuBG.height / 2, [ exitButtonBG ]);
        exitButton.setSize(exitButtonBG.width, exitButtonBG.height);
        menu.add(exitButton);
        exitButton.setInteractive();

        exitButton.on('pointerover', function () {
    
            exitButtonBG.setTint(0xeb4034);
    
        });
    
        exitButton.on('pointerout', function () {
    
            exitButtonBG.clearTint();
    
        });
    
        exitButton.on('pointerdown', function (event) {
            this.scene.stop('OptionsMenuScene');
          }, this);
    }
}