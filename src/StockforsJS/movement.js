var path;

function movementInitialize(){
    
    this.input.mouse.disableContextMenu();

    this.input.on('pointerup', function(pointer){
        if (pointer.leftButtonReleased())
        {
            //text2.setText('Left Button was released');
            path = new Phaser.Curves.Path()

        }
        else if (pointer.rightButtonReleased())
        {
            //text2.setText('Right Button was released');
        }
        else if (pointer.middleButtonReleased())
        {
            //text2.setText('Middle Button was released');
        }
        else if (pointer.backButtonReleased())
        {
            //text2.setText('Back Button was released');
        }
        else if (pointer.forwardButtonReleased())
        {
            //text2.setText('Forward Button was released');
        }
    });
}

function movementUpdate(){

}