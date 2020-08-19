class UI extends Phaser.Scene {
    constructor() {
        super('UI');

    }

    create() {
        optionsButton = createButton(this.cameras.main.centerX + this.cameras.main.width * .475, this.cameras.main.centerY - this.cameras.main.height * .445, 'OptionsMenuScene', true, 0, 0.56, this, 'MenuAtlas', 'UI Buttons/Asetukset');

        historyButton = createButton(this.cameras.main.centerX - this.cameras.main.width * .470, this.cameras.main.centerY - this.cameras.main.height * .440, 'HistoryScene', true, 0, 1, this, 'MenuAtlas', 'UI Buttons/Logo').setScale(0.3);
        /*historyButton.on('pointerover', function(){

        })*/
        //this.add.sprite(400, 400, 'MenuAtlas','UI Buttons/Asetukset');

    }
}

function CreateTextButton(context, x, y, buttonspriteframe, text) {

    let button = context.add.sprite(0, 0, 'MenuAtlas', buttonspriteframe);

    //let buttontext = context.add.text(-button.width * 0.15, -20, text, { fontSize: 40, color: 'black', wordWrap: {width: button.width}});

    let buttontext = context.make.text({
        x: -button.width * 0.15,
        y: -20,
        text: text,
        origin: { x: 0.5, y: 0.5 },
        style: {
            font: '44px Carme',
            fill: 'black',
            wordWrap: { width: button.width },
            align: 'center'
        }
    });

    buttontext.setDisplayOrigin(button.width / 2, button.height / 2);

    if (buttonspriteframe == 'UI Buttons/Nappi' || buttonspriteframe == 'UI Buttons/OK') {
        buttontext.setPosition((button.width / 2) - (buttontext.width / 2), (button.height / 2) - (buttontext.height / 2));
    }
    //Move text a little to the right with back button so it's not over the icon
    else if (buttonspriteframe == 'UI Buttons/Takaisin') {
        buttontext.setPosition(((button.width / 2) - (buttontext.width / 2)) + 40, (button.height / 2) - (buttontext.height / 2));
    }

    let container = context.add.container(x, y, [button, buttontext]);

    container.setSize(button.width, button.height);

    //This is just so there's an easy to use reference to the different elements
    container.bg = button;
    container.text = buttontext;

    container.setInteractive();

    container.on('pointerdown', function () {
        button.setTint(0xd5d1c7);
        container.pressed = true;
    }, context);

    container.on('pointerout', function () {
        if (this.input.activePointer.isDown) {
            button.clearTint();
            container.pressed = false;
        }
    }, context);


    container.on('pointerup', function (event) {
        if (container.pressed) {
            button.clearTint();
        }
    }, context);

    return container;
}
