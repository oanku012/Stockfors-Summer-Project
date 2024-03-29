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

            languageChanged = false;
            /*this.cache.json.remove('data');
 
            var path = ("Localization/" + config.language + "/data.json");
            this.load.json('data', path);
 
            console.log('Language loaded');*/
        }

        // slider plugin for audio volume
        // this.load.plugin('rexsliderplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsliderplugin.min.js', true);

    }

    create() {

        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;

        optionsButton.open = true;
        this.scene.bringToTop();

        //Brings the UI to the top so the options button in the corner isn't tinted over
        game.scene.getScene('UI').scene.bringToTop();

        //this.time.delayedCall(100, function () {
        this.data = this.cache.json.get('data').OptionsMenu;

        this.createContainer();
        this.createExitButton();
        this.createCreditsButton();
        this.createOptionsMenu();
        this.CreateFlags();

        //this.add.image(0, 0, 'MenuAtlas', 'UI Pohjat/Tummennus').setOrigin(0);

        this.cameras.main.backgroundColor.setTo(0, 0, 0, 100);

        //}, null, this);

        // Reorganize the UI when the game gets resized
        this.scale.on('resize', this.resize, this);

        rescaleSceneEvent(this);

    }

    createContainer() {

        // Menu
        this.menuBG = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/Settings').setOrigin(0.479, 0.5);
        this.menu = this.add.container(this.cameras.main.centerX - 37, this.cameras.main.centerY, [this.menuBG]).setScale(0.56).setDepth(9999);

        rescaleObjects(this.menu, this, 0.00021, 0.00021);

        //This is just to block from touching things behind the menu 
        this.menuBG.setInteractive();

        //This is just to move all the elements that are separate from the backgrounds
        this.menuElements = this.add.container(40, 0);

        // title and description
        let title = this.add.text(-410, -400, this.data.Title);
        title.setFontSize(60);
        title.setColor("black");
        title.setFontStyle('bold');
        title.setFontFamily('LexendTera');
        this.menu.add(title);

    }

    createOptionsMenu() {

        this.musicOn = true;
        this.soundOn = true;

        let firstRow = -190;
        let posX = -380;

        let rowGap = 137;

        let fontsize = 48;

        //The text align doesn't work on one line text
        this.musicButton = this.add.sprite(posX, firstRow, 'MenuAtlas', 'UI Buttons/CheckmarkON').setOrigin(0.5, 0.5);
        this.musicText = this.add.text(-200, firstRow, this.data['Music'], { fontSize: fontsize, fontFamily: 'Carme', color: "black", align: 'center', origin: { x: 0.5, y: 0.5 } });
        this.musicText.setPosition(-this.musicText.width * 0.5, firstRow - 25);

        // Volume slider
        /*
        this.volume = this.add.rectangle(400, 300, 50, 50, 0xffffff);
        this.volumeSlider = this.plugins.get('rexsliderplugin').add(this.volume, {
            endPoints: [
                 {x:0, y:0},
                 {x:210, y:0}
             ],
             value: 0,
             enable: true,
        
             valuechangeCallback: null,
             valuechangeCallbackScope: null
        });
        */

        this.soundButton = this.add.image(posX, firstRow + rowGap, 'MenuAtlas', 'UI Buttons/CheckmarkON').setOrigin(0.5, 0.5);
        this.soundText = this.add.text(-200, firstRow + rowGap, this.data['Sound'], { fontSize: fontsize, fontFamily: 'Carme', color: "black", align: 'center', origin: { x: 0.5, y: 0.5 } });
        this.soundText.setPosition(-this.soundText.width * 0.5, firstRow + rowGap - 25);


        this.fullScreenButton = this.add.image(posX, firstRow + rowGap * 2, 'MenuAtlas', 'UI Buttons/CheckmarkOFF').setOrigin(0.5, 0.5);
        this.fullScreenText = this.add.text(-200, firstRow + rowGap * 2, this.data['Fullscreen'], { fontSize: fontsize, fontFamily: 'Carme', color: "black", align: 'center', origin: { x: 0.5, y: 0.5 } });
        this.fullScreenText.setPosition(-this.fullScreenText.width * 0.5, (firstRow + rowGap * 2) - 25);


        this.isFullscreen = this.scale.isFullscreen;

        this.musicButton.setInteractive();
        this.soundButton.setInteractive();
        this.fullScreenButton.setInteractive();

        //this.optionColumn = new uiWidgets.Column(this.game, -100, -200);

        this.menuElements.add([this.musicButton, this.musicText, this.soundButton, this.soundText, this.fullScreenButton, this.fullScreenText, this.exitButton, this.creditsButton/*, this.volume*/]);

        this.menu.add(this.menuElements);

        // Call updateAudio to make sure we have correct values for checkboxes
        this.updateAudio();
        this.updateFullScreen();

        this.musicButton.on('pointerdown', function () {
            if (config.musicOn)
            {
                config.musicOn = false;
                game.scene.getScene('MusicPlayer').changeVolume(0);
            }
            else
            {
                config.musicOn = true;
                game.scene.getScene('MusicPlayer').changeVolume(game.scene.getScene('MusicPlayer').defaultVolume);
            }
            
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

        let topRight = this.menuBG.getTopRight();
        this.exitButton = CreateButton(this, topRight.x - 60, topRight.y + 80, 'UI Buttons/Zoom_Out').setScale(1.4);

        this.exitButton.on('pointerup', function (event) {
            if (this.exitButton.pressed) {

                saveGame({ musicOn: config.musicOn, soundOn: config.soundOn });

                this.scene.stop(this.scene.key);

                optionsButton.open = false;

                readyToMove = true;
            }
        }, this);
    }

    createCreditsButton() {
        // Credits button
        this.creditsButton = CreateTextButton(this, 20, 420, 'UI Buttons/Nappi', this.data['Credits']);
        this.creditsButton.setInteractive();

        this.creditsButton.on('pointerup', function (event) {
            if (this.creditsButton.pressed) {
                // Open credits scene
                this.scene.run("CreditsScene");
            }
        }, this);


    }

    CreateFlags() {
        let flagScale = 0.41;

        this.fi = this.add.sprite(-130, 275, 'MenuAtlas', 'UI Buttons/FI').setScale(flagScale);
        this.eng = this.add.sprite(140, 275, 'MenuAtlas', 'UI Buttons/ENG').setScale(flagScale);
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

                let activeScenes = game.scene.getScenes(true);

                this.scene.start('LanguageLoader', { activeScenes: activeScenes });
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

                //Get currently active scenes
                let activeScenes = game.scene.getScenes(true);

                //Loads the language
                this.scene.start('LanguageLoader', { activeScenes: activeScenes });
            }
        }, this);
    }

    resize() {
        if (this.scene.isActive(this.scene.key)) {
            this.menu.setX(this.centerX- 37);
            this.menu.setY(this.centerY);

            rescaleObjects(this.menu, this, 0.00021, 0.00021);
        }

    }
}