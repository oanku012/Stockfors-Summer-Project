class MenuScene extends Phaser.Scene
{
    constructor(SceneKey)
    {
        super(SceneKey);

        this.title = 'Placeholder title';
        this.description = 'Placeholder description';

        //this.playerSpawnPosition = {};

        this.menuBG;
        this.menu;
        this.exitButton;

        this.images = [];
    }

    preload ()
    {
       
        this.load.image('buttonBG', 'Assets/images/menu/button-bg.png');
        this.load.image('buttonText', 'Assets/images/menu/button-text.png');
        this.load.image('menuBG', 'Assets/images/menu/menu-bg.png');
        this.load.image('exitButton', 'Assets/images/menu/exit-button.png');
        this.load.image('blankCheckBox', 'Assets/images/menu/blank-check-box.png');
        this.load.image('checkedBox', 'Assets/images/menu/check-box.png');
        this.load.image('1thumb', 'Assets/images/photos/1_thumb');
        this.load.image('1full', 'Assets/images/photos/1_full');
    }

    create ()
    {
        this.createContainer();
        this.createExitButton();
        console.log(this.scene.key);

        // Reorganize the UI when the game gets resized
        this.scale.on('resize', this.resize, this);

    }


    createContainer () 
    {
        // Menu
        this.menuBG = this.add.image(0, 0, 'menuBG');
        this.menu = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY, [ this.menuBG ]);

        // title and description
        let title = this.add.text(0, -350, this.title);
        title.setPosition(-title.width * 1.5, -350);
        title.setFontSize(48);
        title.setColor("black");
        this.menu.add(title);
        
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

        this.menu.add(description);

        // image thumbnails
        if (this.images.length > 0)
        {
            let imgTitle = this.add.text(0, 0, "Images");
            imgTitle.setPosition(-imgTitle.width * 1.5, 220);
            imgTitle.setFontSize(36);
            imgTitle.setColor("black");
            this.menu.add(imgTitle);

            var previousX = -200;

            this.images.forEach(element => {
                let img = this.add.image(0, 0, element[0])
                this.menu.add(img);
                img.setPosition(previousX, 320);
                previousX += 100;

                var pressed = false;

                img.setInteractive();

                img.on('pointerover', function () {
    
                    img.setTint(0xeb4034);
            
                });
            
                img.on('pointerout', function () {
            
                    img.clearTint();
                    pressed = false;
            
                });
        
                img.on('pointerdown', function () {
            
                    pressed = true;
            
                });
            
                img.on('pointerup', function (event) {
                    if (pressed)
                    {
                        // Open image
                        this.createImage(element[1]);
                    }
                  }, this);
            });
        }


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
        
    }

    createImage(image)
    {
        let newImage = this.add.image(0, 0, image);
        
        // add to menu for easy resize
        this.menu.add(newImage);
        var pressed = false;
        newImage.setInteractive();

        newImage.on('pointerout', function () {
    
            pressed = false;
    
        });

        newImage.on('pointerdown', function () {
    
            pressed = true;
    
        });
    
        newImage.on('pointerup', function (event) {
            if (pressed)
            {
                newImage.destroy();
            }
          }, this);
    }

    // Separate function because it needs to be overwritten
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
                // empty images manually to prevent crash
                this.images = [];

                this.scene.start('StockforsScene', playerExitPosition);
            }
          }, this);
    }


    resize()
    {
        if (this.scene.isActive(this.scene.key))
        {
            this.menu.setX(this.cameras.main.centerX);
            this.menu.setY(this.cameras.main.centerY);
        }
       
    }
}