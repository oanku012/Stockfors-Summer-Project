class UI extends Phaser.Scene {
    constructor() {
        super('UI');

    }

    create() {

        //If on mobile make options button bigger to make it easier to press
        if (this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) {
            //optionsButton = createSceneOpenButton(this.cameras.main.centerX + this.cameras.main.width * .470 - 20, this.cameras.main.centerY - this.cameras.main.height * .445 + 20, 'OptionsMenuScene', true, 0, 1, this, 'MenuAtlas', 'UI Buttons/Asetukset');
            optionsButton = createSceneOpenButton(getWindowWidth() - 10, 10, 'OptionsMenuScene', true, 0, 1, this, 'MenuAtlas', 'UI Buttons/Asetukset');
        }
        else {

            optionsButton = createSceneOpenButton(getWindowWidth() - 10, 10, 'OptionsMenuScene', true, 0, 0.56, this, 'MenuAtlas', 'UI Buttons/Asetukset');
        }

        rescaleSceneEvent(this);

        rescaleObjects(optionsButton, this, 0.00025, 0.00025);

        optionsButton.setPosition(getWindowWidth() - optionsButton.displayWidth * optionsButton.scaleX, optionsButton.displayHeight * optionsButton.scaleY);

        this.scale.on('resize', () => {
            /*if (this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) {

                optionsButton.setX(getWindowWidth() * 0.9);
                optionsButton.setY(getWindowHeight() * 0.07);
            }
            else
            {
                optionsButton.setX(getWindowWidth() * 0.95);
                optionsButton.setY(getWindowHeight() * 0.05);
            }*/
            
            //rescaleObjects(optionsButton, this, 0.00025, 0.00025);

            optionsButton.setPosition(getWindowWidth() - optionsButton.displayWidth * optionsButton.scaleX, optionsButton.displayHeight * optionsButton.scaleY);

        }, this);
    }

    update() {

        //Hides html elements when options are open so they won't be displayed on top of the options
        if (optionsButton.open && domsVisible) {
            domElements.forEach(element => {
                element.setVisible(false);

                if (element.input) {
                    element.disableInteractive();
                }

            });

            domsVisible = false
        }
        else if (optionsButton.open === false && domsVisible === false) {
            domElements.forEach(element => {
                element.setVisible(true);
                if (element.input) {
                    element.setInteractive();
                }
            });

            domsVisible = true;
        }
    }
}

//List of all dom elements which can be hidden when options are open
var domElements = [];

//Whether if dom elements have been hidden
var domsVisible = true;

function CreateButton(context, x, y, buttonspriteframe) {
    let button = context.add.sprite(x, y, 'MenuAtlas', buttonspriteframe);

    button.setInteractive();

    button.on('pointerdown', function () {
        button.setTint(0xd5d1c7);
        button.pressed = true;
    }, context);

    button.on('pointerout', function () {
        if (this.input.activePointer.isDown) {
            button.clearTint();
            button.pressed = false;
        }
    }, context);


    button.on('pointerup', function (event) {
        if (button.pressed) {
            button.clearTint();
            if (config.soundOn) {
                context.sound.play('Click', { volume: 0.5 });
            }
        }
    }, context);

    return button;
}

function CreateTextButton(context, x, y, buttonspriteframe, text) {

    let button = context.add.sprite(0, 0, 'MenuAtlas', buttonspriteframe);

    let buttontext = context.make.text({
        x: -button.width * 0.15,
        y: -20,
        text: text,
        origin: { x: 0.5, y: 0.5 },
        style: {
            font: '44px Carme',
            fill: 'black',
            wordWrap: { width: button.width * button.scale },
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
    else if (buttonspriteframe == 'UI Buttons/Puhekupla_Intro') {
        buttontext.setPosition(((button.width / 2) - (buttontext.width / 2)), (button.height / 2) - (buttontext.height / 2));

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
            if (config.soundOn) {
                context.sound.play('Click', { volume: 0.5 });
            }
        }
    }, context);

    return container;
}

function createSceneOpenButton(posX, posY, scene, runOnTop, scrollFactor, scale, context, sprite, frame) {
    // Button
    //let buttonBG = context.add.image(0, 0, 'buttonBG');
    //let buttonText = context.add.image(0, 0, 'buttonText');

    //let button = context.add.container(posX, posY, [buttonBG, buttonText]);

    let button = context.add.sprite(posX, posY, sprite, frame);
    //button.setSize(buttonBG.width, buttonBG.height);
    button.setInteractive();

    button.setScrollFactor(scrollFactor).setDepth(9999).setScale(scale);

    button.pressed = false;

    button.on('pointerover', function () {

        //buttonBG.setTint(0x44ff44);

        //This is just to stop the player from moving when clicking options menu
        pointerOverUI = true;

    });

    button.on('pointerout', function () {

        //buttonBG.clearTint();
        button.pressed = false;

        //Enable clicking movement when cursor goes away from the UI-button
        pointerOverUI = false;

    });

    button.on('pointerdown', function () {

        if (button.enabled) {
            button.pressed = true;
        }


    });

    button.on('pointerup', function (event) {


        if (button.pressed) {

            if (config.soundOn) {
                context.sound.play('Click', { volume: 0.5 });
            }
            readyToMove = false;

            //Only affects timer events, have to be setup separately for physics
            //this.time.paused = true;

            if (button.open != true) {
                if (runOnTop == true) {
                    context.scene.run(scene);
                    button.open = true;
                }
                else {
                    context.scene.start(scene);
                    button.open = true;
                }
            }
            else {
                //Lets you close the scene if you press the button
                saveGame({ musicOn: config.musicOn, soundOn: config.soundOn });

                context.scene.stop(scene);
                button.open = false;
                readyToMove = true;

            }

        }
    }, context);

    button.enabled = true;

    return button;

}
