class MapScene extends Phaser.Scene {
    constructor(SceneKey) {

        super(SceneKey);

        this.player;
        this.arrowKeys;
        this.wasdKeys;
        this.pointer;

        this.movingOnPath = false;
        this.speed = 5;
        this.movementVector = new Phaser.Math.Vector2();
        this.destination = new Phaser.Math.Vector2();
        this.movementDirection = 'down';

        this.playerOverLapping;
        this.currentOverlapBody;
        this.overLapTimer;
        this.enteringBuilding;

        this.map;
        this.buildings = {};
        this.buildingButton;
        this.buildingEntrances = [];

        //this.collisionCat1;
        //this.collisionCat2;

        this.sceneToOpen;

        this.startingPoint = {
            x: 0,
            y: 0
        }

        this.optionsMenuButton;

        this.saveGameTimerEvent;

        this.frameRate = 10;

        this.readyToEnter = true;

    }

    //This is called when starting scene with this.scene.start
    init(startPoint) {

        //console.log(startingPointX + ' ' + startingPointY);
        this.startingPoint.x = startPoint.x;
        this.startingPoint.y = startPoint.y;
        if (startPoint.readyToEnter === false || startPoint.readyToEnter === true) {
            this.readyToEnter = startPoint.readyToEnter;
        }
        else {
            this.readyToEnter = gameState.readyToEnter;
        }
    }

    preload() {

    }

    create() {

        this.cameras.main.backgroundColor.setTo(255, 255, 255);

        console.log(this.scene.key);

        this.sceneToOpen = null;

        this.playerOverLapping = false;
        this.currentOverlapBody = null;
        this.enteringBuilding = false;

        //Collision layers
        if (collisionCat1 == null && collisionCat2 == null) {

            collisionCat1 = 1;
            collisionCat2 = this.matter.world.nextCategory();
        }

        //this.matter.world.setBounds(0, 0, 5000, 2000, 64, true, true, true, true);

        //Used this to change the collision category on the walls of the map, but wasn't actually necessary since I could just change collisioncat1 to the default category that the walls use
        /*
        Object.values(this.matter.world.walls).forEach(wall => {
            wall.collisionFilter.category = collisionCat1;

        });*/

        if (this.map != null) {
            this.map.setInteractive();
        }

        this.CreateSounds();
        this.InputInitialize();
        this.PlayerInitialize();
        this.CreateAnimations();
        this.BuildingsInitialize();
        this.InitializeCamera();
        this.MovementInitialize();

        //Movement is allowed with a slight delay so that player clicking the button to return outside won't trigger movement
        this.time.delayedCall(200, function () {
            if (!optionsButton.open && introPlaying === false) {
                readyToMove = true;
            }
        }, null, this)

        /*
        // UI stuff
        this.createUI();
        // Reorganize the UI when the game gets resized
        this.scale.on('resize', this.resize, this);*/

        //Autosave every 10 seconds
        this.saveGameTimerEvent = this.time.addEvent({ delay: 10000, callback: this.SavePosition, callbackScope: this, loop: true });

        //Changed this to not run on every frame, because when you're overlapping 2 buildings it would get called constantly
        this.overLapTimer = this.time.addEvent({ delay: 200, callback: this.CheckForOverlap, callbackScope: this, loop: true });

        //gameState.currentMap = this;

        this.SavePosition();

    }

    //Couldn't just call save game from the timer event directly, because it wouldn't update the position value
    SavePosition() {
        saveGame({ currentMap: this.scene.key, playerX: this.player.x, playerY: this.player.y, readyToEnter: this.readyToEnter });
    }

    update() {

        this.MovementUpdate();

        if (this.player.body.speed > 0) {
            this.player.setDepth(this.player.y);
        }

        if (this.enteringBuilding) {
            this.enteringBuilding = false;

            console.log('THIS IS THE SCENE THAT WILL BE ENTERED ' + this.sceneToOpen);

            //this.time.addEvent({
                //delay: 100, callback: function () {
                    //console.log('ENTERING SCENE ' + this.sceneToOpen);
                    this.EnterBuilding(this.sceneToOpen);
                //}, callbackScope: this
            //});
        }

        //console.log(this.pointer.worldX + ' ' + this.pointer.worldY);

    }

    CreateSounds() {
        this.footSteps = [];

        this.footSteps.push(this.sound.add('Footstep1'));
        this.footSteps.push(this.sound.add('Footstep2'));
        this.footSteps.push(this.sound.add('Footstep3'));
        this.footSteps.push(this.sound.add('Footstep4'));
        this.footSteps.push(this.sound.add('Footstep5'));
        this.footSteps.push(this.sound.add('Footstep6'));
    }

    InputInitialize() {
        this.arrowKeys = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        this.pointer = this.input.activePointer;

        this.input.mouse.disableContextMenu();

        //Makes it so that the pointer world position is updated when camera moves
        this.input.setPollAlways();
    }

    PlayerInitialize() {
        this.player = this.matter.add.sprite(this.startingPoint.x, this.startingPoint.y, 'playerIdle');
        this.player.setDepth(this.player.y).setScale(0.3);
        this.player.setRectangle(30, 30).setBounce(0).setFixedRotation().setFriction(1, 0).setIgnoreGravity(true).setDisplayOrigin(190, 320);
        this.player.setCollisionCategory(collisionCat1);
        this.player.setCollidesWith([collisionCat1]);
        this.player.anims.play(this.movementDirection + 'still', true);

        this.stopPlayerMovement();

        console.log('Player spawned at ' + this.player.x, this.player.y);
    }

    BuildingsInitialize() {

        //Sets collision category and pointerinteraction for all buildings
        Object.values(this.buildings).forEach(element => {
            element.setCollisionCategory(collisionCat1);
            element.setInteractive();
            element.on('pointerup', function (pointer) {
                this.sceneToOpen = element.entrance.sceneKey;

                //If the player is standing at the entrance and clicks the building it will enter the building
                if (this.playerOverLapping == true && this.sceneToOpen && this.currentOverlapBody == element.entrance) {
                    //this.EnterBuilding();

                    this.enteringBuilding = true;
                }

            }, this);
        });

    }

    EnterBuilding(buildingToEnter) {
        this.readyToEnter = false;
        
        this.SavePosition();
    
        // load scene loader with scene to open as parameter
        this.scene.start('SceneLoader', { sceneToLoad: buildingToEnter });

        this.sceneToOpen = null;
    }

    MovementInitialize() {

        this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {

            this.stopPlayerMovement();

            //Changed scene opening to trigger from overlap instead
            /*//Checks if either of the colliding objects contain the openScene function
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
            }*/

        }, this);

        let lastindex;

        //Plays footstep sounds
        this.footStepTimer = this.time.addEvent({
            delay: 400, callback: function () {
                if (config.soundOn) {
                    let index;

                    do {
                        index = (Math.floor(Math.random() * 6));
                    }//Should prevent the same sound from playing multiple times in a row
                    while (index === lastindex);

                    lastindex = index;

                    this.footSteps[index].play();
                    //this.sound.play('Footstep' + index);
                }

            }, callbackScope: this, loop: true, paused: true, startAt: 200
        });

        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        this.movementVector.x = 0;
        this.movementVector.y = 0;

        //Set pointeroverUI to false when over the map

        if (this.map != null) {
            this.map.on('pointerover', function () {
                pointerOverUI = false;
            });

        }

    }

    CheckForOverlap() {
        //Checks if player overlaps with one of the building entrances, apparently matter doesn't have an event for this so this runs repeatedly
        if (this.matter.overlap(this.player, this.buildingEntrances, function (bodyA, bodyB) {

            if ((this.playerOverLapping === false || this.currentOverlapBody !== bodyB)) {

                console.log('Overlapping with ' + bodyB.sceneKey.replace("Scene", ""));

                if (this.buildingButton != null) {
                    this.buildingButton.destroy();
                }

                this.playerOverLapping = true;
                this.currentOverlapBody = bodyB;

                //If the player clicked the building from afar and arrived at the entrance it will enter the building
                //if (this.sceneToOpen == bodyB.sceneKey) {

                //Added this.readyToEnter so that player won't immediately go back in when exiting a building, should go back to ready when player leaves the entrance zone
                if (this.readyToEnter) {
                    //Changed this so that it just enters the building when you get to the overlap zone


                    console.log('Entering: ' + bodyB.sceneKey);
                    this.sceneToOpen = bodyB.sceneKey;
                    this.enteringBuilding = true;
                    //this.EnterBuilding(bodyB.sceneKey);
                }
                //}


            }

        }, null, this) == false && this.playerOverLapping == true) {
            console.log('Not overlapping');
            this.playerOverLapping = false
            this.currentOverlapBody = null;
            this.readyToEnter = true;

            if (this.buildingButton != null) {
                this.buildingButton.destroy();
            }
        }
    }

    SetKeyMovement() {


        this.movingOnPath = false;

        //this.sceneToOpen = null;
    }

    MovementUpdate() {




        if (readyToMove == true) {

            //Movement with WASD and arrow keys

            if (this.arrowKeys.left.isDown || this.wasdKeys.A.isDown) {

                this.movementVector.x = -this.speed;

                this.SetKeyMovement();

            }
            else if (this.arrowKeys.right.isDown || this.wasdKeys.D.isDown) {

                this.movementVector.x = this.speed;

                this.SetKeyMovement();


            }

            else if (this.movingOnPath == false) {

                this.movementVector.x = 0;
            }


            if (this.arrowKeys.up.isDown || this.wasdKeys.W.isDown) {

                this.movementVector.y = -this.speed;

                this.SetKeyMovement();


            }
            else if (this.arrowKeys.down.isDown || this.wasdKeys.S.isDown) {

                this.movementVector.y = this.speed;

                this.SetKeyMovement();

            }
            else if (this.movingOnPath == false) {

                this.movementVector.y = 0;
            }
            else if (this.movingOnPath == true) {
                let distanceToDestination;

                //Check the distance between the player and the destination player clicked
                distanceToDestination = this.CheckDistance(this.player, this.destination);


                if (distanceToDestination < 4) {

                    //this.movementVector.x = 0;
                    //this.movementVector.y = 0;

                    //this.movingOnPath = false;

                    this.stopPlayerMovement();
                }


            }


            //When pointer is down update destination and movement vector
            if (this.pointer.isDown == true && pointerOverUI == false) {

                this.destination.x = this.pointer.worldX;
                this.destination.y = this.pointer.worldY;

                if (this.CheckDistance(this.player, this.destination) > 20) {

                    this.movementVector.x = this.pointer.worldX - this.player.x;
                    this.movementVector.y = this.pointer.worldY - this.player.y;

                    this.movingOnPath = true;
                }
            }

            //Updates movement vector towards the target destination, fixes the player moving incorrectly after colliding with a building
            if (this.movingOnPath) {
                if (this.CheckDistance(this.player, this.destination) > 20) {

                    this.movementVector.x = this.destination.x - this.player.x;
                    this.movementVector.y = this.destination.y - this.player.y;

                }
            }

            //Final player movement is applied here, updated when current movement vector is different from current velocity
            if (this.movementVector != this.player.body.velocity) {
                this.movementVector.setLength(this.speed);
                this.player.setVelocity(this.movementVector.x, this.movementVector.y);
            }

            //Apply the correct animations to player based on direction of movement
            if (this.player.body.speed > 0) {

                //Plays the footstep audio.
                this.footStepTimer.paused = false;

                const obliqueThreshold = 3 / 10;
                const straightThreshold = 8 / 10;

                let velocX = this.player.body.velocity.x;
                let velocY = this.player.body.velocity.y;

                //console.log(this.player.body.velocity);

                if (velocX > (this.speed * (straightThreshold))) {
                    //console.log('Moving right');
                    this.player.setFlipX(false);

                    this.movementDirection = 'right';

                }

                if (velocY > (this.speed * (straightThreshold))) {
                    //console.log('Moving down');

                    this.player.setFlipX(false);

                    this.movementDirection = 'down';
                }

                if (velocX < (-this.speed * (straightThreshold))) {
                    //console.log('Moving left');
                    this.player.setFlipX(true);

                    this.movementDirection = 'left';
                }

                if (this.player.body.velocity.y < (-this.speed * (straightThreshold))) {
                    //console.log('Moving up');
                    this.player.setFlipX(false);

                    this.movementDirection = 'up';
                }

                if (velocY < (-this.speed) * (obliqueThreshold) && velocX > (this.speed * obliqueThreshold)) {
                    //console.log('Moving upright');
                    this.player.setFlipX(true);
                    this.movementDirection = 'upright';
                }

                if (velocY > (this.speed) * (obliqueThreshold) && velocX > (this.speed * obliqueThreshold)) {
                    //console.log('Moving downright');
                    this.player.setFlipX(false);

                    this.movementDirection = 'downright';

                }

                if (velocY > (this.speed) * (obliqueThreshold) && velocX < (-this.speed * obliqueThreshold)) {
                    //console.log('Moving downleft');
                    this.player.setFlipX(true);

                    this.movementDirection = 'downleft';
                }

                if (velocY < (-this.speed) * (obliqueThreshold) && velocX < (-this.speed * obliqueThreshold)) {
                    //console.log('Moving upleft');
                    this.player.setFlipX(false);

                    this.movementDirection = 'upleft';
                }

                this.player.anims.play(this.movementDirection, true);

            }
            else {
                this.player.anims.play(this.movementDirection + 'still', true);
                this.footStepTimer.paused = true;

            }

        }
        else if (this.player.body.speed > 0) {
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

        let maxZoom = 2;
        let minZoom = 0.5;

        camera.setZoom(2);

        camera.startFollow(this.player, true, 0.08, 0.08);

        this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {

            if (readyToMove) {
                //Zooms camera in and out when using scroll wheel, zoom is stopped at min and max values
                if ((camera.zoom - deltaY * 0.05) > minZoom) {
                    if ((camera.zoom - deltaY * 0.05) < maxZoom) {
                        camera.setZoom(camera.zoom - deltaY * 0.05);
                    }

                }
                else {
                    camera.setZoom(minZoom);

                }

            }




        });
    }

    stopPlayerMovement() {
        this.player.setVelocity(0, 0);

        this.movementVector.x = 0;
        this.movementVector.y = 0;

        this.destination.x = 0;
        this.destination.y = 0;

        this.movingOnPath = false;
    }

    createUI() {
        //this.optionsMenuButton = createButton(this.cameras.main.centerX + this.cameras.main.width * .4, this.cameras.main.centerY - this.cameras.main.height * .4, 'OptionsMenuScene', true, 0, 0.56, this, 'MenuAtlas', 'UI Buttons/Asetukset');
    }

    destroyUI() {
        this.optionsMenuButton.destroy();
    }

    /*resize() {
        if (this.scene.isActive(this.scene.key)) {
            this.optionsMenuButton.setX(this.cameras.main.centerX + this.cameras.main.width * .4);
            this.optionsMenuButton.setY(this.cameras.main.centerY - this.cameras.main.height * .4);
        }

    }*/

    CreateAnimations() {

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 8, end: 15 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'rightstill',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 8, end: 15 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'downright',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 16, end: 23 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'downrightstill',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 16, end: 23 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 0, end: 7 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'downstill',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 7 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'downleft',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 16, end: 23 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'downleftstill',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 16, end: 23 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 8, end: 15 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'leftstill',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 8, end: 15 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'upleft',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 24, end: 31 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'upleftstill',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 24, end: 31 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 32, end: 38 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'upstill',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 32, end: 38 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'upright',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 24, end: 31 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'uprightstill',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 24, end: 31 }),
            frameRate: this.frameRate,
            repeat: -1
        });

    }

    CreateSpeechBubble(text, scale) {

        let playerTopRight = this.player.getTopRight();



        let bubble = CreateTextButton(this, 0, 0, 'UI Buttons/Puhekupla_Intro', text);

        let newScale;

        if (text.length <= 50) {
            newScale = 0.4;
            console.log('Small bubble');


        }
        else if (text.length > 50 && text.length <= 75) {
            console.log('Medium bubble');
            newScale = 0.5;
            //bubble.x += 10;
        }
        else if (text.length > 75) {
            newScale = 0.6;
            console.log('Big bubble');
            //bubble.x += 20;

        }

        bubble.x = (playerTopRight.x + 100 * newScale) - 20;
        bubble.y = (playerTopRight.y - 100 * newScale) + 20;

        bubble.removeInteractive().setScale(scale);

        bubble.bg.setScale(newScale).setFlipX(true);

        bubble.topRight = bubble.bg.getTopRight();

        bubble.close = CreateButton(this, bubble.topRight.x - 10, bubble.topRight.y + 10, 'UI Buttons/Zoom_Out');

        bubble.add(bubble.close);

        //bubble.bg.setDisplaySize(bubble.text.width + 50, bubble.text.height + 120);
        //

        //bubble.text.setWordWrapWidth(bubble.bg.width * bubble.bg.scale);

        //Made a new text here, because adjusting the word wrap in post seemed really buggy for some reason
        bubble.text.destroy();

        bubble.text = this.make.text({
            x: -bubble.bg.width * 0.15,
            y: 0,
            text: text,
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: '44px Carme',
                fill: 'black',
                wordWrap: { width: bubble.bg.width * bubble.bg.scale - 50 },
                align: 'center'
            }
        });

        bubble.text.setDisplayOrigin((bubble.bg.width * bubble.bg.scale) / 2, (bubble.bg.height * bubble.bg.scale) / 1.54);

        bubble.text.setPosition((((bubble.bg.width * bubble.bg.scale) / 2) - (bubble.text.width / 2)), ((bubble.bg.height * bubble.bg.scale) / 2) - (bubble.text.height / 2));

        bubble.add(bubble.text);

        bubble.close.on('pointerup', function () {

            if (bubble.close.pressed) {
                bubble.destroy();
                bubble.close.destroy();
            }
        }, this);

        bubble.setDepth(9999);

        return bubble;
    }

}
