class MenuScene extends Phaser.Scene
{
    constructor(SceneKey)
    {
        super(SceneKey);

        this.title = 'Placeholder title';
        this.description = 'Placeholder description';

        this.playerSpawnPosition = {};
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
        console.log(this.scene.key);

    }


    createContainer () 
    {
        // Menu
        let menuBG = this.add.image(0, 0, 'menuBG');
        let menu = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY, [ menuBG ]);

        // title and description
        let title = this.add.text(0, -350, this.title);
        title.setPosition(-title.width * 1.5, -350);
        title.setFontSize(48);
        title.setColor("black");
        menu.add(title);
        
        let description = this.make.text({
                x: 0,
                y: 0,
                text: this.description,
                origin: { x: 0.5, y: 0.5 },
                style: {
                    font: '20px Arial',
                    fill: 'black',
                    wordWrap: { width: 500 }
                }
            });

        menu.add(description);

        // Keep menu in middle of screen
        let camera = this.cameras.main;
        camera.startFollow(menu, true, 0.08, 0.08);

        /* Button used for something maybe
        // Button
        let buttonBG = this.add.image(0, 0, 'buttonBG');
        let buttonText = this.add.image(0, 0, 'buttonText');

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

        this.createExitButton(menuBG, menu);
        
    }

    // Separate function because it needs to be overwritten
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
            this.scene.start('StockforsScene', this.playerSpawnPosition.x, this.playerSpawnPosition.y);
          }, this);
    }

    
}