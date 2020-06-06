var currentPath;

var destinationX = 0;
var destinationY = 0;

//var pathFollower;

var speed = 400;


function MovementInitialize(){
    
    /*this.input.on('pointerup', function (pointer)
    {
        //cursor.setVisible(true).setPosition(pointer.x, pointer.y);

        this.physics.moveToObject(player, pointer, speed);

        
    }, this);*/


    /*currentPath = new Phaser.Curves.Path(player.worldX, player.worldY).lineTo(destinationX, destinationY);

    //pathFollower = this.add.follower(currentPath, player.worldX, player.worldY, 'player');

    

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
    });*/
}

function MovementUpdate(){
    
    if (arrowKeys.left.isDown || wasdKeys.A.isDown)
    {
        player.setVelocityX(-speed);
    }
    else if (arrowKeys.right.isDown || wasdKeys.D.isDown)
    {
        player.setVelocityX(speed);
    }
    else
    {
        player.setVelocityX(0);
    }

    if (arrowKeys.up.isDown || wasdKeys.W.isDown)
    {
        player.setVelocityY(-speed);
    }
    else if (arrowKeys.down.isDown || wasdKeys.S.isDown)
    {
        player.setVelocityY(speed);
    }
    else
    {
        player.setVelocityY(0);
    }
    
    /*var pointer = this.input.activePointer;

    destinationX = pointer.worldX;
    destinationY = pointer.worldY;*/

    
}