class BuildingScene extends Phaser.Scene {
    constructor(SceneKey) {
        super(SceneKey);

        this.name;

        this.title = 'Placeholder title';
        this.description = 'Placeholder description';

        //this.playerSpawnPosition = {};

        //The minigame for this building
        this.minigame;

        this.panoramas;

        this.menuBG;
        this.menu;

        this.exitButton;
        this.minipeliButton;
        this.panoramaButton;
        this.infoButton;
        this.albumButton;

        this.menuButtons;

        this.infoTexts = [];
        this.infoCards = [];
        this.images = [];

        this.switchableContainers = [];
    }

    preload() {

    }

    create() {
        this.cameras.main.backgroundColor.setTo(255, 255, 255);

        // Get title and description from a json file
        var data = this.cache.json.get('buildingData');

        console.log(data);

        if (data[this.name][0] != null && data[this.name][1] != null) {
            this.title = data[this.name][0];
            //this.description = data[this.name][1];

            this.infoTexts = data[this.name][1];

            console.log('Title added: ' + this.title);
        }

        this.createContainer();
        this.createExitButton();
        this.CreateBottomButtons();
        this.CreateAlbum();
        this.CreateInfoContainer();
        console.log(this.scene.key);

        this.ContainerTransition(this.infoContainer);

        // Reorganize the UI when the game gets resized
        //this.scale.on('resize', this.resize, this);

    }

    createContainer() {
        // Menu
        this.menuBG = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/InsideVaaka');
        this.menu = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY, [this.menuBG]).setScale(0.56);

        //this.menu.setSize(this.menuBG.width, this.menuBG.height);

        // title and description
        let title = this.add.text(0, -350, this.title);
        title.setFontSize(64);
        title.setPosition(-title.width * .5, -480);
        title.setColor("black");
        this.menu.add(title);





    }

    // Separate function because it needs to be overwritten
    createExitButton() {



        this.exitButton = CreateTextButton(this, (-this.menuBG.width / 2) + 200, (this.menuBG.height / 2) - 100, 'UI Buttons/Takaisin', 'Takaisin');
        //this.add.sprite((-this.menuBG.width / 2) + 200, (this.menuBG.height / 2) - 100, 'MenuAtlas', 'UI Buttons/Takaisin');
        //this.exitButton = this.add.container((-this.menuBG.width / 2) + 200, (this.menuBG.height / 2) - 100, [exitButtonBG]);
        //this.exitButton.setSize(exitButtonBG.width, exitButtonBG.height);
        this.menu.add(this.exitButton);

        let exitButtonBG = this.exitButton.bg;

        this.exitButton.setInteractive();

        exitButtonBG.defaultFrame = exitButtonBG.frame.name;

        this.exitButton.on('pointerdown', function () {
            //exitButtonBG.setTexture('MenuAtlas', exitButtonBG.defaultFrame + '_Pressed');
            exitButtonBG.setTint(0xd5d1c7);
            this.exitButton.pressed = true;
        }, this);

        this.exitButton.on('pointerout', function () {
            if (this.input.activePointer.isDown) {
                //exitButtonBG.setTexture('MenuAtlas', exitButtonBG.defaultFrame);
                exitButtonBG.clearTint();
                this.exitButton.pressed = false;
            }
        }, this);


        this.exitButton.on('pointerup', function (event) {
            if (this.exitButton.pressed) {
                // empty images manually to prevent crash
                this.images = [];

                this.scene.start('StockforsScene', { x: gameState.playerX, y: gameState.playerY });
            }
        }, this);
    }

    CreateBottomButtons() {

        let rightMostPosition = -60;

        let buttonsAdded = 0;

        this.menuButtons = this.add.container(buttonsAdded * 20, (this.menuBG.height / 2) - 100);


        if (this.minigame) {

            this.minipeliButton = this.add.sprite(rightMostPosition - (buttonsAdded * 200), 0, 'MenuAtlas', 'UI Buttons/Games');

            this.minipeliButton.on('pointerup', function () {
                if (this.minipeliButton.pressed == true) {
                    this.scene.start(this.minigame);
                }
            }, this);

            //this.menu.add(this.minipeliButton);

            this.menuButtons.add(this.minipeliButton);

            buttonsAdded++;
        }

        //console.log(this.minipeliButton.width/2);

        //Just for testing
        //this.panoramas = true;

        if (this.panoramas) {
            this.panoramaButton = this.add.sprite(rightMostPosition - (buttonsAdded * 200), 0, 'MenuAtlas', 'UI Buttons/Panorama');

            this.panoramaButton.on('pointerup', function () {
                //Start panorama here
            }, this);

            //this.menu.add(this.panoramaButton);

            this.menuButtons.add(this.panoramaButton);

            buttonsAdded++;
        }

        this.infoButton = this.add.sprite(rightMostPosition - (buttonsAdded * 200), 0, 'MenuAtlas', 'UI Buttons/Infocards');

        this.infoButton.on('pointerup', function () {
            if (this.infoButton.pressed) {
                this.ContainerTransition(this.infoContainer);
            }
        }, this);

        //this.menu.add(this.infoButton);

        this.menuButtons.add(this.infoButton);

        buttonsAdded++;

        this.albumButton = this.add.sprite(rightMostPosition - (buttonsAdded * 200), 0, 'MenuAtlas', 'UI Buttons/Gallery');

        this.albumButton.on('pointerup', function () {
            if (this.albumButton.pressed) {
                this.ContainerTransition(this.albumContainer);
            }

        }, this);

        //this.menu.add(this.albumButton);

        this.menuButtons.add(this.albumButton);

        let menuButtonsWidth = 0;

        buttonsAdded++;

        this.menu.add(this.menuButtons);

        this.menuButtons.iterate(function (button) {

            if (button) {

                menuButtonsWidth += button.width;

                button.setInteractive();

                button.defaultFrame = button.frame.name;

                button.on('pointerdown', function () {
                    //button.setTexture('MenuAtlas', button.defaultFrame + '_Pressed');
                    button.setTint(0xd5d1c7);
                    button.pressed = true;
                }, this);

                button.on('pointerout', function () {
                    if (this.input.activePointer.isDown) {
                        //button.setTexture('MenuAtlas', button.defaultFrame);¨
                        button.clearTint();
                        button.pressed = false;
                    }
                }, this);

                button.on('pointerup', function () {
                    button.clearTint();
                })
            }

        }, this);

        this.menuButtons.setSize(menuButtonsWidth, this.infoButton.height);

        this.menuButtons.setPosition(this.menuButtons.width / 2, (this.menuBG.height / 2) - 100);

        /*let graphics = this.add.graphics({lineStyle: {width: 2, color: 'red'}, fillStyle: 'red'});

        graphics.strokeRectShape(this.menu.getBounds());
        graphics.strokeRectShape(this.menuButtons.getBounds());*/
    }

    resize() {
        if (this.scene.isActive(this.scene.key)) {
            this.menu.setX(this.cameras.main.centerX);
            this.menu.setY(this.cameras.main.centerY);
        }

    }

    CreateInfoContainer() {
        this.infoContainer = this.add.container(0, 0);


        this.infoTexts.forEach(infoText =>{
            let infoCard = this.CreateInfoCard(infoText);

            this.infoCards.push(infoCard);

            this.infoContainer.add([infoCard, infoCard.description]);

            console.log(infoText);
        }, this);

        let arrowButtonForward = this.add.sprite(500, 0, 'MenuAtlas', 'UI Buttons/Nuoli');
        let arrowButtonBackward = this.add.sprite(-500, 0, 'MenuAtlas', 'UI Buttons/Nuoli').setFlipX(true);

        //this.infoContainer.add(this.infoCards);

        this.openedCard = 0;

        this.ChangeCard(this.openedCard);

        this.infoContainer.add([arrowButtonForward, arrowButtonBackward]);

        this.infoContainer.iterate(function (element) {
            element.setInteractive();

            element.on('pointerdown', function () {
                element.pressed = true;
                element.setTint(0xd5d1c7);
            })

            element.on('pointerout', function () {
                element.pressed = false;
                element.clearTint();
            })

            element.on('pointerup', function () {
                

                if(element.pressed == true)
                {
                    element.clearTint();
                    if(element.flipX == false && this.openedCard < this.infoCards.length - 1)
                    {
                        this.openedCard++;
                        this.ChangeCard(this.openedCard);
                    }
                    else if(element.flipX && this.openedCard > 0)
                    {
                        this.openedCard--;
                        this.ChangeCard(this.openedCard); 
                    }
                }
            }, this)
        }, this);

        this.switchableContainers.push(this.infoContainer);

        this.menu.add(this.infoContainer);
    }

    CreateInfoCard(text)
    {
        let infoCard = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/InsideVaaka').setScale(0.45, 0.6);

        infoCard.description = this.make.text({
            x: 0,
            y: 0,
            text: text,
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: '34px Arial',
                fill: 'black',
                wordWrap: { width: 500 }
            }
        });

        

        return infoCard;
    }

    ChangeCard(cardIndex)
    {
        this.infoCards.forEach(card =>{
            card.setVisible(false);
            card.description.setVisible(false);
        });

        this.infoCards[cardIndex].setVisible(true);
        this.infoCards[cardIndex].description.setVisible(true);
    }

    CreateAlbum() {
        this.albumContainer = this.add.container(0, -500).setScale(1.2);

        // image thumbnails
        if (this.images.length > 0) {
            let imgTitle = this.add.text(0, 0, "Images");
            imgTitle.setPosition(-imgTitle.width * 1.5, 120);
            imgTitle.setFontSize(36);
            imgTitle.setColor("black");
            //this.menu.add(imgTitle);
            this.albumContainer.add(imgTitle);

            var previousX = -200;

            this.images.forEach(element => {
                let img = this.add.image(0, 0, element[0])
                this.albumContainer.add(img);
                img.setPosition(previousX, 220);
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
                    if (pressed) {
                        // Open image
                        this.createImage(element[1]);
                    }
                }, this);
            });
        }

        this.menu.add(this.albumContainer);

        this.switchableContainers.push(this.albumContainer);
    }

    createImage(image) {
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
            if (pressed) {
                newImage.destroy();
            }
        }, this);
    }

    ContainerTransition(containerToOpen) {
        this.switchableContainers.forEach(function (element) {
            if (element == containerToOpen) {
                element.setVisible(true);
            }
            else {
                element.setVisible(false);
            }
        })
    }

}