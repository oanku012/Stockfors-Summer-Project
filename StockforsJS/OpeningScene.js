class OpeningScene extends Phaser.Scene {

    constructor() {
        super('OpeningScene');

        this.newGameText;
        this.continueText;
        this.clearDataText;
    }

    preload() {
        this.load.image('buttonBG', 'Assets/images/menu/button-bg.png');
        this.load.image('buttonText', 'Assets/images/menu/button-text.png');
        this.load.image('menuBG', 'Assets/images/menu/menu-bg.png');
        this.load.image('exitButton', 'Assets/images/menu/exit-button.png');

        this.load.spritesheet('playerWalk', 'Assets/images/character/PlayerWalking.png', { frameWidth: 378, frameHeight: 378 });
        this.load.spritesheet('playerIdle', 'Assets/images/character/PlayerStanding.png', { frameWidth: 378, frameHeight: 378 });

        this.load.image('map', 'Assets/images/map/kartta.png');
        /*this.load.image('PatruunanTalo', 'Assets/images/map/Buildings/Patruunantalo');
        this.load.image('PakkausMuseo', 'Assets/images/map/Buildings/Pakkausmuseo');
        this.load.image('Kaarihalli', 'Assets/images/map/Buildings/Kaarihalli');
        this.load.image('Hunajatalo', 'Assets/images/map/Buildings/Hunajatalo');
        this.load.image('Tallirakennus', 'Assets/images/map/Buildings/Tallirakennus');*/
        this.load.image('Nuoli', 'Assets/images/map/arrowSign');

        this.load.atlas('buildingSheet', 'Assets/images/map/Buildings/TPBuildings.png', 'Assets/images/map/Buildings/TPBuildings.json')
        this.load.json('buildingBodies', 'Assets/images/map/Buildings/PEBuildings.json');
    }

    create() {
        this.add.text(700, 200, "Stockfors Kartalle", { font: "40px Arial", fill: "yellow" });

        this.newGameText = this.add.text(700, 300, "Start new game.", { font: "40px Arial", fill: "white" });
        this.continueText = this.add.text(700, 400, "Continue", { font: "40px Arial", fill: "white" });
        this.clearDataText = this.add.text(1400, 200, "Clear save data", { font: "40px Arial", fill: "white" });

        this.newGameText.setInteractive();

        this.newGameText.on('pointerup', function () {
            this.scene.scene.start('StockforsScene');
            console.log('Started new game.');
        });

        let savedSettings = loadSettings();

        if (savedSettings != null) {
            
            config.musicOn = savedSettings.MusicOn;
            config.soundOn = savedSettings.SoundOn;
            
        }

        let savedGame = loadGame();

        this.continueText.setInteractive();

        this.continueText.on('pointerup', function () 
        {

            if (savedGame != null) 
            {
                
                this.scene.scene.start(savedGame.map, { x: savedGame.posX, y: savedGame.posY });
                console.log('Loaded game from save file.');
                
            }
            else 
            {
                console.log('No save file available, start a new game instead.');
            }
        });

        this.clearDataText.setInteractive();

        this.clearDataText.on('pointerup', function () {
            localStorage.clear();

            console.log('Saved data cleared');
        });

        createButton(this.cameras.main.centerX + this.cameras.main.width * .4, this.cameras.main.centerY - this.cameras.main.height * .4, 'OptionsMenuScene', true, 0, 1, this);

        //Just for testing purposes
        let muistipeliButton = this.add.image(200, 200, 'buttonBG');

        muistipeliButton.setInteractive();

        muistipeliButton.on('pointerup', function () {
            this.scene.start('MuistiPeliScene');
        }, this);

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