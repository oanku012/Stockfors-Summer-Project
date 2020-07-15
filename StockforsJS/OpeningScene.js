class OpeningScene extends Phaser.Scene {

    constructor() {
        super('OpeningScene');

        this.newGame;
        this.continue;
        this.clearDataText;

        this.mainMenuContainer;
    }

    preload() {
        // Load JSON data
        var path = ("Localization/FI/MainMenu.json");
        this.load.json('mainMenuData', path);

        // Json data for all building info
        var path = ("Localization/FI/buildings.json");
        this.load.json('buildingData', path);

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
    }

    create() {

        

        this.CreateInstructions();

        this.CreateMainMenu();

        this.ohjeContainer.setVisible(false);

        this.scene.run('UI');
        

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

    CreateMainMenu() {
        //Doesn't seem to work
        //this.scale.lockOrientation(Phaser.Scale.LANDSCAPE);

        //this.add.text(700, 200, "Stockfors Kartalle", { font: "40px Arial", fill: "yellow" });

        this.cameras.main.backgroundColor.setTo(255, 255, 255);

        this.aloitusPohja = this.add.sprite(-80, -83, 'MenuAtlas', 'UI Pohjat/Aloitusruutu');

        // Get title and description from a json file
        var data = this.cache.json.get('mainMenuData');

        this.infoHeader = this.make.text({
            x: 0,
            y: -650,
            text: data['OpeningHeader'],
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: '44px Arial',
                fill: 'black',
                wordWrap: { width: 1000 }
            }
        });

        this.infoText = this.make.text({
            x: 0,
            y: -100,
            text: data['OpeningText'],
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: '40px Arial',
                fill: 'black',
                wordWrap: { width: 1000 }
            }
        });

        this.newGame = this.add.sprite(-200, 700, 'MenuAtlas', 'UI Buttons/Aloita');
        this.continue = this.add.sprite(200, 700, 'MenuAtlas', 'UI Buttons/Jatka');
        this.fi = this.add.sprite(-225, 550, 'MenuAtlas', 'UI Buttons/FI').setScale(0.3);
        this.eng = this.add.sprite(-12, 550, 'MenuAtlas', 'UI Buttons/ENG').setScale(0.3);
        this.swe = this.add.sprite(210, 550, 'MenuAtlas', 'UI Buttons/SWE').setScale(0.3);
        this.ohjeNappi = this.add.sprite(500, 700, 'MenuAtlas', 'UI Buttons/Ohje');
        this.clearDataText = this.add.text(1400, 200, "Clear save data", { font: "40px Arial", fill: "white" });

        this.mainMenuContainer = this.CreateMenuContainer(
            [this.aloitusPohja,
            this.infoText,
            this.infoHeader,
            this.newGame,
            this.continue,
            this.fi,
            this.eng,
            this.swe,
            this.ohjeNappi]);

        this.newGame.on('pointerdown', function () {
            this.newGame.setTexture('MenuAtlas', 'UI Buttons/Aloita_Pressed');
        }, this);

        this.newGame.on('pointerout', function () {
            if (this.input.activePointer.isDown) {
                this.newGame.setTexture('MenuAtlas', 'UI Buttons/Aloita');
            }
        }, this);

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

            config.musicOn = savedGame.MusicOn;
            config.soundOn = savedGame.SoundOn;

        }

        this.continue.on('pointerdown', function () {
            this.continue.setTexture('MenuAtlas', 'UI Buttons/Jatka_Pressed');
        }, this);

        this.continue.on('pointerout', function () {

            if (this.input.activePointer.isDown) {
                this.continue.setTexture('MenuAtlas', 'UI Buttons/Jatka');
            }
        }, this);

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
    }

    CreateInstructions() {
        this.ohjePohja = this.add.sprite(-40, -40, 'MenuAtlas', 'UI Pohjat/Ohjeruutu');

        this.back = this.add.sprite(-400, 700, 'MenuAtlas', 'UI Buttons/Takaisin');

        this.ohjeContainer = this.CreateMenuContainer([this.ohjePohja, this.back]);

        this.back.on('pointerdown', function () {
            this.back.setTexture('MenuAtlas', 'UI Buttons/Takaisin_Pressed');
        }, this);

        this.back.on('pointerout', function () {

            if (this.input.activePointer.isDown) {
                this.back.setTexture('MenuAtlas', 'UI Buttons/Takaisin');
            }
        }, this);

        this.back.on('pointerup', function () {
            if (this.back.pressed == true) {
                this.back.setTexture('MenuAtlas', 'UI Buttons/Takaisin');
                this.mainMenuContainer.setVisible(true);
                this.ohjeContainer.setVisible(false);
            }
        }, this);

    }

    CreateMenuContainer(elementsToAdd = []) {
        let container = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY + 20, elementsToAdd);

        container.iterate(function (element) {
            element.setInteractive();
            element.pressed = false;
            element.on('pointerdown', function () {
                element.pressed = true;
            }, this);

            element.on('pointerout', function () {
                element.pressed = false;
            }, this);
        }, this);

        container.setScale(0.56);

        return container;
    }



}