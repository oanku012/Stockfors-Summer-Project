class MapScene extends Phaser.Scene {
    constructor(SceneKey) {

        super(SceneKey);

        this.player;
        this.arrowKeys;
        this.wasdKeys;
        this.pointer;
        this.map;

       
        this.movingOnPath = false;
        this.speed = 5;
        this.movementVector = new Phaser.Math.Vector2();
        this.destination = new Phaser.Math.Vector2();
        this.readyToMove = false;
        this.movementDirection;

        this.buildings = {};

        this.sceneToOpen;

        this.startingPoint = {
            x: 0,
            y: 0
        }

        this.optionsMenuButton;

        this.pointerOverUI = false;

    }

    //This is called when starting scene with this.scene.start
    init(startingPointX, startingPointY) {

        this.startingPoint.x = startingPointX;
        this.startingPoint.y = startingPointY;

    }

    preload() {

    }

    create() {

        console.log(this.scene.key);

        this.sceneToOpen = null;

        this.player = this.matter.add.sprite(this.startingPoint.x, this.startingPoint.y, 'player');
        this.player.setDepth(this.player.y);
        this.player.setRectangle(50, 102).setBounce(0).setFixedRotation().setFriction(1, 0).setIgnoreGravity(true);

        this.map.setInteractive();

        this.arrowKeys = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        this.pointer = this.input.activePointer;

        this.input.mouse.disableContextMenu();

        //Makes it so that the pointer world position is updated when camera moves
        this.input.setPollAlways();

        this.CreateAnimations();
        this.BuildingsInitialize();
        this.InitializeCamera();
        this.MovementInitialize();

        //Movement is allowed with a slight delay so that player clicking the button to return outside won't trigger movement
        this.time.delayedCall(200, function () { this.readyToMove = true; }, null, this)

        // UI stuff
        this.createUI();
        // Reorganize the UI when the game gets resized
        this.scale.on('resize', this.resize, this);

        currentMap = this;
    }

    update() {

        this.MovementUpdate();

        if (this.player.body.speed > 0) {
            this.player.setDepth(this.player.y);
        }


    }



    BuildingsInitialize() {

    }

    MovementInitialize() {

        //Make player move in direction of mouse click
        /*this.input.on('pointerdown', function ()
        {
    
            
        }, this);*/

        //This doesn't seem to work correctly, only gets called when player starts the game?
        //this.player.setOnCollide(this.OnCollisionStop(this.movementVector, this.movingOnPath, this.player));

        this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
            //Checks if either of the colliding objects contain the openScene function
            if (bodyB.gameObject != null) {
                //bodyB.gameObject.setVelocity(0,0);
                if (typeof bodyB.gameObject.openScene === 'function') {
                    bodyB.gameObject.openScene();
                }
            }
            else if (bodyA.gameObject != null) {
                //bodyA.gameObject.setVelocity(0,0);
                if (typeof bodyA.gameObject.openScene === 'function') {
                    bodyA.gameObject.openScene();
                }
            }

        });

        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        this.movementVector.x = 0;
        this.movementVector.y = 0;

        //Set pointeroverUI to false when over the map
        this.map.on('pointerover', function(){
            this.scene.pointerOverUI = false;
        });

    }

    /*OnCollisionStop(movementVector, movingOnPath, player)
    {
        movementVector.x = 0;
        movementVector.y = 0;
        player.setVelocity(0, 0);
        movingOnPath = false;
        console.log('Player collided');
    }*/


    MovementUpdate() {

        if (this.readyToMove == true) {

            //Movement with WASD and arrow keys

            if (this.arrowKeys.left.isDown || this.wasdKeys.A.isDown) {

                this.movementVector.x = -this.speed;

                this.movingOnPath = false;

            }
            else if (this.arrowKeys.right.isDown || this.wasdKeys.D.isDown) {
                
                this.movementVector.x = this.speed;
                
                this.movingOnPath = false;


            }

            else if (this.movingOnPath == false) {

                this.movementVector.x = 0;
            }


            if (this.arrowKeys.up.isDown || this.wasdKeys.W.isDown) {

                this.movementVector.y = -this.speed;

                this.movingOnPath = false;


            }
            else if (this.arrowKeys.down.isDown || this.wasdKeys.S.isDown) {

                this.movementVector.y = this.speed;
                this.movingOnPath = false;

            }
            else if (this.movingOnPath == false) {

                this.movementVector.y = 0;
            }
            else if (this.movingOnPath == true) {
                let distanceToDestination;

                //Check the distance between the player and the destination player clicked
                distanceToDestination = this.CheckDistance(this.player, this.destination);


                if (distanceToDestination < 4) {

                    this.movementVector.x = 0;
                    this.movementVector.y = 0;

                    this.movingOnPath = false;
                }


            }

            
            //console.log(this.pointerOverUI);

            

            if (this.pointer.isDown == true && this.pointerOverUI == false) {

                this.destination.x = this.pointer.worldX;
                this.destination.y = this.pointer.worldY;

                if (this.CheckDistance(this.player, this.destination) > 20) {

                    this.movementVector.x = this.pointer.worldX - this.player.x;
                    this.movementVector.y = this.pointer.worldY - this.player.y;

                    this.movingOnPath = true;
                }
            }

            //Final player movement is applied here, updated when current movement vector is different from current velocity
            if(this.movementVector != this.player.body.velocity)
            {
                this.movementVector.setLength(this.speed);
                this.player.setVelocity(this.movementVector.x, this.movementVector.y);
            }
            
            //Apply the correct animations to player based on direction of movement
            if (this.player.body.speed > 0) {
                const obliqueThreshold = 2 / 10;
                const straightThreshold = 8 / 10;

                //console.log(this.player.body.velocity);

                if (this.player.body.velocity.x > (this.speed * (straightThreshold))) {

                    //console.log('Moving right');

                    this.player.flipX = false;

                    this.movementDirection = 'right'; 

                }
                else if (this.player.body.velocity.y > (this.speed) * (obliqueThreshold) && this.player.body.velocity.x > (this.speed * obliqueThreshold)) {
                    //console.log('Moving downright');

                    this.player.flipX = false;

                    this.movementDirection = 'downright';

                }
                else if (this.player.body.velocity.y > (this.speed * (straightThreshold))) {
                    //console.log('Moving down');

                    this.player.flipX = false;

                    this.movementDirection = 'down';
                }
                else if (this.player.body.velocity.y > (this.speed) * (obliqueThreshold) && this.player.body.velocity.x < (-this.speed * obliqueThreshold)) {
                    //console.log('Moving downleft');

                    this.player.flipX = true;

                    this.movementDirection = 'downleft';
                }
                else if (this.player.body.velocity.x < (-this.speed * (straightThreshold))) {
                    //console.log('Moving left');
                    this.player.flipX = true;

                    this.movementDirection = 'left';
                }
                else if (this.player.body.velocity.y < (-this.speed) * (obliqueThreshold) && this.player.body.velocity.x < (-this.speed * obliqueThreshold)) {
                    //console.log('Moving upleft');
                    this.player.flipX = false;

                    this.movementDirection = 'upleft';
                }
                else if (this.player.body.velocity.y < (-this.speed * (straightThreshold))) {
                    //console.log('Moving up');
                    this.player.flipX = false;

                    this.movementDirection = 'up';
                }
                else if (this.player.body.velocity.y < (-this.speed) * (obliqueThreshold) && this.player.body.velocity.x > (this.speed * obliqueThreshold)) {
                    //console.log('Moving upright');
                    this.player.flipX = true;

                    this.movementDirection = 'upright';
                }

                this.player.anims.play(this.movementDirection, true);

            }
            else
            {
                this.player.anims.play(this.movementDirection + 'still', true);

            }

        }
        else if(this.player.body.speed > 0)
        {
            this.stopPlayerMovement();
        }


    }

    //Check distance between two objects
    CheckDistance(sourceObject, destinationObject) {
        let distance = Phaser.Math.Distance.Between(sourceObject.x, sourceObject.y, destinationObject.x, destinationObject.y);

        return distance;
    }

    InitializeCamera() {
        let camera = this.cameras.main;

        let maxZoom = 3;
        let minZoom = 1;

        camera.startFollow(this.player, true, 0.08, 0.08);

        this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {

            //Zooms camera in and out when using scroll wheel, zoom is stopped at min and max values
            if ((camera.zoom - deltaY * 0.05) > minZoom) {
                if ((camera.zoom - deltaY * 0.05) < maxZoom) {
                    camera.setZoom(camera.zoom - deltaY * 0.05);
                }

            }
            else {
                camera.setZoom(minZoom);

            }




        });
    }

    stopPlayerMovement()
    {
        this.player.setVelocity(0, 0);

        this.movementVector.x = 0;
        this.movementVector.y = 0;

        this.destination.x = 0;
        this.destination.y = 0;
    }

    createButton (posX, posY, scene)
    {
        // Button
        let buttonBG = this.add.image(0, 0, 'buttonBG');
        let buttonText = this.add.image(0, 0, 'buttonText');

        let button = this.add.container(posX, posY, [buttonBG, buttonText]);
        button.setSize(buttonBG.width, buttonBG.height);
        button.setInteractive();

        button.setScrollFactor(0);
        
        var pressed = false;

        button.on('pointerover', function () {
    
            buttonBG.setTint(0x44ff44);

            //This is just to stop the player from moving when opening options menu
            this.scene.pointerOverUI = true;

            //console.log(this.scene.pointerOverUI);
    
        });
    
        button.on('pointerout', function () {
    
            buttonBG.clearTint();
            pressed = false;

            

            //this.scene.pointerOverUI = false;

            //console.log(this.scene.pointerOverUI);

    
        });

        button.on('pointerdown', function () {
            
            pressed = true;

            
    
        });
    
        button.on('pointerup', function (event) {
            

            if (pressed)
            {
                this.readyToMove = false;
                
                //this.stopPlayerMovement();

                this.scene.run(scene);
                
            }
          }, this);

          

          return button;
          
    }

    createUI()
    {
        this.optionsMenuButton = this.createButton(this.cameras.main.centerX + this.cameras.main.width * .4, this.cameras.main.centerY - this.cameras.main.height * .4, 'OptionsMenuScene');
    }

    destroyUI()
    {
        this.optionsMenuButton.destroy();
    }

    resize()
    {
        this.destroyUI();
        this.createUI();
    }

    CreateAnimations() {

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'rightstill',
            frames: [{ key: 'player', frame: 8}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'downright',
            frames: this.anims.generateFrameNumbers('player', { start: 16, end: 23 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'downrightstill',
            frames: [{ key: 'player', frame: 16}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'downstill',
            frames: [{ key: 'player', frame: 0}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'downleft',
            frames: this.anims.generateFrameNumbers('player', { start: 16, end: 23 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'downleftstill',
            frames: [{ key: 'player', frame: 16}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'leftstill',
            frames: [{ key: 'player', frame: 8}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'upleft',
            frames: this.anims.generateFrameNumbers('player', { start: 24, end: 31 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'upleftstill',
            frames: [{ key: 'player', frame: 24}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 32, end: 38 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'upstill',
            frames: [{ key: 'player', frame: 32}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'upright',
            frames: this.anims.generateFrameNumbers('player', { start: 24, end: 31 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'uprightstill',
            frames: [{ key: 'player', frame: 24}],
            frameRate: 10,
            repeat: -1
        });

    }



}
