class UI extends Phaser.Scene{
    constructor(){
        super('UI');

    }

    create()
    {
        createButton(this.cameras.main.centerX + this.cameras.main.width * .475, this.cameras.main.centerY - this.cameras.main.height * .445, 'OptionsMenuScene', true, 0, 0.56, this, 'MenuAtlas', 'UI Buttons/Asetukset');

        //this.add.sprite(400, 400, 'MenuAtlas','UI Buttons/Asetukset');

    }
}