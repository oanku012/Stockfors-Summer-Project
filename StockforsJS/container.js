function createContainer (posX, posY) 
{
    // Button
    var buttonBG = this.add.image(0, 0, 'buttonBG');
    var buttonText = this.add.image(0, 0, 'buttonText');

    var button = this.add.container(posX, posY, [ buttonBG, buttonText ]);
    button.setSize(buttonBG.width, buttonBG.height);
    button.setInteractive();

    // Popup menu
    var screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    var screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    var popupBG = this.add.image(0, 0, 'menuBG');
    var popup = this.add.container(screenCenterX * .5, screenCenterY * .5, [ popupBG ]);
    popup.setVisible(false);

    // Exit button
    var exitButtonBG = this.add.image(0,0, 'exitButton');
    var exitButton = this.add.container(screenCenterX - popupBG.width, screenCenterY - popupBG.height, [ exitButtonBG ]);
    exitButton.setVisible(false);

    button.on('pointerover', function () {

        buttonBG.setTint(0x44ff44);

    });

    button.on('pointerout', function () {

        buttonBG.clearTint();

    });

    button.on('pointerdown', function () {

        if (popup.visible == true)
        {
            popup.setVisible(false);
            exitButton.setVisible(false);
        }
        else 
        {
            popup.setVisible(true);
            exitButton.setVisible(true);
        }
        
    });

    
}