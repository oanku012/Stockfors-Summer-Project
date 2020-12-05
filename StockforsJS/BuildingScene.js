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

        this.currentContainer;
    }

    preload() {

        this.cameras.main.backgroundColor.setTo(255, 255, 255);
    }

    create() {

        rescaleSceneEvent(this);

        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;

        //let bounds = this.matter.world.setBounds(-90, 0, 2500, 1000, 64, true, true, false, false);

        //Stops ongoing sounds that started in the map scene from playing
        this.sound.stopAll();

        this.background = this.add.image(this.centerX, this.centerY, this.backgroundImage).setDepth(0);

        if ((this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) && this.scale.orientation === Phaser.Scale.PORTRAIT) {

            this.background.setDisplaySize((this.sys.canvas.height / this.background.height) * this.background.width, this.sys.canvas.height);
        }
        else {

            this.background.setDisplaySize(this.sys.canvas.width, (this.sys.canvas.width / this.background.width) * this.background.height);
        }


        this.infoTexts = [];
        this.infoCards = [];
        //List of all containers that can be switched between
        this.switchableContainers = [];


        // Get text data from a json file
        this.data = this.cache.json.get('data').Buildings;

        if (this.data[this.name].Title != null && this.data[this.name].InfoCards != null) {
            this.title = this.data[this.name].Title;

            this.infoTexts = this.data[this.name].InfoCards;

            //console.log('Title added: ' + this.title);

        }

        //If this building has web pages
        if (this.data[this.name].Links) {
            this.url = this.data[this.name].Links;
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

        if (this.url) {
            this.CreateWebContainer();
        }

        console.log(this.scene.key);

        this.ContainerTransition(this.infoContainer);

        // Reorganize the UI when the game gets resized, apparently runs multiple times when changing orientation
        this.scale.on('resize', this.resize, this);

        // pick random song to play
        var randomSong = Math.floor(Math.random() * 3);
        if (randomSong == 0)
            game.scene.getScene('MusicPlayer').playSong('hmollackordet');
        else if (randomSong == 1)
            game.scene.getScene('MusicPlayer').playSong('distinct2');
        else
            game.scene.getScene('MusicPlayer').playSong('being_in_the_rain')

    }

    createMenuContainer() {

        this.menuPositionY = 0.03;

        // Menu
        this.menuBG = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/InsideVaaka');
        this.menu = this.add.container(this.centerX, this.centerY - 20, [this.menuBG]);

        this.portraitScale = 0.00017;
        this.landscapeScale = 0.00023;
        rescaleObjects(this.menu, this, this.portraitScale, this.landscapeScale);

        this.menu.setPosition(this.centerX, this.centerY - getWindowHeight() * this.menu.scaleY * this.menuPositionY);

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

        rescaleObjects(this.ohje, this, 0.0002, 0.00017);

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
                this.currentContainer.setVisible(true);
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
                //There was a bug with the html in the info where it would stay visible when opening the instructions despite the menu which contained its container being made invisible, that's why the current container is set invisible separately now
                this.currentContainer.setVisible(false);
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

            if (this.url.length > 0) {
                //this.webButton = this.add.sprite(rightMostPosition - (buttonsAdded * buttonGap), 0, 'MenuAtlas', 'UI Buttons/Webpage');
                this.webButton = CreateButton(this, rightMostPosition - (buttonsAdded * buttonGap), 0, 'UI Buttons/Webpage');

                this.webButton.on('pointerup', function () {
                    if (this.webButton.pressed) {

                        //window.open(this.url);
                        this.ContainerTransition(this.webContainer);
                    }

                }, this);

                this.menuButtons.add(this.webButton);

                buttonsAdded++;
            }
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
            this.menu.setY(this.centerY - getWindowHeight() * this.menu.scaleY * this.menuPositionY);

            //The iframe element is recreated completely on resize, because repositioning it didn't seem to work for some reason 
            if (this.panoramaViewer) {
                this.panoramaViewer.setPosition(this.centerX, this.centerY - getWindowHeight() * 0.05);

                let panoHTML = document.createElement('iframe');
                panoHTML.id = 'panorama';
                panoHTML.src = 'pannellum/pannellum.htm#panorama=/Assets/images/Panoramas/' + this.panoramaViewer.img + '&autoLoad=true&vaov=80&author="Sara Laitinen 2020"';
                panoHTML.style = 'border-style:none; width: 80%; height: 80%;'

                this.panoramaViewer.setElement(panoHTML);

                this.panoramaExitButton.setPosition(this.centerX, this.centerY + getWindowHeight() * 0.4)
            }

            rescaleObjects(this.menu, this, this.portraitScale, this.landscapeScale);

            this.albumBackground.setDisplaySize(getWindowWidth() * 1.2, getWindowHeight() * 1.2);

            let arrowX;
            let arrowY;

            if ((this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) && this.scale.orientation === Phaser.Scale.PORTRAIT) {

                arrowX = getWindowWidth() * 0.4;
                arrowY = getWindowHeight() * 0.45;
                this.background.setDisplaySize((this.sys.canvas.height / this.background.height) * this.background.width, this.sys.canvas.height);

            }
            else {
                arrowX = getWindowWidth() * 0.45;
                arrowY = getWindowHeight() * 0.45;
                this.background.setDisplaySize(this.sys.canvas.width, (this.sys.canvas.width / this.background.width) * this.background.height);

            }

            this.albumArrowForward.setPosition(this.centerX + arrowX, this.centerY + arrowY);
            rescaleObjects(this.albumArrowForward, this, 0.0003, 0.0003);
            this.albumArrowBackward.setPosition(this.centerX - arrowX, this.centerY + arrowY);
            rescaleObjects(this.albumArrowBackward, this, 0.0003, 0.0003);

            if (this.currentImage) {

                let imageHeight = getWindowHeight() * 0.8;
                let imageWidth = getWindowWidth() * 0.8;

                if ((this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) && this.scale.orientation === Phaser.Scale.PORTRAIT) {

                    let width = imageWidth;
                    let height = this.currentImage.height / (this.currentImage.width / imageWidth);

                    //This should prevent the images from overflowing on certain screens
                    if (height > this.sys.canvas.height - 100) {
                        height = this.sys.canvas.height - 100;
                        width = this.currentImage.width / (this.currentImage.height / height);

                    }


                    //this.currentImage.setDisplaySize(imageWidth, this.currentImage.height / (this.currentImage.width / imageWidth))
                    this.currentImage.setDisplaySize(width, height);

                    this.currentImage.setSizeToFrame(this.currentImage.frame);

                }
                else {


                    let height = imageHeight;
                    let width = this.currentImage.width / (this.currentImage.height / imageHeight);

                    if (width > this.sys.canvas.width - 100) {
                        width = this.sys.canvas.width - 100;
                        height = this.currentImage.height / (this.currentImage.width / width);

                    }

                    this.currentImage.setDisplaySize(width, height);

                    //this.currentImage.setDisplaySize(this.currentImage.width / (this.currentImage.height / imageHeight), imageHeight)
                    this.currentImage.setSizeToFrame(this.currentImage.frame);
                }

                //rescaleObjects(this.currentImage, this, 0.0002, 0.0002);

                this.imageBackground.setDisplaySize(this.currentImage.displayWidth + 60, this.currentImage.displayHeight + 60);


                let topLeft = this.currentImage.getTopLeft();

                this.closeImageButton.setPosition(topLeft.x, topLeft.y);

                rescaleObjects(this.closeImageButton, this, 0.0003, 0.0003);

                let bottomCenter = this.imageBackground.getBottomCenter();

                //rescaleObjects(this.currentImage.text, this, 0.0004, 0.0004);

                this.currentImage.text.setY(bottomCenter.y)

                if ((this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) && this.scale.orientation === Phaser.Scale.PORTRAIT) {

                    this.currentImage.text.setWordWrapWidth(getWindowWidth() * 0.7);
                }
                else {
                    this.currentImage.text.setWordWrapWidth(getWindowWidth() * 0.8);

                }

            }

            rescaleObjects(this.ohje, this, 0.0002, 0.00017);


            console.log('Scene objects resized and positioned.');
        }
    }

    CreateInfoContainer() {
        this.infoContainer = this.add.container(0, 0);

        this.infoTexts.forEach(infoText => {

            this.CreateInfoCards(infoText);

        }, this);

        this.switchableContainers.push(this.infoContainer);

        this.menu.add(this.infoContainer);

        this.infoContainer.button = this.infoButton;

    }

    CreateInfoCards(text) {

        let infoDiv = document.createElement('div');

        let windowSize = window.innerHeight + window.innerWidth;

        let fontSize;

        if (this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) {
            fontSize = 66;

        }
        else
        {
            fontSize = 33;
        }

        let fullScreenFontSize = 94314/(windowSize);

        fullScreenFontSize -= windowSize*0.001;

        //let fullScreenFontSize = 66;

        console.log(fullScreenFontSize);

        //This is the style for the entire info html
        infoDiv.style = 'padding: 30px; overflow-x: hidden; width: 1400px; height: 770px; padding: 30px; font: '+ fontSize + 'px Carme;'

        //The stylesheet is for styling the inner elements, not sure if it could have been put straight into the style element above somehow
        //Text variable is the HTML string that includes the infotext as well, stored in JSON
        infoDiv.innerHTML = '<link rel="stylesheet" type="text/css" href="infoStyle.css"> ' + text;
        //This was just testing an implementation for using iframe to include html from a separate file
        //infoDiv.innerHTML = '<iframe src="' + text + ' " style="width: 100%; height: 100%; border: none;"></iframe>';

        //background-Image: url("Assets/images/menu/Infokorttipohja.png"); background-size: 100% 103%; background-repeat: no-repeat; background-position: -10px, -15px;

        let infoDom = this.add.dom(0, 15, infoDiv);

        let infoBackground = this.add.sprite(0, 13, 'MenuAtlas', 'UI Pohjat/Infokorttipohja').setScale(1.75, 1.36);

        let topLeft = infoBackground.getTopLeft();

        infoBackground.setInteractive();

        let infoFullScreenButton = CreateButton(this, topLeft.x - 20, topLeft.y + 75, 'UI Buttons/Zoom_In').setScale(1.7);


        infoFullScreenButton.on('pointerup', () => {
            if (infoFullScreenButton.pressed) {

                if (infoFullScreenButton.full !== true) {

                    //Portrait mode
                    if ((this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) && this.scale.orientation === Phaser.Scale.PORTRAIT) {

                        infoBackground.setScale(2.28, 5);

                        topLeft = infoBackground.getTopLeft();

                        infoFullScreenButton.setPosition(topLeft.x + 100, topLeft.y).setTexture('MenuAtlas', 'UI Buttons/Zoom_Out').setScale(1.7);

                        infoDiv.style = 'padding: 30px; overflow-x: hidden; width: 1800px; height: 2995px; padding: 30px; font: ' + fontSize + 'px Carme;'
                        infoDom.setPosition(-210, -1095);

                    }
                    //Landscape mode
                    else
                    {
                        infoBackground.setScale(2.3, 2.075);

                        topLeft = infoBackground.getTopLeft();

                        infoFullScreenButton.setPosition(topLeft.x - 30, topLeft.y + 80).setTexture('MenuAtlas', 'UI Buttons/Zoom_Out').setScale(1.7);

                        infoDiv.style = 'padding: 30px; overflow-x: hidden; width: 1800px; height: 1195px; padding: 30px; font: ' + fontSize + 'px Carme;'
                        infoDom.setPosition(-220, -200);
                    }

                    infoFullScreenButton.full = true;

                }
                //Exit fullscreen
                else {
                    infoBackground.setScale(1.75, 1.36);

                    topLeft = infoBackground.getTopLeft();

                    infoFullScreenButton.setPosition(topLeft.x - 20, topLeft.y + 75).setTexture('MenuAtlas', 'UI Buttons/Zoom_In');
                    infoDiv.style = 'padding: 30px; overflow-x: hidden; width: 1400px; height: 770px; padding: 30px; font: '+ fontSize + 'px Carme;'

                    infoDom.setPosition(0, 15);

                    infoFullScreenButton.full = false;
                }
            }
        }, this);

        //When game is resized while reading in fullscreen, didn't feel like putting these in the above resize function
        this.scale.on('resize', () => 
        {
            if (infoFullScreenButton.full === true) {

                //Portrait mode
                if ((this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) && this.scale.orientation === Phaser.Scale.PORTRAIT) {

                    infoBackground.setScale(2.28, 5);

                    topLeft = infoBackground.getTopLeft();

                    infoFullScreenButton.setPosition(topLeft.x + 100, topLeft.y).setTexture('MenuAtlas', 'UI Buttons/Zoom_Out').setScale(1.7);

                    infoDiv.style = 'padding: 30px; overflow-x: hidden; width: 1800px; height: 2995px; padding: 30px; font: ' + fontSize + 'px Carme;'
                    infoDom.setPosition(-210, -1095);

                }
                //Landscape mode
                else
                {
                    infoBackground.setScale(2.3, 2.075);

                    topLeft = infoBackground.getTopLeft();

                    infoFullScreenButton.setPosition(topLeft.x - 30, topLeft.y + 80).setTexture('MenuAtlas', 'UI Buttons/Zoom_Out').setScale(1.7);

                    infoDiv.style = 'padding: 30px; overflow-x: hidden; width: 1800px; height: 1195px; padding: 30px; font: ' + fontSize + 'px Carme;'
                    infoDom.setPosition(-220, -200);
                }
            }
        }, this);

        domElements.push(infoDom);

        this.infoContainer.add([infoFullScreenButton, infoDom, infoBackground]);

        //This stops the info text from becoming visible on top of the options menu when changing language
        if (optionsButton.open) {
            infoDom.visible = false;
        }
    }


    CreateAlbum() {

        this.imgContainerY = 50;

        //Background that shows up when viewing the images in an album
        this.albumBackground = this.add.image(this.centerX + 5, this.centerY - 20, 'MenuAtlas', 'UI Pohjat/Pelipohja').setVisible(false).setDisplaySize(getWindowWidth() * 1.2, getWindowHeight() * 1.2);
        this.imageBackground = this.add.image(this.centerX, this.centerY - this.imgContainerY, 'MenuAtlas', 'UI Pohjat/Infokorttipohja').setVisible(false);
        //this.textBackground = this.add.image(this.centerX, this.centerY - 7, 'MenuAtlas', 'UI Pohjat/Pelipohja').setVisible(false);

        this.albumContainer = this.add.container(0, -500).setScale(1.2);

        // image thumbnails
        if (this.images.length > 0) {

            let imgWidth = 180;
            let imgHeight = 140;

            let rowLimit = 4;
            let columnLimit = 4;

            let column = 0;
            let row = 1;

            let startingX = (-(imgWidth + 10) / 2) * rowLimit;
            let previousX = startingX;

            //List of "pages" that are a collection of images in one page
            let albumPages = [];
            //List of containers containing the images in a page
            let pageContainers = [];
            //List of the actual image objects displayed on the page
            this.imageObjects = [];

            let self = this;

            //Creates pages based on the amount of images
            for (let i = 0; i < Math.ceil(this.images.length / (rowLimit * columnLimit)); i++) {

                let page = self.images.slice(i * (rowLimit * columnLimit), (i + 1) * (rowLimit * columnLimit));
                albumPages.push(page);

            }

            //Creates each page
            albumPages.forEach(function (page, pageIndex, array) {

                //Reset the current image row when creating a new page
                row = 1;
                let pageContainer = this.add.container(0, 0).setVisible(false);
                this.albumContainer.add(pageContainer);
                pageContainers.push(pageContainer);

                //Creates the images in a page
                page.forEach(function (image, index, array) {
                    let img = this.add.image(previousX, 120 * row, image).setDisplaySize(imgWidth, imgHeight).setDisplayOrigin(0, 0);
                    //this.albumContainer.add(img);
                    pageContainer.add(img);
                    img.setPosition(previousX, ((img.displayHeight + 20) * row) - 50);
                    previousX += img.displayWidth + 10;

                    img.pressed = false;

                    //The page that the image is on
                    img.pageIndex = pageIndex;

                    column++;

                    if (column >= rowLimit) {
                        row++;
                        column = 0;
                        previousX = startingX;
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
                            // Open image, takes the index of the image from the entire list of images
                            this.createImage(image, this.images.indexOf(image), pageIndex);
                        }
                    }, this);

                    this.imageObjects.push(img);

                    //img.setVisible(false);
                }, this);
            }, this);

            //Sets the first page to be visible when opening the scene
            pageContainers[0].setVisible(true);

            this.currentAlbumPage = 0;

            //Create arrow buttons for switching pages if there is more than one page
            if (albumPages.length > 1) {
                let pageArrowRight = CreateButton(this, 550, 400, 'UI Buttons/Nuoli');
                let pageArrowLeft = CreateButton(this, -550, 400, 'UI Buttons/Nuoli').setFlipX(true);
                this.albumContainer.add([pageArrowRight, pageArrowLeft]);

                this.albumContainer.pageArrowRight = pageArrowRight;
                this.albumContainer.pageArrowLeft = pageArrowLeft;

                pageArrowLeft.setVisible(false);

                pageArrowRight.on('pointerup', function () {

                    if (this.currentAlbumPage >= 0 && this.currentAlbumPage < albumPages.length - 1) {
                        pageContainers[this.currentAlbumPage].setVisible(false);
                        pageContainers[this.currentAlbumPage + 1].setVisible(true);

                        this.currentAlbumPage++;

                        if (pageArrowLeft.visible == false) {
                            pageArrowLeft.setVisible(true);
                        }

                        if (this.currentAlbumPage == albumPages.length - 1) {
                            pageArrowRight.setVisible(false);
                        }


                    }

                }, this);

                pageArrowLeft.on('pointerup', function () {

                    if (this.currentAlbumPage > 0 && this.currentAlbumPage <= albumPages.length - 1) {
                        pageContainers[this.currentAlbumPage].setVisible(false);
                        pageContainers[this.currentAlbumPage - 1].setVisible(true);

                        this.currentAlbumPage--;

                        if (this.currentAlbumPage == 0) {
                            pageArrowLeft.setVisible(false);
                        }

                        if (pageArrowRight.visible == false) {
                            pageArrowRight.setVisible(true);
                        }
                    }

                }, this);

            }

            this.albumContainer.pageContainers = pageContainers;

        }

        //let arrowX = 850;
        //let arrowY = 460;
        let arrowX;
        let arrowY;

        if ((this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) && this.scale.orientation === Phaser.Scale.PORTRAIT) {

            arrowX = getWindowWidth() * 0.4;
            arrowY = getWindowHeight() * 0.45;

        }
        else {
            arrowX = getWindowWidth() * 0.45;
            arrowY = getWindowHeight() * 0.45;
        }

        //Arrow buttons for switching between images when viewing them
        this.albumArrowForward = CreateButton(this, this.centerX + arrowX, this.centerY + arrowY, 'UI Buttons/Arrow').setScale(0.9).setVisible(false);
        this.albumArrowBackward = CreateButton(this, this.centerX - arrowX, this.centerY + arrowY, 'UI Buttons/Arrow').setFlipX(true).setScale(0.9).setVisible(false);

        rescaleObjects(this.albumArrowForward, this, 0.0003, 0.0003);
        rescaleObjects(this.albumArrowBackward, this, 0.0003, 0.0003);

        this.albumArrowForward.on('pointerup', function () {
            if (this.albumArrowForward.pressed) {
                let newIndex = this.currentImageIndex + 1;
                if (newIndex < this.images.length) {
                    this.createImage(this.images[newIndex], newIndex, this.imageObjects[newIndex].pageIndex);
                }

            }
        }, this);

        this.albumArrowBackward.on('pointerup', function () {
            if (this.albumArrowBackward.pressed) {
                let newIndex = this.currentImageIndex - 1;
                if (newIndex >= 0) {
                    this.createImage(this.images[newIndex], newIndex, this.imageObjects[newIndex].pageIndex);
                }
            }
        }, this);

        //Button for closing the viewed image and going back to the album
        this.closeImageButton = CreateButton(this, this.centerX - 895, this.centerY - 495, 'UI Buttons/Zoom_Out').setVisible(false);

        this.menu.add(this.albumContainer);

        this.switchableContainers.push(this.albumContainer);

        this.albumContainer.button = this.albumButton;



    }

    //Creates the actual larger image to view, page is the pageindex that the image is on
    createImage(image, index, page) {

        //Destroy existing image if switching to a new one
        if (this.currentImage) {
            this.currentImage.text.destroy();
            this.currentImage.destroy();
        }

        if (this.closeImageButton.visible === false) {
            this.closeImageButton.setVisible(true);
        }

        let newImage = this.add.image(this.centerX, this.centerY - this.imgContainerY, image);

        let imageHeight = getWindowHeight() * 0.8;
        let imageWidth = getWindowWidth() * 0.8;

        /*if ((this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) && this.scale.orientation === Phaser.Scale.PORTRAIT) {
            newImage.setDisplaySize(imageWidth, newImage.height / (newImage.width / imageWidth))
            newImage.setSizeToFrame(newImage.frame);
        }
        else {
            newImage.setDisplaySize(newImage.width / (newImage.height / imageHeight), imageHeight)
            newImage.setSizeToFrame(newImage.frame);
        }*/

        if ((this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) && this.scale.orientation === Phaser.Scale.PORTRAIT) {

            let width = imageWidth;
            let height = newImage.height / (newImage.width / imageWidth);

            if (height > this.sys.canvas.height - 100) {
                height = this.sys.canvas.height - 100;
                width = newImage.width / (newImage.height / height);

            }


            //newImage.setDisplaySize(imageWidth, newImage.height / (newImage.width / imageWidth))
            newImage.setDisplaySize(width, height);

            newImage.setSizeToFrame(newImage.frame);

        }
        else {


            let height = imageHeight;
            let width = newImage.width / (newImage.height / imageHeight);

            if (width > this.sys.canvas.width - 100) {
                width = this.sys.canvas.width - 100;
                height = newImage.height / (newImage.width / width);

            }

            newImage.setDisplaySize(width, height);

            //newImage.setDisplaySize(newImage.width / (newImage.height / imageHeight), imageHeight)
            newImage.setSizeToFrame(newImage.frame);
        }

        this.imageBackground.setVisible(true).setDisplaySize(newImage.displayWidth + 60, newImage.displayHeight + 60);
        this.albumBackground.setVisible(true);

        let bottomCenter = this.imageBackground.getBottomCenter();

        let textWidth;

        if ((this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) && this.scale.orientation === Phaser.Scale.PORTRAIT) {

            textWidth = getWindowWidth() * 0.7;
        }
        else {
            textWidth = getWindowWidth() * 0.8;


        }

        newImage.text = this.make.text({
            x: newImage.x,
            y: bottomCenter.y,
            text: this.data[this.name].ImageDescs[index],
            origin: { x: 0.5, y: 0 },
            style: {
                font: devicePixelCount * 0.015 + 'px Carme',
                fill: 'black',
                wordWrap: { width: textWidth },
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

                //Opens the full image in a separate browser window 
                window.open(this.cache.json.get('assets').image[image]);

            }
        }, this);

        this.closeImageButton.on('pointerup', function () {
            if (this.closeImageButton.pressed) {
                newImage.text.destroy();
                newImage.destroy();
                this.albumArrowForward.setVisible(false);
                this.albumArrowBackward.setVisible(false);
                this.menu.setVisible(true);
                this.imageBackground.setVisible(false);
                this.albumBackground.setVisible(false);

                if (this.albumContainer.pageContainers.length > 1) {
                    //All of this is just for opening the correct page of the album when closing the image
                    this.albumContainer.pageContainers.forEach(function (element, pageIndex, array) {

                        if (pageIndex == page) {
                            console.log('Opening album page ' + pageIndex);
                            element.setVisible(true);

                            if (pageIndex == array.length - 1) {
                                this.albumContainer.pageArrowRight.setVisible(false);
                                this.albumContainer.pageArrowLeft.setVisible(true);
                            }
                            else if (pageIndex == 0) {
                                this.albumContainer.pageArrowRight.setVisible(true);
                                this.albumContainer.pageArrowLeft.setVisible(false);
                            }
                            else {
                                this.albumContainer.pageArrowRight.setVisible(true);
                                this.albumContainer.pageArrowLeft.setVisible(true);
                            }

                            this.currentAlbumPage = pageIndex;
                        }
                        else {
                            element.setVisible(false);
                        }
                    }, this);
                }

                this.closeImageButton.setVisible(false);
                this.currentImage = null;

            }
        }, this);

        this.closeImageButton.setDepth(10);

        let topLeft = newImage.getTopLeft();

        rescaleObjects(this.closeImageButton, this, 0.0003, 0.0003);

        this.closeImageButton.setPosition(topLeft.x, topLeft.y);

        if (index < this.images.length - 1) {
            this.albumArrowForward.setVisible(true);
        }
        else {
            this.albumArrowForward.setVisible(false);

        }

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


                    this.panoramaViewer = this.add.dom(this.centerX, this.centerY - getWindowHeight() * 0.05, panoHTML, 'border-style:none; width: 80%; height: 80%;');

                    this.panoramaViewer.img = element.img;

                    domElements.push(this.panoramaViewer);

                    this.panoramaExitButton = CreateTextButton(this, this.centerX, this.centerY + getWindowHeight() * 0.4, 'UI Buttons/Nappi', this.data.Back).setScale(0.7);

                    this.panoramaExitButton.on('pointerup', function () {
                        if (this.panoramaExitButton.pressed) {
                            let index = domElements.indexOf(this.panoramaViewer);
                            if (index > -1) {
                                domElements.splice(index, 1);
                            }
                            this.panoramaViewer.destroy();
                            this.panoramaViewer = null;
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

    CreateWebContainer() {
        this.webContainer = this.add.container(0, 0);

        let posX = -450;
        let posY = -350;

        this.url.forEach(url => {

            let title = this.make.text({
                x: posX,
                y: posY,
                text: url.Title,
                origin: { x: 0, y: 0.5 },
                style: {
                    font: '43px Carme',
                    fill: 'black',
                    align: 'center'
                }
            });

            let link = this.make.text({
                x: posX,
                y: posY + 50,
                text: url.url,
                origin: { x: 0, y: 0.5 },
                style: {
                    font: '43px Carme',
                    fill: 'blue',
                    align: 'center'

                }
            });

            link.setInteractive();

            link.on('pointerdown', function () {
                link.pressed = true;
            });

            link.on('pointerout', function () {
                link.pressed = false;
            });

            link.on('pointerup', function () {
                if (link.pressed) {
                    //Opens the link
                    window.open(url.url);
                }
            });

            posY += 120;

            this.webContainer.add([title, link]);
        });

        this.switchableContainers.push(this.webContainer);

        this.webContainer.button = this.webButton;

        this.menu.add(this.webContainer);
    }

    ContainerTransition(containerToOpen) {
        this.switchableContainers.forEach(function (element) {

            if (element == containerToOpen) {
                element.setVisible(true);
                //Highlights the button that activates the container to indicate which menu is open
                element.button.setTint(0xd5d1c7)
            }
            else {
                element.setVisible(false);
                element.button.clearTint();

            }
        })

        this.currentContainer = containerToOpen;
    }

    update() {

        /*if (this.panoramaViewer) {

            if (this.panoramaViewer.visible === true) {
                if (this.panoramaViewer.image) {
                    //Stops movement of panorama image once it hits a certain point
                    if (this.panoramaViewer.image.x <= this.panoramaViewer.image.width / 2 || this.panoramaViewer.image.x >= this.panoramaViewer.image.width / 2) {
                        this.panoramaViewer.image.setVelocityX(0);
                    }
                }
            }
        }*/

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