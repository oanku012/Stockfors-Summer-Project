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
        this.backgroundImage;

        this.panoramas;
        this.panoramaThumbs;

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

        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;

        //let bounds = this.matter.world.setBounds(-90, 0, 2500, 1000, 64, true, true, false, false);

        //Stops ongoing sounds that started in the map scene from playing
        this.sound.stopAll();

        let background = this.add.image(this.centerX, this.centerY, this.backgroundImage).setDepth(0);

        background.setDisplaySize(this.sys.canvas.width, (this.sys.canvas.width / background.width) * background.height);

        this.infoTexts = [];
        this.infoCards = [];
        //this.images = [];
        this.switchableContainers = [];


        // Get text data from a json file
        this.data = this.cache.json.get('data').Buildings;

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
        if (this.panoramas && this.panoramaThumbs) {
            this.CreatePanoRamaContainer();
        }
        console.log(this.scene.key);

        this.ContainerTransition(this.infoContainer);

        // Reorganize the UI when the game gets resized
        //this.scale.on('resize', this.resize, this);

    }

    createMenuContainer() {
        // Menu
        this.menuBG = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/InsideVaaka');
        this.menu = this.add.container(this.centerX, this.centerY - 20, [this.menuBG]).setScale(0.8);

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
        this.ohje = this.add.container(this.centerX, this.centerY, [this.ohjeBG]).setScale(0.56);

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
        this.instructionButton = CreateButton(this, (this.menuBG.width / 2 - 30), (this.menuBG.height / 2) - 20, 'UI Buttons/Ohje');
        //this.instructionButton = this.add.sprite((this.menuBG.width / 2 - 30), (this.menuBG.height / 2) - 20, 'MenuAtlas', 'UI Buttons/Ohje');

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


        this.exitButton.on('pointerup', function (event) {
            if (this.exitButton.pressed) {
                // empty images manually to prevent crash
                this.images = [];

                this.scene.start(gameState.currentMap, { x: gameState.playerX, y: gameState.playerY, readyToEnter: false });
            }
        }, this);
    }

    CreateBottomButtons() {

        let rightMostPosition = -80;

        let buttonsAdded = 0;

        this.menuButtons = this.add.container(buttonsAdded * 20, (this.menuBG.height / 2) - 100).setScale(0.9);

        let buttonGap = 200;

        if (this.minigame) {

            //this.minipeliButton = this.add.sprite(rightMostPosition - (buttonsAdded * buttonGap), 0, 'MenuAtlas', 'UI Buttons/Games');
            this.minipeliButton = CreateButton(this, rightMostPosition - (buttonsAdded * buttonGap), 0, 'UI Buttons/Games');

            this.minipeliButton.on('pointerup', function () {
                if (this.minipeliButton.pressed == true) {
                    this.scene.start(this.minigame);
                }
            }, this);

            this.menuButtons.add(this.minipeliButton);

            buttonsAdded++;
        }

        if (this.panoramas) {
            //this.panoramaButton = this.add.sprite(rightMostPosition - (buttonsAdded * buttonGap), 0, 'MenuAtlas', 'UI Buttons/Panorama');
            this.panoramaButton = CreateButton(this, rightMostPosition - (buttonsAdded * buttonGap), 0, 'UI Buttons/Panorama');

            this.panoramaButton.on('pointerup', function () {
                //Start panorama here
                if (this.panoramaButton.pressed) {
                    this.ContainerTransition(this.panoramaContainer);

                }
            }, this);

            this.menuButtons.add(this.panoramaButton);

            buttonsAdded++;
        }

        //this.infoButton = this.add.sprite(rightMostPosition - (buttonsAdded * buttonGap), 0, 'MenuAtlas', 'UI Buttons/Infocards');
        this.infoButton = CreateButton(this, rightMostPosition - (buttonsAdded * buttonGap), 0, 'UI Buttons/Infocards');

        this.infoButton.on('pointerup', function () {
            if (this.infoButton.pressed) {
                this.ContainerTransition(this.infoContainer);
            }
        }, this);

        this.menuButtons.add(this.infoButton);

        buttonsAdded++;

        //Scene breaks if no album????
        if (this.images) {
            this.albumButton = CreateButton(this, rightMostPosition - (buttonsAdded * buttonGap), 0, 'UI Buttons/Gallery');
            //this.albumButton = this.add.sprite(rightMostPosition - (buttonsAdded * buttonGap), 0, 'MenuAtlas', 'UI Buttons/Gallery');

            this.albumButton.on('pointerup', function () {
                if (this.albumButton.pressed) {
                    this.ContainerTransition(this.albumContainer);
                }

            }, this);

            this.menuButtons.add(this.albumButton);

            buttonsAdded++;

        }

        if (this.url) {
            //this.webButton = this.add.sprite(rightMostPosition - (buttonsAdded * buttonGap), 0, 'MenuAtlas', 'UI Buttons/Webpage');
            this.webButton = CreateButton(this, rightMostPosition - (buttonsAdded * buttonGap), 0, 'UI Buttons/Webpage');

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

                button.defaultFrame = button.frame.name;
            }

        }, this);

        this.menuButtons.setSize(menuButtonsWidth, this.infoButton.height);

        this.menuButtons.setPosition(this.menuButtons.width / 2, (this.menuBG.height / 2) - 100);

    }

    resize() {
        if (this.scene.isActive(this.scene.key)) {
            this.menu.setX(this.centerX);
            this.menu.setY(this.centerY);
        }

    }

    CreateInfoContainer() {
        this.infoContainer = this.add.container(0, 0);

        this.infoTexts.forEach(infoText => {

            this.CreateInfoCards(infoText);

        }, this);

        let arrowButtonForward = CreateButton(this, 700, 0, 'UI Buttons/Nuoli').setScale(0.9);
        let arrowButtonBackward = CreateButton(this, -700, 0, 'UI Buttons/Nuoli').setFlipX(true).setScale(0.9);

        this.infoContainer.add([arrowButtonForward, arrowButtonBackward]);

        this.infoContainer.iterate(function (element) {

            if (element === arrowButtonForward || element === arrowButtonBackward) {

                element.on('pointerup', function () {


                    if (element.pressed == true) {

                        if (element === arrowButtonForward && this.openedCard < this.infoCards.length - 1) {
                            this.openedCard++;
                            this.ChangeCard(this.openedCard);
                        }
                        else if (element === arrowButtonBackward && this.openedCard > 0) {
                            this.openedCard--;
                            this.ChangeCard(this.openedCard);
                        }
                    }
                }, this)

            }
        }, this);

        this.switchableContainers.push(this.infoContainer);

        this.menu.add(this.infoContainer);

        this.infoContainer.button = this.infoButton;

        this.infoContainer.arrowForw = arrowButtonForward;
        this.infoContainer.arrowBack = arrowButtonBackward;

        this.openedCard = 0;

        //this.ChangeCard(this.openedCard);
    }

    CreateInfoCards(text){
        
        let infoDiv = document.createElement('div');

        infoDiv.style = 'padding: 15px; padding-top: 0; overflow-x: hidden; width: 770px; height: 650px; background-Image: url("Assets/images/menu/Infokorttipohja.png"); background-size: 100% 103%; background-repeat: no-repeat; background-position: -10px, -15px; font: 33px Carme'
        infoDiv.innerHTML = text;

        let infoDom = this.add.dom(this.centerX, this.centerY - 10, infoDiv)
    }

    /*
    CreateInfoCards(text) {


        let maxLines = 18;

        let remainingLines = text;

        this.infoContainer.zoomed = false;

        //This is just a really clumsy and convoluted way of automatically splitting the infocard text across multiple cards
        do {
            let infoCard = this.add.sprite(0, 5, 'MenuAtlas', 'UI Pohjat/Infokorttipohja').setScale(1.3);

            //Linebreaks disappear when the string is later turned into an array and back into a string so £ is used to indicate a spot for a linebreak
            let lineToUse = remainingLines.replace(/£/g, '');

            //This is the visible text on a card that has all the £ taken out
            infoCard.description = this.make.text({
                x: -480,
                y: -375,
                text: lineToUse,
                origin: { x: 0, y: 0 },
                style: {
                    font: '33px Carme',
                    fill: 'black',
                    wordWrap: { width: 972 }
                }
            });

            //This one isn't visible, but it has the £ symbols which we can use later
            let dummyDescription = this.make.text({
                text: remainingLines,
                style: {
                    font: '33px Carme',
                    fill: 'black',
                    wordWrap: { width: 972 }
                },
                visible: false
            });

            //Set the maximum number of lines so the text won't overflow from the card
            infoCard.description.setMaxLines(maxLines);
            dummyDescription.setMaxLines(maxLines);

            //This is an array of lines that are added to a card, does not account for the max lines so lines beyond the ones shown on the card are here
            let wrappedText = dummyDescription.getWrappedText();

            //Here we separate the lines from the array that are on the new card from the remaining lines and turn it into a string, the linebreaks don't carry over to the new string
            let usedLines = wrappedText.slice(0, maxLines).join("").toString();

            //console.log(usedLines);

            //This gets the remaining lines for the later cards by replacing the lines in the current card with an empty string
            remainingLines = wrappedText.join("").toString().replace(usedLines, "");

            //console.log(remainingLines);

            //Because the linebreaks don't carry over they have to be added here, £ is also added so later cards still have it as an indicator for the linebreaks
            remainingLines = remainingLines.replace(/£/g, '£\n\n');



            this.infoCards.push(infoCard);

            this.infoContainer.add([infoCard, infoCard.description]);


        }//Loop as long as there are still lines to add
        while (remainingLines !== "");


        this.infoContainer.zoomButton = CreateButton(this, 530, -390, 'UI Buttons/Zoom_In');
        //this.infoContainer.zoomButton = this.add.sprite(530, -390, 'MenuAtlas', 'UI Buttons/Zoom_In');

        let zoom = this.infoContainer.zoomButton;


        zoom.on('pointerup', function () {
            if (zoom.pressed === true && this.infoContainer.zoomed === false) {

                this.infoContainer.setScale(1.5);
                this.infoContainer.zoomed = true;
                this.infoContainer.arrowForw.setScale(0.675);
                this.infoContainer.arrowBack.setScale(0.675);
                this.ChangeVisibility([this.infoContainer]);
                zoom.setTexture('MenuAtlas', 'UI Buttons/Zoom_Out');

            }
            else if (zoom.pressed && this.infoContainer.zoomed) {

                this.ChangeVisibility(true);

                this.infoContainer.setScale(1);
                this.infoContainer.zoomed = false;
                this.infoContainer.arrowForw.setScale(0.9);
                this.infoContainer.arrowBack.setScale(0.9);
                this.ContainerTransition(this.infoContainer);
                zoom.setTexture('MenuAtlas', 'UI Buttons/Zoom_In');
            }
        }, this);

        this.infoContainer.add(zoom);

    }

    ChangeCard(cardIndex) {
        this.infoCards.forEach(card => {
            card.setVisible(false);
            card.description.setVisible(false);
            //card.zoomButton.setVisible(false);
        });

        this.infoCards[cardIndex].setVisible(true);
        this.infoCards[cardIndex].description.setVisible(true);

        if (cardIndex < this.infoCards.length - 1) {
            this.infoContainer.arrowForw.setVisible(true);
        }
        else {
            this.infoContainer.arrowForw.setVisible(false);

        }

        if (cardIndex > 0) {
            this.infoContainer.arrowBack.setVisible(true);
        }
        else {
            this.infoContainer.arrowBack.setVisible(false);

        }

        console.log('Changed to: ' + cardIndex);
    }*/

    CreateAlbum() {

        this.imgContainerY = 50;

        //Background that shows up when viewing the images in an album
        this.albumBackground = this.add.image(this.centerX + 5, this.centerY - 20, 'MenuAtlas', 'UI Pohjat/Pelipohja').setVisible(false).setScale(1.04, 0.57);
        this.imageBackground = this.add.image(this.centerX, this.centerY - this.imgContainerY, 'MenuAtlas', 'UI Pohjat/Infokorttipohja').setVisible(false);
        //this.textBackground = this.add.image(this.centerX, this.centerY - 7, 'MenuAtlas', 'UI Pohjat/Pelipohja').setVisible(false);

        this.albumContainer = this.add.container(0, -500).setScale(1.2);

        // image thumbnails
        if (this.images.length > 0) {

            var previousX = -300;

            let column = 0;
            let rowLimit = 5;
            let row = 1;

            //Creates the list of images that can be clicked open
            this.images.forEach(element => {
                let img = this.add.image(previousX, 50 + 120 * row, element).setDisplaySize(140, 100);
                this.albumContainer.add(img);
                //img.setPosition(previousX, 50 + 100*row);
                previousX += 150;

                img.pressed = false;

                let index = this.images.indexOf(element);

                column++;

                if (column >= rowLimit) {
                    row++;
                    column = 0;
                    previousX = -300;
                }

                img.setInteractive();

                img.on('pointerover', function () {

                    img.setTint(0xd5d1c7);

                });

                img.on('pointerout', function () {

                    img.clearTint();
                    img.pressed = false;

                });

                img.on('pointerdown', function () {

                    img.pressed = true;

                });

                img.on('pointerup', function (event) {
                    if (img.pressed) {
                        // Open image
                        this.createImage(element, index);
                    }
                }, this);
            });
        }

        let arrowX = 850;
        let arrowY = 460;

        this.albumArrowForward = CreateButton(this, this.centerX + arrowX, this.centerY + arrowY, 'UI Buttons/Arrow').setScale(0.9).setVisible(false);
        this.albumArrowBackward = CreateButton(this, this.centerX - arrowX, this.centerY + arrowY, 'UI Buttons/Arrow').setFlipX(true).setScale(0.9).setVisible(false);

        this.albumArrowForward.on('pointerup', function () {
            if (this.albumArrowForward.pressed) {
                let newIndex = this.currentImageIndex + 1;
                if (newIndex < this.images.length) {
                    this.createImage(this.images[newIndex], newIndex);
                }

            }
        }, this);

        this.albumArrowBackward.on('pointerup', function () {
            if (this.albumArrowBackward.pressed) {
                let newIndex = this.currentImageIndex - 1;
                if (newIndex >= 0) {
                    this.createImage(this.images[newIndex], newIndex);
                }
            }
        }, this);

        this.menu.add(this.albumContainer);

        this.switchableContainers.push(this.albumContainer);

        this.albumContainer.button = this.albumButton;



    }

    createImage(image, index) {

        if (this.currentImage) {
            this.currentImage.text.destroy();
            this.currentImage.destroy();
        }

        let newImage = this.add.image(this.centerX - 2, this.centerY - this.imgContainerY, image);

        let imageHeight = 900;

        newImage.setDisplaySize(newImage.width / (newImage.height / imageHeight), imageHeight)
        newImage.setSizeToFrame(newImage.frame);

        let bottomCenter = newImage.getBottomCenter();

        this.imageBackground.setVisible(true).setDisplaySize(newImage.displayWidth + 60, newImage.displayHeight + 60);
        this.albumBackground.setVisible(true);

        newImage.text = this.make.text({
            x: newImage.x,
            y: bottomCenter.y + 60,
            text: this.data[this.name].ImageDescs[index],
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: '33px Carme',
                fill: 'black',
                wordWrap: { width: (this.albumBackground.width * this.albumBackground.scaleX) - 400 },
                align: 'center'
            }
        });

        //Commented this out so I can easily make the menu invisible separately when opening an image
        // add to menu for easy resize
        //this.menu.add(newImage);
        newImage.pressed = false;
        newImage.setInteractive();

        newImage.on('pointerout', function () {

            newImage.pressed = false;

        });

        newImage.on('pointerdown', function () {

            newImage.pressed = true;

        });

        newImage.on('pointerup', function (event) {
            if (newImage.pressed) {
                newImage.text.destroy();
                newImage.destroy();
                this.albumArrowForward.setVisible(false);
                this.albumArrowBackward.setVisible(false);
                this.menu.setVisible(true);
                this.imageBackground.setVisible(false);
                this.albumBackground.setVisible(false);

            }
        }, this);

        if (index < this.images.length - 1) {
            this.albumArrowForward.setVisible(true);
        }
        else {
            this.albumArrowForward.setVisible(false);

        }
        this.albumArrowBackward.setVisible(true);

        if (index > 0) {
            this.albumArrowBackward.setVisible(true);
        }
        else {
            this.albumArrowBackward.setVisible(false);

        }

        this.menu.setVisible(false);

        this.currentImage = newImage;
        this.currentImageIndex = index;
    }

    CreatePanoRamaContainer() {
        this.panoramaContainer = this.add.container(0, 0);

        let Panorama1 = this.add.image(0, -200, this.panoramaThumbs[0]);
        Panorama1.img = this.panoramas[0];
        this.panoramaContainer.add(Panorama1);
        let Panorama2;

        if (this.panoramas.length > 1) {
            Panorama1.x -= 200;
            Panorama2 = this.add.image(200, -200, this.panoramaThumbs[1]);
            Panorama2.img = this.panoramas[1];
            this.panoramaContainer.add(Panorama2);
            console.log('Panorama2 added');
        }

        this.panoramaContainer.iterate(function (element) {
            element.setInteractive();

            element.on('pointerdown', function () {
                element.pressed = true;


            });

            element.on('pointerover', function () {
                element.setTint(0xd5d1c7);

            });

            element.on('pointerout', function () {
                element.pressed = false;
                element.clearTint();
            });

            element.on('pointerup', function () {
                if (element.pressed) {

                    this.ChangeVisibility(this.panoramaContainer.list);

                    element.clearTint();

                    let panoHTML = document.createElement('iframe');
                    panoHTML.id = 'panorama';
                    panoHTML.src = 'pannellum/pannellum.htm#panorama=/Assets/images/Panoramas/' + element.img + '&autoLoad=true&vaov=80&author="Sara Laitinen 2020"';

                    this.panoramaViewer = this.add.dom(this.centerX, this.centerY - 50, panoHTML, 'border-style:none; width: 1500px; height: 900px;');

                    domElements.push(this.panoramaViewer);

                    this.panoramaExitButton = CreateTextButton(this, this.centerX, 1020, 'UI Buttons/Nappi', this.data.Back).setScale(0.7);

                    this.panoramaExitButton.on('pointerup', function () {
                        if (this.panoramaExitButton.pressed) {
                            let index = domElements.indexOf(this.panoramaViewer);
                            if (index > -1) {
                                domElements.splice(index, 1);
                            }
                            this.panoramaViewer.destroy();
                            this.ChangeVisibility(true);
                            this.ContainerTransition(this.panoramaContainer);
                            this.panoramaExitButton.destroy();
                        }
                    }, this);
                }

            }, this)
        }, this);

        this.switchableContainers.push(this.panoramaContainer);
        this.menu.add(this.panoramaContainer);

        this.panoramaContainer.button = this.panoramaButton;
    }

    ContainerTransition(containerToOpen) {
        this.switchableContainers.forEach(function (element) {
            if (element == containerToOpen) {
                element.setVisible(true);
                element.button.setTint(0xd5d1c7)
            }
            else {
                element.setVisible(false);
                element.button.clearTint();

            }
        })
    }

    update() {

        if (this.panoramaViewer) {

            if (this.panoramaViewer.visible === true) {
                if (this.panoramaViewer.image) {
                    //Stops movement of panorama image once it hits a certain point
                    if (this.panoramaViewer.image.x <= this.panoramaViewer.image.width / 2 || this.panoramaViewer.image.x >= this.panoramaViewer.image.width / 2) {
                        this.panoramaViewer.image.setVelocityX(0);
                    }
                }
            }
        }

    }

    //Changes visibility of menu elements so that only elements in the keepVisible parameter are kept visible
    ChangeVisibility(keepVisible) {

        if (Array.isArray(keepVisible)) {
            this.menu.iterate(item => {

                keepVisible.forEach(element => {
                    if (element === item) {
                        item.visible = true;
                    }
                    else {
                        item.visible = false;
                    }
                });

            });

        }
        else if (keepVisible === true) {
            this.menu.iterate(item => {
                item.visible = true;
            });
        }
    }

}