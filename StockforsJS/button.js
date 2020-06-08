function createButton (posX, posY) 
{
    var bg = this.add.image(0, 0, 'buttonBG');
    var text = this.add.image(0, 0, 'buttonText');

    
    var button = this.add.container(posX, posY, [ bg, text ]);


    button.setSize(bg.width, bg.height);

    button.setInteractive();

    var popupBG = this.add.image(0, 0, 'menuBG');
    var popup = this.add.container(800, 600, [ popupBG ]);
    popup.setVisible(false);


    button.on('pointerover', function () {

        bg.setTint(0x44ff44);

    });

    button.on('pointerout', function () {

        bg.clearTint();

    });

    button.on('pointerdown', function () {

        if (popup.visible == true)
        {
            popup.setVisible(false);
        }
        else 
        {
            popup.setVisible(true);
        }
        
    });

    
}