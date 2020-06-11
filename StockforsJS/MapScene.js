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
        this.movingOnPath = false;
        this.speed = 10;
        this.movementVector = new Phaser.Math.Vector2();
        this.destination = new Phaser.Math.Vector2();

        this.buildings = {};

        this.sceneToOpen;
        
    }

    preload ()
    {
        
    }

    create (startingPointX, startingPointY)
    {
        console.log(this.scene.key);

        this.sceneToOpen = null;

        this.matter.world.setBounds();

        this.player = this.matter.add.sprite(startingPointX, startingPointY, 'player');
        this.player.setDepth(this.player.y);
        this.player.setFixedRotation();

        //First value is friction against walls, second value is air resistance
        this.player.setFriction(0.5, 0);

        this.arrowKeys = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        this.pointer = this.input.activePointer;

        this.input.mouse.disableContextMenu();
        
        this.BuildingsInitialize();
        this.InitializeCamera();

        //Movement is initialized with a slight delay so that player clicking the button to return outside won't trigger movement
        this.time.delayedCall(100, this.MovementInitialize, null, this)
        

        
        
    }

    update ()
    {
        
        this.MovementUpdate();
      
        if(this.player.body.speed > 0)
        {
            this.player.setDepth(this.player.y);
        }

        if(typeof this.sceneToOpen === 'string')
        {
            this.scene.start(this.sceneToOpen);
        }

        //console.log(this.player.x + this.player.y);
    }

    

    BuildingsInitialize()
    {
        //this.buildings = this.physics.add.staticGroup();

        //this.physics.add.collider(this.player, this.buildings, this.playerHitBuilding, null, this);

        //this.buildings = [PatruunanTalo, PakkausMuseo, Kirkkotie];
    }

    MovementInitialize(){
    
        //Make player move in direction of mouse click, MAYBE MAKE THIS SO IF POINTER IS HELD DOWN IT WILL CONTINUOUSLY MOVE TOWARDS THE CURSOR????
        this.input.on('pointerdown', function ()
        {
            this.destination.x = this.pointer.worldX;
            this.destination.y = this.pointer.worldY;
    
            this.movementVector.x = this.pointer.worldX-this.player.x;
            this.movementVector.y = this.pointer.worldY-this.player.y;

            this.movementVector.setLength(this.speed);

            this.player.setVelocity(this.movementVector.x, this.movementVector.y);

            

            this.movingOnPath = true;
    
            
        }, this);

        /*this.matter.world.on('collisionstart', function(event, bodyA, bodyB)
        {
            bodyB.startScene = true;
            
        });*/
        
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
                this.player.setVelocity(0,0);
    
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
