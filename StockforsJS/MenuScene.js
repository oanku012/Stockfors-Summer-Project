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
        console.log(this.scene.key);

    }


    createContainer () 
    {
        // Get coordinates for placement


        // Menu
        let menuBG = this.add.image(0, 0, 'menuBG');
        let menu = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY, [ menuBG ]);

        /*
        // Button
        let buttonBG = this.add.image(0, 0, 'buttonBG');
        let buttonText = this.add.image(0, 0, 'buttonText');
        */ 

        // Exit button
        let exitButtonBG = this.add.image(0,0, 'exitButton');
        let exitButton = this.add.container(menuBG.width / 2, -menuBG.height / 2, [ exitButtonBG ]);
        exitButton.setSize(exitButtonBG.width, exitButtonBG.height);
        menu.add(exitButton);
        exitButton.setInteractive();

        let title = this.add.text(0, -350, 'f');
        title.setPosition(-title.width * 1.5, -350);
        title.setFontSize(48);
        title.setColor("black");
        menu.add(title);
        
        let description = this.make.text({
                x: 0,
                y: 0,
                // Maybe put the text in a separate text file for clarity
                text:'The vertical scroll factor of this Game Object. The scroll factor controls the influence of the movement of a Camera upon this Game Object. When a camera scrolls it will change the location at which this Game Object is rendered on-screen. It does not change the Game Objects actual position values. A value of 1 means it will move exactly in sync with a camera. A value of 0 means it will not move at all, even if the camera moves. Other values control the degree to which the camera movement is mapped to this Game Object. Please be aware that scroll factor values other than 1 are not taken in to consideration when calculating physics collisions. Bodies always collide based on their world position, but changing the scroll factor is a visual adjustment to where the textures are rendered, which can offset them from physics bodies if not accounted for in your code.',
                origin: { x: 0.5, y: 0.5 },
                style: {
                    font: '20px Arial',
                    fill: 'black',
                    wordWrap: { width: 500 }
                }
            });

        menu.add(description);
    
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