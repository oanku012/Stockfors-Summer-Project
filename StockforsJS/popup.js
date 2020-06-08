function createPopup (posX, posY) 
{
    var bg = this.add.image(0, 0, 'buttonBG');

    var popup = this.add.container(posX, posY, [ bg ]);

    popup.setSize(bg.width, bg.height);


}

function showPopup(popup) 
{
    popup.setVisible(true);
}

function hidePopup(popup) 
{
    popup.setVisible(false);
}