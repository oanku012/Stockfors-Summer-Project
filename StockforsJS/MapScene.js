class MapScene extends Phaser.Scene {
    constructor(SceneKey) {

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
        this.readyToMove;

        this.buildings = {};

        this.sceneToOpen;

        this.startingPoint = {
            x: 0,
            y: 0
        }

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

        this.readyToMove = false;

        this.sceneToOpen = null;

        this.matter.world.setBounds();

        this.player = this.matter.add.sprite(this.startingPoint.x, this.startingPoint.y, 'player').setBounce(0).setFixedRotation().setFriction(20, 0).setIgnoreGravity(true);
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
        this.MovementInitialize();

        //Movement is initialized with a slight delay so that player clicking the button to return outside won't trigger movement
        this.time.delayedCall(200, function () { this.readyToMove = true; }, null, this)




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

            


            if (this.pointer.isDown == true) {
                this.destination.x = this.pointer.worldX;
                this.destination.y = this.pointer.worldY;

                if (this.CheckDistance(this.player, this.destination) > 20) {

                    this.movementVector.x = this.pointer.worldX - this.player.x;
                    this.movementVector.y = this.pointer.worldY - this.player.y;

                    this.movingOnPath = true;
                }
            }

            //Final player movement is applied here, updated when current movement vector is different from current velocity
            if(this.movementVector != this.player.velocity)
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

                    this.player.anims.play('right', true);
                }
                else if (this.player.body.velocity.y > (this.speed) * (obliqueThreshold) && this.player.body.velocity.x > (this.speed * obliqueThreshold)) {
                    //console.log('Moving downright');

                    this.player.anims.play('downright', true);
                }
                else if (this.player.body.velocity.y > (this.speed * (straightThreshold))) {
                    //console.log('Moving down');

                    this.player.anims.play('down', true);
                }
                else if (this.player.body.velocity.y > (this.speed) * (obliqueThreshold) && this.player.body.velocity.x < (-this.speed * obliqueThreshold)) {
                    //console.log('Moving downleft');

                    this.player.anims.play('downleft', true);
                }
                else if (this.player.body.velocity.x < (-this.speed * (straightThreshold))) {
                    //console.log('Moving left');

                    this.player.anims.play('left', true);
                }
                else if (this.player.body.velocity.y < (-this.speed) * (obliqueThreshold) && this.player.body.velocity.x < (-this.speed * obliqueThreshold)) {
                    //console.log('Moving upleft');

                    this.player.anims.play('upleft', true);
                }
                else if (this.player.body.velocity.y < (-this.speed * (straightThreshold))) {
                    //console.log('Moving up');

                    this.player.anims.play('up', true);
                }
                else if (this.player.body.velocity.y < (-this.speed) * (obliqueThreshold) && this.player.body.velocity.x > (this.speed * obliqueThreshold)) {
                    //console.log('Moving upright');

                    this.player.anims.play('upright', true);
                }

            }
            else
            {
                this.player.anims.play('down');
            }

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

    createButton(posX, posY) {
        // Button
        let buttonBG = this.add.image(0, 0, 'buttonBG');
        let buttonText = this.add.image(0, 0, 'buttonText');

        let button = this.add.container(posX, posY, [buttonBG, buttonText]);
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

    CreateAnimations() {

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
            frames: [{ key: 'player', frame: 4 }],
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
