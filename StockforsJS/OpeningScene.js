class OpeningScene extends Phaser.Scene {

    constructor() {
        super('OpeningScene');

        this.newGameText;
        this.continueText;
        this.clearDataText;
    }

    preload()
    {
        this.load.image('buttonBG', 'Assets/images/menu/button-bg.png');
        this.load.image('buttonText', 'Assets/images/menu/button-text.png');
        this.load.image('menuBG', 'Assets/images/menu/menu-bg.png');
        this.load.image('exitButton', 'Assets/images/menu/exit-button.png');
    }

    create() {
        this.add.text(700, 200, "Stockfors Kartalle", { font: "40px Arial", fill: "yellow" });

        this.newGameText = this.add.text(700, 300, "Start new game.", { font: "40px Arial", fill: "white" });
        this.continueText = this.add.text(700, 400, "Continue", { font: "40px Arial", fill: "white" });
        this.clearDataText = this.add.text(1400, 200, "Clear save data", { font: "40px Arial", fill: "white" });

        this.newGameText.setInteractive();

        this.newGameText.on('pointerup', function()
        {
            this.scene.scene.start('StockforsScene');
            console.log('Started new game.');
        });

        let saveFile = loadGame();

        if(saveFile != null)
        {
            config.musicOn = saveFile.MusicOn;
            config.soundOn = saveFile.SoundOn;
        }

        this.continueText.setInteractive();

        this.continueText.on('pointerup', function()
        {

            if (saveFile != null) {
                this.scene.scene.start(saveFile.map, {x: saveFile.posX, y: saveFile.posY});
                console.log('Loaded game from save file.');
            }
            else
            {
                console.log('No save file available, start a new game instead.');
            }
        });

        this.clearDataText.setInteractive();

        this.clearDataText.on('pointerup', function()
        {
            localStorage.clear();

            console.log('Saved data cleared');
        });

        createButton(this.cameras.main.centerX + this.cameras.main.width * .4, this.cameras.main.centerY - this.cameras.main.height * .4, 'OptionsMenuScene', true, 0, 1, this);

        //Just for testing purposes
        let muistipeliButton = this.add.image(200, 200, 'buttonBG');

        muistipeliButton.setInteractive();

        muistipeliButton.on('pointerup', function(){
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