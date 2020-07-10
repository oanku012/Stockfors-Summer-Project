class OpeningScene extends Phaser.Scene {

    constructor() {
        super('OpeningScene');

        this.newGame;
        this.continue;
        this.clearDataText;

        this.menuContainer;
    }

    preload() {
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

        this.load.atlas('buttonSheet', 'Assets/images/menu/Buttons/MenuButtons.png', 'Assets/images/menu/Buttons/MenuButtons.json');
        this.load.atlas('BGSheet', 'Assets/images/menu/Backgrounds/MenuBackgrounds.png', 'Assets/images/menu/Backgrounds/MenuBackgrounds.json');
        this.load.image('Logo', 'Assets/images/menu/Logo.png');
    }

    create() {
        this.add.text(700, 200, "Stockfors Kartalle", { font: "40px Arial", fill: "yellow" });

        this.cameras.main.backgroundColor.setTo(255, 255, 255);

        this.aloitusPohja = this.add.sprite(0, 0, 'BGSheet', 'Aloitusruutu');

        this.logo = this.add.image(-137, -835, 'Logo').setScale(0.22);
        this.newGame = this.add.sprite(-200, 700, 'buttonSheet', 'Aloita');
        this.continue = this.add.sprite(200, 700, 'buttonSheet', 'Jatka');
        this.fi = this.add.sprite(-225, 550, 'buttonSheet', 'FI').setScale(0.3);
        this.eng = this.add.sprite(-12, 550, 'buttonSheet', 'ENG').setScale(0.3);
        this.swe = this.add.sprite(210, 550, 'buttonSheet', 'SWE').setScale(0.3);
        this.ohje = this.add.sprite(500, 700, 'buttonSheet', 'Ohje');
        this.clearDataText = this.add.text(1400, 200, "Clear save data", { font: "40px Arial", fill: "white" });

        this.menuContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY + 20, 
            [   this.aloitusPohja, 
                this.logo, 
                this.newGame, 
                this.continue, 
                this.fi, 
                this.eng, 
                this.swe, 
                this.ohje]);

        this.menuContainer.setScale(0.56);

        this.newGame.setInteractive();

        this.newGame.on('pointerdown', function () {
            this.newGame.setTexture('buttonSheet', 'Aloita_Pressed');
        }, this);

        this.newGame.on('pointerout', function () {
            if (this.input.activePointer.isDown) {
                this.newGame.setTexture('buttonSheet', 'Aloita');
            }
        }, this);

        this.newGame.on('pointerup', function () {
            gameState = startingGameState;

            this.scene.start('StockforsScene');
            console.log('Started new game.');
        }, this);

        let savedGame = loadGame();

        //let savedSettings = loadGame('settings');

        if (savedGame != null) {

            config.musicOn = savedGame.MusicOn;
            config.soundOn = savedGame.SoundOn;

        }

        this.continue.setInteractive();

        this.continue.on('pointerdown', function () {
            this.continue.setTexture('buttonSheet', 'Jatka_Pressed');
        }, this);

        this.continue.on('pointerout', function () {

            if (this.input.activePointer.isDown) {
                this.continue.setTexture('buttonSheet', 'Jatka');
            }
        }, this);

        this.continue.on('pointerup', function () {
            if (savedGame != null) {

                this.scene.start(gameState.currentMap, { x: gameState.playerX, y: gameState.playerY });
                console.log('Loaded game from save file.');

            }
            else {
                console.log('No save file available, start a new game instead.');
            }
        }, this);

        this.clearDataText.setInteractive();

        this.clearDataText.on('pointerup', function () {
            localStorage.clear();

            console.log('Saved data cleared');
        });

        createButton(this.cameras.main.centerX + this.cameras.main.width * .4, this.cameras.main.centerY - this.cameras.main.height * .4, 'OptionsMenuScene', true, 0, 1, this);

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



}