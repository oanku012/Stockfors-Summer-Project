class MenuScene extends Phaser.Scene
{
    constructor()
    {
        super('MenuScene');

    }

    preload ()
    {
       
        this.load.image('buttonBG', 'Assets/images/menu/button-bg.png');
        this.load.image('buttonText', 'Assets/images/menu/button-text.png');
        this.load.image('menuBG', 'Assets/images/menu/menu-bg.png');
        this.load.image('exitButton', 'Assets/images/menu/exit-button.png');
    }

    create ()
    {
        this.createContainer ();

    }


    createContainer () 
    {
        // Menu
        let menuBG = this.add.image(0, 0, 'menuBG');
        let menu = this.add.container(400, 800, [ menuBG ]);

        /*
        // Button
        let buttonBG = this.add.image(0, 0, 'buttonBG');
        let buttonText = this.add.image(0, 0, 'buttonText');
        */ 

        // Exit button
        let exitButtonBG = this.add.image(0,0, 'exitButton');
        let exitButton = this.add.container(700, 400, [ exitButtonBG ]);
        exitButton.setSize(exitButtonBG.width, exitButtonBG.height);
        exitButton.setInteractive();
    
        /*
        button.on('pointerover', function () {
    
            buttonBG.setTint(0x44ff44);
    
        });
    
        button.on('pointerout', function () {
    
            buttonBG.clearTint();
    
        });
    
        button.on('pointerdown', function () {
            // Click function
            
        });
        */

        exitButton.on('pointerover', function () {
    
            exitButtonBG.setTint(0xeb4034);
    
        });
    
        exitButton.on('pointerout', function () {
    
            exitButtonBG.clearTint();
    
        });
    
        exitButton.on('pointerdown', function (event) {
            this.scene.start('StockforsScene');
          }, this);
    
        
    }
}