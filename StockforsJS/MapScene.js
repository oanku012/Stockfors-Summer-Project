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
        this.speed = 5;
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

        this.player = this.matter.add.sprite(startingPointX, startingPointY, 'player').setBounce(0).setFixedRotation().setFriction(20, 0).setIgnoreGravity(true);
        this.player.setDepth(this.player.y);

        this.arrowKeys = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        this.pointer = this.input.activePointer;

        this.input.mouse.disableContextMenu();

        //Makes it so that the pointer world position is updated when camera moves
        this.input.setPollAlways();
        
        this.CreateAnimations();
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

       
    }

    

    BuildingsInitialize()
    {
        
    }

    MovementInitialize(){
    
        //Make player move in direction of mouse click
        /*this.input.on('pointerdown', function ()
        {
    
            
        }, this);*/

        this.matter.world.on('collisionstart', function(event, bodyA, bodyB)
        {
            //Checks if either of the colliding objects contain the openScene function
            if(bodyB.gameObject != null)
            {
                if(typeof bodyB.gameObject.openScene === 'function')
                {
                    bodyB.gameObject.openScene();
                }
            }
            else if(bodyA.gameObject != null)
            {
                if(typeof bodyA.gameObject.openScene === 'function')
                {
                    bodyA.gameObject.openScene();
                }
            }

            
        });
        
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
        else if (this.movingOnPath == true)
        {
            let distanceToDestination;

            //Check the distance between the player and the destination player clicked
            distanceToDestination = this.CheckDistance(this.player, this.destination);


            if (distanceToDestination < 4)
            {
                this.player.setVelocity(0,0);
    
                this.movingOnPath = false;
    
                //This is just to let the player move using keys after moving to a position with the mouse
                //this.destination.x = -1000;
                //this.destination.y = -1000;
            }
    
            
        }


        if(this.pointer.isDown == true)
        {
            this.destination.x = this.pointer.worldX;
            this.destination.y = this.pointer.worldY;

            if(this.CheckDistance(this.player, this.destination)>30)
            {

                this.movementVector.x = this.pointer.worldX-this.player.x;
                this.movementVector.y = this.pointer.worldY-this.player.y;

                this.movementVector.setLength(this.speed);

                this.player.setVelocity(this.movementVector.x, this.movementVector.y);

                this.movingOnPath = true;
            }
        }

        //Apply the correct animations to player based on direction of movement
        if(this.player.body.speed>0)
        {
            const obliqueThreshold = 2/10;
            const straightThreshold = 8/10;

            console.log(this.player.body.velocity);

            if(this.player.body.velocity.x>(this.speed*(straightThreshold)))
            {
            
                console.log('Moving right');
                
                this.player.anims.play('right', true);
            }
            else if(this.player.body.velocity.y>(this.speed)*(obliqueThreshold) && this.player.body.velocity.x>(this.speed*obliqueThreshold))
            {
                console.log('Moving downright');

                this.player.anims.play('downright', true);
            }
            else if(this.player.body.velocity.y>(this.speed*(straightThreshold)))
            {
                console.log('Moving down');

                this.player.anims.play('down', true);
            }
            else if(this.player.body.velocity.y>(this.speed)*(obliqueThreshold) && this.player.body.velocity.x<(-this.speed*obliqueThreshold))
            {
                console.log('Moving downleft');

                this.player.anims.play('downleft', true);
            }
            else if(this.player.body.velocity.x<(-this.speed*(straightThreshold)))
            {
                console.log('Moving left');

                this.player.anims.play('left', true);
            }
            else if(this.player.body.velocity.y<(-this.speed)*(obliqueThreshold) && this.player.body.velocity.x<(-this.speed*obliqueThreshold))
            {
                console.log('Moving upleft');

                this.player.anims.play('upleft', true);
            }
            else if(this.player.body.velocity.y<(-this.speed*(straightThreshold)))
            {
                console.log('Moving up');

                this.player.anims.play('up', true);
            }
            else if(this.player.body.velocity.y<(-this.speed)*(obliqueThreshold) && this.player.body.velocity.x>(this.speed*obliqueThreshold))
            {
                console.log('Moving upright');

                this.player.anims.play('upright', true);
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
            }
            
        }
        else
        {
            camera.setZoom(minZoom);

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

    CreateAnimations()
    {
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'downright',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: [{key: 'player', frame: 4 }],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'downleft',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'upleft',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'upright',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    
    }



}
