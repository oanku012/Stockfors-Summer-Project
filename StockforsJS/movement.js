var path;

var destinationX = 0;
var destinationY = 0;

var follower;

function MovementInitialize(){
    
    

    this.input.mouse.disableContextMenu();

    path = new Phaser.Curves.Path(player.worldX, player.worldY).lineTo(destinationX, destinationY);

    follower = this.add.follower(path, player.worldX, player.worldY, 'player');

    

    this.input.on('pointerup', function(pointer){
        if (pointer.leftButtonReleased())
        {
            //text2.setText('Left Button was released');
            

            
            follower.startFollow({
                positionOnPath: true,
                duration: 3000,
                yoyo: true,
                repeat: -1,
                rotateToPath: true,
                verticalAdjust: true
            });
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

function MovementUpdate(){
    pointer = this.input.activePointer;

    destinationX = pointer.worldX;
    destinationY = pointer.worldY;

    
}