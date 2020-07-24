class OpeningScene extends Phaser.Scene {

    constructor() {
        super('OpeningScene');

        this.newGame;
        this.continue;
        this.clearDataText;

        this.mainMenuContainer;
    }

    preload() {

        //Only loaded when languagechanged is false(which it is by default) so that it doesn't load unnecessarily when changing the language from the options menu
        if (languageChanged === false) {
           // Make sure to remove all localization data before loading any
            this.cache.json.remove('mainMenuData');
            this.cache.json.remove('buildingData');
            this.cache.json.remove('optionsData');

            // Load JSON data
            var path = ("Localization/" + config.language + "/MainMenu.json");
            this.load.json('mainMenuData', path);

            // Json data for all building info
            var path = ("Localization/" + config.language + "/Buildings.json");
            this.load.json('buildingData', path);

            // Json data for all options info
            var path = ("Localization/" + config.language + "/OptionsMenu.json");
            this.load.json('optionsData', path);

            console.log('Language loaded from opening scene.');

            
        }


        // This stuff is now loaded in assets.json
        /*
        this.load.image('buttonBG', 'Assets/images/menu/button-bg.png');
        this.load.image('buttonText', 'Assets/images/menu/button-text.png');
        this.load.image('menuBG', 'Assets/images/menu/menu-bg.png');
        this.load.image('exitButton', 'Assets/images/menu/exit-button.png');

        this.load.spritesheet('playerWalk', 'Assets/images/character/PlayerWalking.png', { frameWidth: 378, frameHeight: 378 });
        this.load.spritesheet('playerIdle', 'Assets/images/character/PlayerStanding.png', { frameWidth: 378, frameHeight: 378 });

        this.load.image('map', 'Assets/images/map/kartta.png');

        this.load.image('Nuoli', 'Assets/images/map/arrowSign');

        //Used texturepacker and physicseditor to compile the buildings into a single spritesheet
        this.load.atlas('buildingSheet', 'Assets/images/map/Buildings/TPBuildings.png', 'Assets/images/map/Buildings/TPBuildings.json');
        this.load.json('buildingBodies', 'Assets/images/map/Buildings/PEBuildings.json');

        //this.load.atlas('buttonSheet', 'Assets/images/menu/Buttons/MenuButtons.png', 'Assets/images/menu/Buttons/MenuButtons.json');
        //this.load.atlas('BGSheet', 'Assets/images/menu/Backgrounds/MenuBackgrounds.png', 'Assets/images/menu/Backgrounds/MenuBackgrounds.json');
        this.load.atlas('MenuAtlas', 'Assets/images/menu/MenuAssets.png', 'Assets/images/menu/MenuAssets.json');
        this.load.image('Logo', 'Assets/images/menu/Logo.png');
        */
    }

    //This is used when restarting the scene with a chosen language, when languagechosen is true the language menu is hidden
    init(languageChosen) {

        if (languageChosen == true) {
            this.languageChosen = true;
        }
        else {
            this.languageChosen = false;
        }

        //console.log(this.languageChosen);
    }

    create() {

        this.cameras.main.backgroundColor.setTo(255, 255, 255);

        this.data = this.cache.json.get('mainMenuData');

        this.CreateLanguageMenu();

        this.CreateInstructions();

        this.CreateMainMenu();

        if (this.languageChosen) {
            this.languageContainer.setVisible(false);
            this.mainMenuContainer.setVisible(true);

            this.scene.run('UI');

            this.languageChosen = false;

        }
        else {
            this.languageContainer.setVisible(true);
            this.mainMenuContainer.setVisible(false);
        }

        this.ohjeContainer.setVisible(false);

        //createButton(this.cameras.main.centerX + this.cameras.main.width * .4, this.cameras.main.centerY - this.cameras.main.height * .4, 'OptionsMenuScene', true, 0, 0.56, this, 'MenuAtlas', 'UI Buttons/Asetukset');

        /*this.input.keyboard.on('keydown', function (event) {
            let saveFile = loadGame();

            //currentMap = this.scene.scene.get(saveFile.map);

            if (saveFile.map != null) {
                this.scene.scene.start(saveFile.map, saveFile.posX, saveFile.posY);
                console.log('Loaded game from save file.');
            }
            else
            {
                this.scene.scene.start('StockforsScene');
                console.log('Started new game.');
            }
        });*/


    }

    CreateLanguageMenu() {
        this.languagePohja = this.add.sprite(0, -83, 'MenuAtlas', 'UI Pohjat/Kielivalikko');

        let flagScale = 0.5;

        this.fi = this.add.sprite(-300, -150, 'MenuAtlas', 'UI Buttons/FI').setScale(flagScale);
        this.eng = this.add.sprite(0, -150, 'MenuAtlas', 'UI Buttons/ENG').setScale(flagScale);
        this.swe = this.add.sprite(300, -150, 'MenuAtlas', 'UI Buttons/SWE').setScale(flagScale);

        this.languageContainer = this.CreateMenuContainer([this.languagePohja, this.fi, this.eng, this.swe]);

        // Language button functionality
        this.fi.on('pointerup', function () {
            if (this.fi.pressed == true) {
                config.language = 'FI';
                console.log('Language set to Finnish.');
                this.scene.restart(true);


            }
        }, this);

        // Language button functionality
        this.eng.on('pointerup', function () {
            if (this.eng.pressed == true) {
                config.language = 'EN';
                console.log('Language set to English.');
                this.scene.restart(true);
            }
        }, this);


    }

    CreateMainMenu() {
        //Doesn't seem to work
        //this.scale.lockOrientation(Phaser.Scale.LANDSCAPE);

        //this.add.text(700, 200, "Stockfors Kartalle", { font: "40px Arial", fill: "yellow" });



        this.aloitusPohja = this.add.sprite(-80, -83, 'MenuAtlas', 'UI Pohjat/Aloitusruutu');

        // Get title and description from a json file
        //var data = this.cache.json.get('mainMenuData');

        this.infoHeader = this.make.text({
            x: 0,
            y: -650,
            text: this.data['OpeningHeader'],
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: '44px Arial',
                fill: 'black',
                wordWrap: { width: 1000 }
            }
        });

        this.infoText = this.make.text({
            x: 0,
            y: -200,
            text: this.data['OpeningText'],
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: '40px Arial',
                fill: 'black',
                wordWrap: { width: 1000 }
            }
        });

        //this.newGame = this.add.sprite(-200, 700, 'MenuAtlas', 'UI Buttons/Nappi');
        this.newGame = CreateTextButton(this, -200, 700, 'UI Buttons/Nappi', this.data['NewGame']);
        //this.continue = this.add.sprite(200, 700, 'MenuAtlas', 'UI Buttons/Nappi');
        this.continue = CreateTextButton(this, 200, 700, 'UI Buttons/Nappi', this.data['ContinueGame']);
        this.ohjeNappi = this.add.sprite(500, 700, 'MenuAtlas', 'UI Buttons/Ohje');
        this.clearDataText = this.add.text(1400, 200, "Clear save data", { font: "40px Arial", fill: "black" });

        this.mainMenuContainer = this.CreateMenuContainer(
            [this.aloitusPohja,
            this.infoText,
            this.infoHeader,
            this.newGame,
            this.continue,
            this.ohjeNappi]);

        this.newGame.on('pointerup', function () {
            if (this.newGame.pressed == true) {

                gameState = startingGameState;

                this.scene.start('StockforsScene');
                console.log('Started new game.');
            }
        }, this);

        let savedGame = loadGame();

        //let savedSettings = loadGame('settings');

        if (savedGame != null) {

            if (savedGame.musicOn != undefined && savedGame.soundOn != undefined) {
                config.musicOn = savedGame.musicOn;
                config.soundOn = savedGame.soundOn;
                console.log('Settings loaded and set.');
            }
            else {
                console.log('Sound settings undefined.');
            }
        }


        this.continue.on('pointerup', function () {

            if (this.continue.pressed == true) {

                if (savedGame != null) {

                    this.scene.start(gameState.currentMap, { x: gameState.playerX, y: gameState.playerY });
                    console.log('Loaded game from save file.');

                }
                else {
                    console.log('No save file available, start a new game instead.');
                }
            }
        }, this);


        this.ohjeNappi.on('pointerup', function () {
            if (this.ohjeNappi.pressed == true) {

                this.mainMenuContainer.setVisible(false);
                this.ohjeContainer.setVisible(true);

            }
        }, this);

        this.clearDataText.setInteractive();

        this.clearDataText.on('pointerup', function () {
            localStorage.clear();

            console.log('Saved data cleared');
        });

        if (!savedGame) {
            this.continue.setVisible(false);

            this.newGame.setPosition(0, 700);
        }
    }

    CreateInstructions() {

        this.ohjePohja = this.add.sprite(-40, -40, 'MenuAtlas', 'UI Pohjat/Ohjeruutu');

        this.back = CreateTextButton(this, -400, 700, 'UI Buttons/Takaisin', this.data['Back']);

        // Get title and description from a json file
        //var data = this.cache.json.get('mainMenuData');

        this.helpHeader = this.make.text({
            x: 0,
            y: -700,
            text: this.data['HelpHeader'],
            origin: { x: 0.5, y: 0.0 },
            style: {
                font: '44px Arial',
                fill: 'black',
                wordWrap: { width: 1000 }
            }
        });

        this.helpText = this.make.text({
            x: 0,
            y: -200,
            text: this.data['HelpText'],
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: '40px Arial',
                fill: 'black',
                wordWrap: { width: 1000 }
            }
        });


        this.ohjeContainer = this.CreateMenuContainer([this.ohjePohja, this.back, this.helpHeader, this.helpText]);

        this.back.on('pointerup', function () {
            if (this.back.pressed == true) {
                //this.back.bg.setTexture('MenuAtlas', 'UI Buttons/Takaisin');
                this.mainMenuContainer.setVisible(true);
                this.ohjeContainer.setVisible(false);
            }
        }, this);

    }

    CreateMenuContainer(elementsToAdd = []) {
        let container = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY + 20, elementsToAdd);

        container.iterate(function (element) {

            //Couldn't come up with a more elegant solution to exclude the backgrounds
            if (element != this.ohjePohja && element != this.aloitusPohja && element != this.languagePohja) {

                //Some of this stuff is now done in the createtextbutton function so they're commented off

                if (element.bg == undefined) {
                    element.setInteractive();
                    element.pressed = false;
                }

                element.on('pointerdown', function () {
                    //element.pressed = true;

                    if (element.bg) {
                        //element.bg.setTint(0xd5d1c7);
                    }
                    else {
                        element.setTint(0xd5d1c7);
                        element.pressed = true;
                    }
                }, this);

                element.on('pointerout', function () {
                    //element.pressed = false;
                    if (element.bg) {
                        //element.bg.clearTint();
                    }
                    else {
                        element.clearTint();
                        element.pressed = false;

                    }
                }, this);

                element.on('pointerup', function () {

                    if (element.bg) {
                        //element.bg.clearTint();
                    }
                    else {
                        element.clearTint();

                    }
                }, this);

            }
        }, this);

        container.setScale(0.56);

        return container;
    }



}