class UI extends Phaser.Scene {
    constructor() {
        super('UI');

    }

    create() {
        createButton(this.cameras.main.centerX + this.cameras.main.width * .475, this.cameras.main.centerY - this.cameras.main.height * .445, 'OptionsMenuScene', true, 0, 0.56, this, 'MenuAtlas', 'UI Buttons/Asetukset');

        //this.add.sprite(400, 400, 'MenuAtlas','UI Buttons/Asetukset');

    }
}

function CreateTextButton(context, x, y, buttonspriteframe, text) {

    let button = context.add.sprite(0, 0, 'MenuAtlas', buttonspriteframe);

    let buttontext = context.add.text(-button.width * 0.15, -20, text, { fontSize: 40, color: 'black' });

    buttontext.setDisplayOrigin(button.width / 2, button.height / 2);

    if (buttonspriteframe == 'UI Buttons/Nappi') {
        buttontext.setPosition((button.width / 2) - (buttontext.width / 2), (button.height / 2) - (buttontext.height / 2));
    }
    //Move text a little to the right with back button so it's not over the icon
    else if (buttonspriteframe == 'UI Buttons/Takaisin') {
        buttontext.setPosition(((button.width / 2) - (buttontext.width / 2)) + 40, (button.height / 2) - (buttontext.height / 2));
    }

    let container = context.add.container(x, y, [button, buttontext]);

    container.setSize(button.width, button.height);

    //This is just so there's an easy to use reference to the button element
    container.bg = button;

    return container;
}
