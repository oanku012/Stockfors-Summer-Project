//Bool used to indicate when language is being changed
class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');

        this.title = 'Credits';
        this.description = '';

    }

    preload() {
        this.data = this.cache.json.get('data').OptionsMenu;
    }

    create() {
        this.scene.bringToTop();
        this.createExitButton();
        this.createContainer();
    }

    createContainer() {
        // Menu
        this.menuBG = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/InsideVaaka');
        this.menu = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY - 20, [this.menuBG]).setScale(0.8);

        // title and description
        let title = this.add.text(0, -350, this.data['Credits']);
        title.setFontSize(64);
        title.setPosition(0, -480);
        title.setColor("black");
        title.setFontFamily('LexendTera');
        title.setOrigin(0.5, 0.5);
        this.menu.add(title);
        this.menu.add(this.exitButton);
    }

    createCredits() {


    }


    createExitButton() {
        // Exit button
        this.exitButton = CreateTextButton(this, 0, 400, 'UI Buttons/Nappi', this.data['Close']);
        this.exitButton.setPosition(0, 500);
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
                this.scene.stop(this.scene.key);
            }
        }, this);
    }

   
}