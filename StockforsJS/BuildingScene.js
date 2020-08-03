class BuildingScene extends Phaser.Scene {
    constructor(SceneKey) {
        super(SceneKey);

        this.name;

        this.title = 'Placeholder title';
        //this.ohjeTitle = 'Placeholder ohje';


        //this.playerSpawnPosition = {};

        //The minigame for this building
        this.minigame;
        this.url;

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
        
        this.cameras.main.backgroundColor.setTo(255, 255, 255);
    }

    create() {
        this.infoTexts = [];
        this.infoCards = [];
        //this.images = [];
        this.switchableContainers = [];


        // Get text data from a json file
        this.data = this.cache.json.get('data').Buildings;

        console.log(this.data);

        if (this.data[this.name].Title != null && this.data[this.name].InfoCards != null) {
            this.title = this.data[this.name].Title;

            this.infoTexts = this.data[this.name].InfoCards;

            console.log('Title added: ' + this.title);
        }

        this.createMenuContainer();
        this.CreateInstructions();
        this.createExitButton();
        this.CreateBottomButtons();
        this.CreateInstructionButton();
        this.CreateAlbum();
        this.CreateInfoContainer();
        console.log(this.scene.key);

        this.ContainerTransition(this.infoContainer);

        // Reorganize the UI when the game gets resized
        //this.scale.on('resize', this.resize, this);

    }

    createMenuContainer() {
        // Menu
        this.menuBG = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/InsideVaaka');
        this.menu = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY, [this.menuBG]).setScale(0.7);

        // title and description
        let title = this.add.text(0, -350, this.title);
        title.setFontSize(64);
        title.setPosition(0, -480);
        title.setColor("black");
        title.setFontFamily('LexendTera');
        title.setOrigin(0.5, 0.5);
        this.menu.add(title);





    }

    CreateInstructions() {
        this.ohjeBG = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/Ohjeet-infoikkuna');
        this.ohje = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY, [this.ohjeBG]).setScale(0.56);

        // title
        let title = this.add.text(0, -450, this.data['Ohjeet'].Title);
        title.setFontSize(64);
        title.setPosition(-title.width * .7, -680);
        title.setColor("black");

        let textX = -320;

        let style = {
            font: '34px Carme',
            fill: 'black',
            wordWrap: { width: 600 }
        };

        let infoDescription = this.make.text({
            x: textX,
            y: -433,
            text: this.data['Ohjeet'].InfoCards,
            origin: { x: 0, y: 0.5 },
            style: style
        });

        let albumDescription = this.make.text({
            x: textX,
            y: -247,
            text: this.data['Ohjeet'].Album,
            origin: { x: 0, y: 0.5 },
            style: style
        });

        let panoDescription = this.make.text({
            x: textX,
            y: -67,
            text: this.data['Ohjeet'].Panoramas,
            origin: { x: 0, y: 0.5 },
            style: style
        });

        let gameDescription = this.make.text({
            x: textX,
            y: 120,
            text: this.data['Ohjeet'].Game,
            origin: { x: 0, y: 0.5 },
            style: style
        });

        let webDescription = this.make.text({
            x: textX,
            y: 310,
            text: this.data['Ohjeet'].Web,
            origin: { x: 0, y: 0.5 },
            style: style
        });

        this.ohje.setVisible(false);

        let backButton = CreateTextButton(this, (-this.ohjeBG.width / 2) + 270, (this.ohjeBG.height / 2) - 100, 'UI Buttons/Takaisin', this.data.Back);

        backButton.on('pointerup', function (event) {
            if (backButton.pressed) {
                this.ohje.setVisible(false);
                this.menu.setVisible(true);
            }
        }, this);

        this.ohje.add([backButton, title, infoDescription, albumDescription, panoDescription, gameDescription, webDescription]);
    }

    CreateInstructionButton() {
        this.instructionButton = this.add.sprite((this.menuBG.width / 2 - 30), (this.menuBG.height / 2) - 20, 'MenuAtlas', 'UI Buttons/Ohje');

        this.instructionButton.setInteractive();

        this.instructionButton.on('pointerdown', function () {
            this.instructionButton.setTint(0xd5d1c7);
            this.instructionButton.pressed = true;
        }, this);

        this.instructionButton.on('pointerout', function () {
            if (this.input.activePointer.isDown) {
                this.instructionButton.clearTint();
                this.instructionButton.pressed = false;
            }
        }, this);


        this.instructionButton.on('pointerup', function (event) {
            if (this.instructionButton.pressed) {
                this.instructionButton.clearTint();
                this.ohje.setVisible(true);
                this.menu.setVisible(false);
                this.instructionButton.pressed = false;
            }
        }, this);

        this.menu.add(this.instructionButton);
    }

    // Separate function because it needs to be overwritten
    createExitButton() {



        this.exitButton = CreateTextButton(this, (-this.menuBG.width / 2) + 100, (this.menuBG.height / 2) - 20, 'UI Buttons/Takaisin', this.data.Back);

        this.menu.add(this.exitButton);

        /*let exitButtonBG = this.exitButton.bg;

        this.exitButton.setInteractive();

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
        }, this);*/


        this.exitButton.on('pointerup', function (event) {
            if (this.exitButton.pressed) {
                // empty images manually to prevent crash
                this.images = [];

                this.scene.start(gameState.currentMap, { x: gameState.playerX, y: gameState.playerY });
            }
        }, this);
    }

    CreateBottomButtons() {

        let rightMostPosition = -75;

        let buttonsAdded = 0;

        this.menuButtons = this.add.container(buttonsAdded * 20, (this.menuBG.height / 2) - 100);

        let buttonGap = 180;

        if (this.minigame) {

            this.minipeliButton = this.add.sprite(rightMostPosition - (buttonsAdded * buttonGap), 0, 'MenuAtlas', 'UI Buttons/Games');

            this.minipeliButton.on('pointerup', function () {
                if (this.minipeliButton.pressed == true) {
                    this.scene.start(this.minigame);
                }
            }, this);

            this.menuButtons.add(this.minipeliButton);

            buttonsAdded++;
        }

        //Just for testing
        this.panoramas = true;

        if (this.panoramas) {
            this.panoramaButton = this.add.sprite(rightMostPosition - (buttonsAdded * buttonGap), 0, 'MenuAtlas', 'UI Buttons/Panorama');

            this.panoramaButton.on('pointerup', function () {
                //Start panorama here
            }, this);

            this.menuButtons.add(this.panoramaButton);

            buttonsAdded++;
        }

        this.infoButton = this.add.sprite(rightMostPosition - (buttonsAdded * buttonGap), 0, 'MenuAtlas', 'UI Buttons/Infocards');

        this.infoButton.on('pointerup', function () {
            if (this.infoButton.pressed) {
                this.ContainerTransition(this.infoContainer);
            }
        }, this);

        this.menuButtons.add(this.infoButton);

        buttonsAdded++;

        this.albumButton = this.add.sprite(rightMostPosition - (buttonsAdded * buttonGap), 0, 'MenuAtlas', 'UI Buttons/Gallery');

        this.albumButton.on('pointerup', function () {
            if (this.albumButton.pressed) {
                this.ContainerTransition(this.albumContainer);
            }

        }, this);

        this.menuButtons.add(this.albumButton);

        buttonsAdded++;

        if (this.url) {
            this.webButton = this.add.sprite(rightMostPosition - (buttonsAdded * buttonGap), 0, 'MenuAtlas', 'UI Buttons/Webpage');

            this.webButton.on('pointerup', function () {
                if (this.webButton.pressed) {

                    window.open(this.url);
                }

            }, this);

            this.menuButtons.add(this.webButton);

            buttonsAdded++;
        }

        let menuButtonsWidth = 0;

        this.menu.add(this.menuButtons);

        this.menuButtons.iterate(function (button) {

            if (button) {

                menuButtonsWidth += button.width;

                button.setInteractive();

                button.defaultFrame = button.frame.name;

                button.on('pointerdown', function () {
                    button.setTint(0xd5d1c7);
                    button.pressed = true;
                }, this);

                button.on('pointerout', function () {
                    if (this.input.activePointer.isDown) {
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

        this.infoTexts.forEach(infoText => {
            let infoCard = this.CreateInfoCard(infoText);

            this.infoCards.push(infoCard);

            this.infoContainer.add([infoCard, infoCard.description]);

            //console.log(infoText);
        }, this);

        let arrowButtonForward = this.add.sprite(600, 0, 'MenuAtlas', 'UI Buttons/Nuoli');
        let arrowButtonBackward = this.add.sprite(-600, 0, 'MenuAtlas', 'UI Buttons/Nuoli').setFlipX(true);

        //this.infoContainer.add(this.infoCards);

        this.openedCard = 0;

        this.ChangeCard(this.openedCard);

        this.infoContainer.add([arrowButtonForward, arrowButtonBackward]);

        this.infoContainer.iterate(function (element) {
            element.setInteractive();

            element.on('pointerdown', function () {
                element.pressed = true;
                element.setTint(0xd5d1c7);
            });

            element.on('pointerout', function () {
                element.pressed = false;
                element.clearTint();
            });

            element.on('pointerup', function () {


                if (element.pressed == true) {
                    element.clearTint();
                    if (element.flipX == false && this.openedCard < this.infoCards.length - 1) {
                        this.openedCard++;
                        this.ChangeCard(this.openedCard);
                    }
                    else if (element.flipX && this.openedCard > 0) {
                        this.openedCard--;
                        this.ChangeCard(this.openedCard);
                    }
                }
            }, this)
        }, this);

        this.switchableContainers.push(this.infoContainer);

        this.menu.add(this.infoContainer);
    }

    CreateInfoCard(text) {


        let infoCard = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/InsideVaaka').setScale(0.5, 0.68);

        infoCard.description = this.make.text({
            x: 0,
            y: 0,
            text: text,
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: '34px Carme',
                fill: 'black',
                wordWrap: { width: 780 }
            }
        });

        console.log('Card created with text: ' + text);

        return infoCard;
    }

    ChangeCard(cardIndex) {
        this.infoCards.forEach(card => {
            card.setVisible(false);
            card.description.setVisible(false);
        });

        this.infoCards[cardIndex].setVisible(true);
        this.infoCards[cardIndex].description.setVisible(true);

        console.log('Changed to: ' + cardIndex);
    }

    CreateAlbum() {
        this.albumContainer = this.add.container(0, -500).setScale(1.2);

        // image thumbnails
        if (this.images.length > 0) {
            /*let imgTitle = this.add.text(0, 0, "Images");
            imgTitle.setPosition(-imgTitle.width * 1.5, 120);
            imgTitle.setFontSize(36);
            imgTitle.setColor("black");*/
            //this.menu.add(imgTitle);
            //this.albumContainer.add(imgTitle);

            var previousX = -300;

            let column = 0;
            let rowLimit = 5;
            let row = 1;

            this.images.forEach(element => {
                let img = this.add.image(previousX, 50 + 120 * row, element).setScale(0.03);
                this.albumContainer.add(img);
                //img.setPosition(previousX, 50 + 100*row);
                previousX += 150;

                var pressed = false;

                column++;

                if (column >= rowLimit) {
                    row++;
                    column = 0;
                    previousX = -300;
                }

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
                        this.createImage(element);
                    }
                }, this);
            });
        }

        this.menu.add(this.albumContainer);

        this.switchableContainers.push(this.albumContainer);
    }

    createImage(image) {
        let newImage = this.add.image(0, 0, image).setScale(0.5);

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

    CreatePanoRamaContainer()
    {

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