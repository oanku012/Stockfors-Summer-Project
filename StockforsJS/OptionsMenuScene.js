//Bool used to indicate when language is being changed
var languageChanged = false;

class OptionsMenuScene extends Phaser.Scene {
    constructor() {
        super('OptionsMenuScene');

        this.title = 'Options';
        this.description = '';

    }

    preload() {

        if (languageChanged) {
            /*// Make sure to remove all localization data before loading any
           this.cache.json.remove('mainMenuData');
           this.cache.json.remove('buildingData');
           this.cache.json.remove('optionsData');
           this.cache.json.remove('muistipeliData');

           // Load JSON data
           var path = ("Localization/" + config.language + "/MainMenu.json");
           this.load.json('mainMenuData', path);

           // Json data for all building info
           var path = ("Localization/" + config.language + "/Buildings.json");
           this.load.json('buildingData', path);

           // Json data for all options info
           var path = ("Localization/" + config.language + "/OptionsMenu.json");
           this.load.json('optionsData', path);

           // Json data for all muistipeli info
           var path = ("Localization/" + config.language + "/Muistipeli.json");
           this.load.json('muistipeliData', path);*/
           
           this.cache.json.remove('data');

           var path = ("Localization/" + config.language + "/data.json");
           this.load.json('data', path);

           console.log('Language loaded');
        }
    }

    create() {

        optionsButton.open = true;
        this.scene.bringToTop();

        //Brings the UI to the top so the options button in the corner isn't tinted over
        game.scene.getScene('UI').scene.bringToTop();

        //this.time.delayedCall(100, function () {
        this.data = this.cache.json.get('data').OptionsMenu;

        this.createContainer();
        this.createExitButton();
        this.createOptionsMenu();
        this.CreateFlags();

        //this.add.image(0, 0, 'MenuAtlas', 'UI Pohjat/Tummennus').setOrigin(0);

        this.cameras.main.backgroundColor.setTo(0, 0, 0, 100);

        //}, null, this);

        // Reorganize the UI when the game gets resized
        //this.scale.on('resize', this.resize, this);

    }

    createContainer() {

        // Menu
        this.menuBG = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/Settings').setOrigin(0.479, 0.5);
        this.menu = this.add.container(this.cameras.main.centerX - 37, this.cameras.main.centerY, [this.menuBG]).setScale(0.57).setDepth(9999);
        //This is just to move all the elements that are separate from the backgrounds
        this.menuElements = this.add.container(40, 0);

        // title and description
        let title = this.add.text(0, 0, this.data.Title);
        title.setPosition(-450, -370);
        title.setFontSize(60);
        title.setColor("black");
        title.setFontStyle('bold');
        title.setFontFamily('LexendTera');
        this.menu.add(title);

    }

    createOptionsMenu() {

        this.musicOn = true;
        this.soundOn = true;

        let firstRow = -178;

        let rowGap = 137;

        let fontsize = 48;

        //The text align doesn't work on one line text
        this.musicButton = this.add.sprite(-400, firstRow, 'MenuAtlas', 'UI Buttons/CheckmarkON').setOrigin(0.5, 0.5);
        this.musicText = this.add.text(-200, firstRow, this.data['Music'], { fontSize: fontsize, fontFamily: 'Carme', color: "black", align: 'center', origin: { x: 0.5, y: 0.5 } });
        this.musicText.setPosition(-this.musicText.width * 0.5, firstRow - 20);

        this.soundButton = this.add.image(-400, firstRow + rowGap, 'MenuAtlas', 'UI Buttons/CheckmarkON').setOrigin(0.5, 0.5);
        this.soundText = this.add.text(-200, firstRow + rowGap, this.data['Sound'], { fontSize: fontsize, fontFamily: 'Carme', color: "black", align: 'center', origin: { x: 0.5, y: 0.5 } });
        this.soundText.setPosition(-this.soundText.width * 0.5, firstRow + rowGap - 20);


        this.fullScreenButton = this.add.image(-400, firstRow + rowGap * 2, 'MenuAtlas', 'UI Buttons/CheckmarkOFF').setOrigin(0.5, 0.5);
        this.fullScreenText = this.add.text(-200, firstRow + rowGap * 2, this.data['Fullscreen'], { fontSize: fontsize, fontFamily: 'Carme', color: "black", align: 'center', origin: { x: 0.5, y: 0.5 } });
        this.fullScreenText.setPosition(-this.fullScreenText.width * 0.5, (firstRow + rowGap * 2) - 20);


        this.isFullscreen = this.scale.isFullscreen;

        this.musicButton.setInteractive();
        this.soundButton.setInteractive();
        this.fullScreenButton.setInteractive();

        //this.optionColumn = new uiWidgets.Column(this.game, -100, -200);

        this.menuElements.add([this.musicButton, this.musicText, this.soundButton, this.soundText, this.fullScreenButton, this.fullScreenText, this.exitButton]);

        this.menu.add(this.menuElements);

        // Call updateAudio to make sure we have correct values for checkboxes
        this.updateAudio();
        this.updateFullScreen();

        this.musicButton.on('pointerdown', function () {
            config.musicOn = !config.musicOn;
            this.updateAudio();
        }.bind(this));

        this.soundButton.on('pointerdown', function () {
            config.soundOn = !config.soundOn;
            this.updateAudio();
        }.bind(this));

        this.fullScreenButton.on('pointerdown', function () {
            this.scale.toggleFullscreen();

            this.isFullscreen = !this.isFullscreen;

            this.updateFullScreen();


        }.bind(this));

        this.menu.setScale(0.56);

    }

    updateAudio() {
        if (config.musicOn == false) {
            this.musicButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkOFF');
        }
        else {
            this.musicButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkON');
        }

        if (config.soundOn == false) {
            this.soundButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkOFF');
        }
        else {
            this.soundButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkON');
        }
    }

    updateFullScreen() {
        if (this.isFullscreen) {
            // On start full screen
            this.fullScreenButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkON')
        } else {
            // On stop full screen
            this.fullScreenButton.setTexture('MenuAtlas', 'UI Buttons/CheckmarkOFF')
        }
    }


    createExitButton() {
        // Exit button
        //let exitButton = this.add.sprite(35, 400, 'MenuAtlas', 'UI Buttons/Sulje');
        this.exitButton = CreateTextButton(this, 0, 400, 'UI Buttons/Nappi', this.data['Close']);

        this.exitButton.setPosition(0, 410);

        //let exitButton = this.add.container(this.menuBG.width / 2, -this.menuBG.height / 2, [ exitButtonBG ]);
        //exitButton.setSize(exitButtonBG.width, exitButtonBG.height);
        //this.menu.add(this.exitButton);
        this.exitButton.setInteractive();

        var pressed = false;

        this.exitButton.on('pointerout', function () {

            this.exitButton.bg.clearTint();
            pressed = false;

        }, this);

        this.exitButton.on('pointerdown', function () {

            this.exitButton.bg.setTint(0xd5d1c7);
            pressed = true;

        }, this);

        this.exitButton.on('pointerup', function (event) {
            if (pressed) {

                saveGame({ musicOn: config.musicOn, soundOn: config.soundOn });

                this.scene.stop(this.scene.key);

                //this.time.paused = false;

                optionsButton.open = false;

                readyToMove = true;
            }
        }, this);


    }

    CreateFlags() {
        let flagScale = 0.41;

        this.fi = this.add.sprite(-135, 275, 'MenuAtlas', 'UI Buttons/FI').setScale(flagScale);
        this.eng = this.add.sprite(150, 275, 'MenuAtlas', 'UI Buttons/ENG').setScale(flagScale);
        //this.swe = this.add.sprite(220, 300, 'MenuAtlas', 'UI Buttons/SWE').setScale(flagScale);

        this.menuElements.add([this.fi, this.eng]);

        this.fi.setInteractive();

        this.fi.on('pointerdown', function () {
            this.fi.pressed = true;
            this.fi.setTint(0xd5d1c7);
        }, this);

        this.fi.on('pointerout', function () {

            if (this.fi.pressed) {
                this.fi.pressed = false;
                this.fi.clearTint();
            }
        }, this);

        // Language button functionality
        this.fi.on('pointerup', function () {
            if (this.fi.pressed == true) {
                languageChanged = true;

                config.language = 'FI';
                console.log('Language set to Finnish.');

                //Options is restarted first so that it loads the correct language
                this.scene.restart();

                let activeScenes = game.scene.getScenes(true);


                activeScenes.forEach(function (scene) {
                    //Condition so that options isn't restarted twice and that UI isn't restarted at all
                    if (scene != this && scene.scene.key != 'UI') {
                        scene.time.delayedCall(50, function () {

                            //If scene includes the player then save the current position of the player before restarting
                            if (scene.player) {
                                saveGame({ currentMap: scene.scene.key, playerX: scene.player.x, playerY: scene.player.y });
                                scene.scene.restart({ x: gameState.playerX, y: gameState.playerY });
                            }
                            else {
                                scene.scene.restart();

                            }
                            console.log(scene.scene.key +  ' restarted to change language.');
                        }, null, this);
                    }
                }, this);

                //Not the most elegant solution, but this is done with a delay so that it's not set to false before opening scene restarts and stops the opening scene from loading the language separately
                this.time.delayedCall(100, function () {
                    languageChanged = false;
                }, null, this);



            }
        }, this);

        this.eng.setInteractive();

        this.eng.on('pointerdown', function () {
            this.eng.pressed = true;
            this.eng.setTint(0xd5d1c7);
        }, this);

        this.eng.on('pointerout', function () {

            if (this.eng.pressed) {
                this.eng.pressed = false;
                this.eng.clearTint();
            }
        }, this);

        // Language button functionality
        this.eng.on('pointerup', function () {
            if (this.eng.pressed == true) {
                languageChanged = true;

                config.language = 'EN';
                console.log('Language set to English.');

                //Options is restarted first so that it loads the correct language
                this.scene.restart();

                let activeScenes = game.scene.getScenes(true);

                activeScenes.forEach(function (scene) {
                    //Condition so that options isn't restarted twice and so that UI isn't restarted at all
                    if (scene != this && scene.scene.key != 'UI') {
                        scene.time.delayedCall(50, function () {

                            //If scene includes the player then save the current position of the player before restarting
                            if (scene.player) {
                                saveGame({ currentMap: scene.scene.key, playerX: scene.player.x, playerY: scene.player.y });
                                scene.scene.restart({ x: gameState.playerX, y: gameState.playerY });
                            }
                            else {
                                scene.scene.restart();
                            }

                            console.log(scene.scene.key +  ' restarted to change language.');

                        }, null, this);
                    }
                }, this);

                //Not the most elegant solution, but this is done with a delay so that it's not set to false before opening scene restarts and stops the opening scene from loading the language separately
                this.time.delayedCall(100, function () {
                    languageChanged = false;
                }, null, this);
            }
        }, this);
    }
}