var currentPath;

var destination = new Phaser.Math.Vector2();

var movingOnPath = false;

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

    //Stop player from moving when hitting the edges of the map
    player.body.onWorldBounds = true;
    this.physics.world.on('worldbounds', onWorldBounds);
    
}

//Called when a physics object hits the edges of the map
function onWorldBounds(body)
{

    //Stops object from moving
    body.speed = 0;

    movingOnPath = false;

    
}

function MovementUpdate(){
    
    //Movement with WASD and arrow keys
    if (arrowKeys.left.isDown || wasdKeys.A.isDown)
    {
        player.setVelocityX(-speed);
        movingOnPath = false;
    }
    else if (arrowKeys.right.isDown || wasdKeys.D.isDown)
    {
        player.setVelocityX(speed);
        movingOnPath = false;

    }
    else if(movingOnPath == false)
    {
        player.setVelocityX(0);

    }

    if (arrowKeys.up.isDown || wasdKeys.W.isDown)
    {
        player.setVelocityY(-speed);
        movingOnPath = false;

    }
    else if (arrowKeys.down.isDown || wasdKeys.S.isDown)
    {
        player.setVelocityY(speed);
        movingOnPath = false;

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

            movingOnPath = false;

            //This is just to let the player move using keys after moving to a position with the mouse
            destination.x = -1000;
            destination.y = -1000;
        }

        
    }

    
}