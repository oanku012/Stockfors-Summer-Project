function createButton (posX, posY) 
{
    var bg = this.add.image(0, 0, 'buttonBG');
    var text = this.add.image(0, 0, 'buttonText');

    
    var button = this.add.container(posX, posY, [ bg, text ]);


    button.setSize(bg.width, bg.height);

    button.setInteractive();


    button.on('pointerover', function () {

        bg.setTint(0x44ff44);

    });

    button.on('pointerout', function () {

        bg.clearTint();

    });

    button.on('pointerdown', function () {

        createPopup(300, 300);
        
    });
    
}