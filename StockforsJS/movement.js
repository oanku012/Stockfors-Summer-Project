var currentPath;

var destination = new Phaser.Math.Vector2();

var movingOnPath;

//var pathFollower;

var speed = 400;

var debug;

var circle;

function MovementInitialize(){
    
    this.input.on('pointerup', function (pointer)
    {
        //cursor.setVisible(true).setPosition(pointer.x, pointer.y);
        destination.x = pointer.worldX;
        destination.y = pointer.worldY;

        /*debug = this.add.graphics();

        debug.clear().lineStyle(1, 0x00ff00);
        debug.lineBetween(0, destination.y, 800, destination.y);
        debug.lineBetween(destination.x, 0, destination.x, 600);*/

        this.physics.moveToObject(player, destination, speed);

        movingOnPath = true;

        
    }, this);


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
    
    //Movement with WASD and arrow keys
    if (arrowKeys.left.isDown || wasdKeys.A.isDown)
    {
        player.setVelocityX(-speed);
    }
    else if (arrowKeys.right.isDown || wasdKeys.D.isDown)
    {
        player.setVelocityX(speed);
    }
    else if(movingOnPath == false)
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
    else if(movingOnPath == false)
    {
        player.setVelocityY(0);
    }
    
    //Check the distance between the player and the destination
    var distance = Phaser.Math.Distance.Between(player.x, player.y, destination.x, destination.y);

    if (player.body.speed > 0)
    {
        //distanceText.setText('Distance: ' + distance);

        //  4 is our distance tolerance, i.e. how close the source can get to the target
        //  before it is considered as being there. The faster it moves, the more tolerance is required.
        if (distance < 4)
        {
            player.body.reset(destination.x, destination.y);
        }
    }

    
}