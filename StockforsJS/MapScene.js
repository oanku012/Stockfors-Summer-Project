class MapScene extends Phaser.Scene 
{
    constructor(SceneKey)
    {

        super(SceneKey);

        //From create.js
        this.player;
        this.arrowKeys;
        this.wasdKeys;
        this.pointer;

        //From movement.js
        this.currentPath;
        this.destination = new Phaser.Math.Vector2();
        this.movingOnPath = false;
        this.speed = 400;

        this.buildings;
        
    }

    preload ()
    {
        
    }

    create (startingPointX, startingPointY)
    {
        console.log(this.scene.key);

        this.player = this.physics.add.sprite(startingPointX, startingPointY, 'player');

        this.arrowKeys = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        this.pointer = this.input.activePointer;

        this.input.mouse.disableContextMenu();
        
        this.player.body.setCollideWorldBounds(true);

        
        this.BuildingsInitialize();
        this.InitializeCamera();

        //Movement is initialized with a slight delay so that player clicking the button to return outside won't trigger movement
        this.time.delayedCall(100, this.MovementInitialize, null, this)
        

        
        
    }

    update ()
    {
        
        this.MovementUpdate();
      
        this.player.setDepth(this.player.y);
    }

    /*//Used to find the right buildings from the physics group
    findBuilding(thisName)
    {
        return thisName === thisName;
    }*/

    //When player collides with a building, stop player and load scene associated with the building
    playerHitBuilding(player, building)
    {
        player.body.stop();

        this.scene.start(building.scene);
    }

    BuildingsInitialize()
    {
        this.buildings = this.physics.add.staticGroup();

        this.physics.add.collider(this.player, this.buildings, this.playerHitBuilding, null, this);
    }

    MovementInitialize(){
    
        this.input.on('pointerup', function ()
        {
            this.destination.x = this.pointer.worldX;
            this.destination.y = this.pointer.worldY;
    
            this.physics.moveToObject(this.player, this.destination, this.speed);
    
            this.movingOnPath = true;
    
            
        }, this);
    
        //Stop player from moving when hitting the edges of the map
        this.player.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', function(body){
            //Stops object from moving
            body.stop();
    
            this.movingOnPath = false;
        },this);
        
    }
    
    
    MovementUpdate(){
        
        

        //Movement with WASD and arrow keys
        if (this.arrowKeys.left.isDown || this.wasdKeys.A.isDown)
        {
            this.player.setVelocityX(-this.speed);
            this.movingOnPath = false;
        }
        else if (this.arrowKeys.right.isDown || this.wasdKeys.D.isDown)
        {
            this.player.setVelocityX(this.speed);
            this.movingOnPath = false;
    
        }
        else if(this.movingOnPath == false)
        {
            this.player.setVelocityX(0);
    
        }
    
        if (this.arrowKeys.up.isDown || this.wasdKeys.W.isDown)
        {
            this.player.setVelocityY(-this.speed);
            this.movingOnPath = false;
    
        }
        else if (this.arrowKeys.down.isDown || this.wasdKeys.S.isDown)
        {
            this.player.setVelocityY(this.speed);
            this.movingOnPath = false;
    
        }
        else if(this.movingOnPath == false)
        {
            this.player.setVelocityY(0);
        }
        
        let distanceToDestination;

        if (this.player.body.speed > 0)
        {
        //Check the distance between the player and the destination player clicked
        distanceToDestination = this.CheckDistance(this.player, this.destination);
    
            if (distanceToDestination < 4)
            {
                this.player.body.reset(this.destination.x, this.destination.y);
    
                this.movingOnPath = false;
    
                //This is just to let the player move using keys after moving to a position with the mouse
                this.destination.x = -1000;
                this.destination.y = -1000;
            }
    
            
        }


    }

    //Check distance between two objects
    CheckDistance(sourceObject, destinationObject)
    {
        let distance = Phaser.Math.Distance.Between(sourceObject.x, sourceObject.y, destinationObject.x, destinationObject.y);

        return distance;
    }

    InitializeCamera()
    {
    let camera = this.cameras.main;

    let maxZoom = 3;
    let minZoom = 1;

    camera.startFollow(this.player, true, 0.08, 0.08);

    this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ){
        
        //Zooms camera in and out when using scroll wheel, zoom is stopped at min and max values
        if((camera.zoom - deltaY*0.05) > minZoom)
        {
            if((camera.zoom - deltaY*0.05) < maxZoom)
            {
                camera.setZoom(camera.zoom - deltaY*0.05); 
                //this.debugText.setScale(1 /camera.zoom, 1/camera.zoom);
            }
            
        }
        else
        {
            camera.setZoom(minZoom);
            //this.debugText.setScale(1 /camera.zoom, 1/camera.zoom);

        }        

        

        
    });
    }

    createButton (posX, posY) 
    {
        // Button
        let buttonBG = this.add.image(0, 0, 'buttonBG');
        let buttonText = this.add.image(0, 0, 'buttonText');
    
        let button = this.add.container(posX, posY, [ buttonBG, buttonText ]);
        button.setSize(buttonBG.width, buttonBG.height);
        button.setInteractive();
        
        button.on('pointerover', function () {
    
            buttonBG.setTint(0x44ff44);
    
        });
    
        button.on('pointerout', function () {
    
            buttonBG.clearTint();
    
        });
    
        button.on('pointerdown', function (event) {
            // ...
            this.scene.start('MenuScene');
          }, this);
    
        
    }



}
