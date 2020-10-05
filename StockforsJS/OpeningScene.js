class OpeningScene extends Phaser.Scene {

    constructor() {
        super('OpeningScene');

        this.newGame;
        this.continue;
        this.clearDataText;

        this.mainMenuContainer;
    }

    preload() {

        // Check header if we have selected a language
        // If we do, skip language selection at the start
        let searchParams = new URLSearchParams(window.location.search)
        if (searchParams.has('lang'))
        {
            let param = searchParams.get('lang')
            if (param === "fi")
            {
                config.language = 'FI';
                console.log('Language set to Finnish.');
                this.languageChosen = true;
            }

            else if (param === "en")
            {
                config.language = 'EN';
                console.log('Language set to English.');
                this.languageChosen = true;
            }
        }


        //Only loaded when languagechanged is false(which it is by default) so that it doesn't load unnecessarily when changing the language from the options menu
        if (languageChanged === false) {
           
           this.cache.json.remove('data');

           var path = ("Localization/" + config.language + "/data.json");
           this.load.json('data', path);

           console.log('Language loaded');

           this.cameras.main.backgroundColor.setTo(255, 255, 255);

            
        }
        else if(languageChanged === true)
        {
            languageChanged = false;
        }
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

        //Backgroundimage
        this.background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'tausta').setScale(1.34);

        this.data = this.cache.json.get('data').MainMenu;

        // Request to use full screen if using a mobile device
        // Add other devices maybe?
        if (this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone)
        {
            if(!this.scale.isFullscreen)
            {
                this.RequestFullscreen();
            }
    
        }
        
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
    }

    
    RequestFullscreen()
    {
        let menuBG = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/InsideVaaka');
        let menu = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY - 20, [menuBG]).setScale(0.8);


        let style = {
            font: '70px Arial',
            fill: 'black',
            wordWrap: { width: 1200 }
        };

        let text = this.make.text({
            x: 0,
            y: -100,
            text: this.data['FullscreenText'],
            origin: { x: 0.5, y: 0.5 },
            style: style
        });

        let yesButton = CreateTextButton(this, -250, 400, 'UI Buttons/Nappi', this.data['YesText']);
        let noButton = CreateTextButton(this, 250, 400, 'UI Buttons/Nappi', this.data['NoText']);

        menu.add([menuBG, text, yesButton, noButton]);
        menu.setDepth(1);

        yesButton.on('pointerup', function () {
            if (yesButton.pressed) {
                // toggle fullscreen
                this.scale.startFullscreen();
                menu.destroy();
            }
        }, this);

        noButton.on('pointerup', function () {
            if (noButton.pressed) {
                menu.destroy();
            }
        }, this);
    }

    CreateLanguageMenu() {
        this.languagePohja = this.add.sprite(0, -83, 'MenuAtlas', 'UI Pohjat/Kielivalikko');

        let flagScale = 0.7;

        this.fi = this.add.sprite(-200, -130, 'MenuAtlas', 'UI Buttons/FI').setScale(flagScale);
        this.eng = this.add.sprite(200, -130, 'MenuAtlas', 'UI Buttons/ENG').setScale(flagScale);
        //this.swe = this.add.sprite(300, -150, 'MenuAtlas', 'UI Buttons/SWE').setScale(flagScale);

        this.languageContainer = this.CreateMenuContainer([this.languagePohja, this.fi, this.eng]);

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
        //this.scale.lockOrientation('landscape');

        //this.add.text(700, 200, "Stockfors Kartalle", { font: "40px Arial", fill: "yellow" });

        this.aloitusPohja = this.add.sprite(-80, -83, 'MenuAtlas', 'UI Pohjat/Aloitusruutu');

        // Get title and description from a json file
        //var data = this.cache.json.get('mainMenuData');

        this.infoHeader = this.make.text({
            x: -500,
            y: -655,
            text: this.data['OpeningHeader'],
            origin: { x: 0, y: 0.5 },
            style: {
                font: '44px LexendTera',
                fill: 'black',
                wordWrap: { width: 1000 },
                align: 'left'
            }
        });

        this.infoText = this.make.text({
            x: 0,
            y: -200,
            text: this.data['OpeningText'],
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: '40px Carme',
                fill: 'black',
                align: 'left',
                wordWrap: { width: 1000 }
            }
        });

        
        this.newGame = CreateTextButton(this, -200, 700, 'UI Buttons/Nappi', this.data['NewGame']);
        this.continue = CreateTextButton(this, 200, 700, 'UI Buttons/Nappi', this.data['ContinueGame']);
        //this.ohjeNappi = this.add.sprite(500, 700, 'MenuAtlas', 'UI Buttons/Ohje');
        this.ohjeNappi = CreateButton(this, 500, 700, 'UI Buttons/Ohje');
        //this.clearDataText = this.add.text(1400, 200, "Clear save data", { font: "40px Carme", fill: "black" });

        this.mainMenuContainer = this.CreateMenuContainer(
            [
            this.aloitusPohja,
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

                    this.scene.start(gameState.currentMap, { x: gameState.playerX, y: gameState.playerY, readyToEnter: gameState.readyToEnter });
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
            x: -530,
            y: -700,
            text: this.data['HelpHeader'],
            origin: { x: 0, y: 0.0 },
            style: {
                font: '44px LexendTera',
                fill: 'black',
                wordWrap: { width: 1000 }
            }
        });

        this.helpText = this.make.text({
            x: -530,
            y: -200,
            text: this.data['HelpText'],
            origin: { x: 0, y: 0.5 },
            style: {
                font: '40px Carme',
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
        let container = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY + 30, elementsToAdd);

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