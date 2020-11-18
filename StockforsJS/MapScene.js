class MapScene extends Phaser.Scene {
    constructor(SceneKey) {

        super(SceneKey);

        this.player;
        this.arrowKeys;
        this.wasdKeys;
        this.pointer;

        this.movingOnPath = false;
        //Change to make player move faster, should be set to 2 or 3 in the release version
        this.speed = 2.5;
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

        this.soundPoints = [];

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
            this.readyToEnter = true;
        }
    }

    preload() {

    }

    create() {

        rescaleSceneEvent(this);

        this.cameras.main.backgroundColor.setTo(255, 255, 255);

        console.log(this.scene.key);

        this.sceneToOpen = null;

        //this.matter.set60Hz();

        this.playerOverLapping = false;
        this.currentOverlapBody = null;
        this.enteringBuilding = false;

        //Collision layers
        if (collisionCat1 == null && collisionCat2 == null) {

            collisionCat1 = 1;
            collisionCat2 = this.matter.world.nextCategory();
        }

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
        // Reorganize the UI when the game gets resized
        this.scale.on('resize', this.resize, this);*/

        //Autosave every 10 seconds
        this.saveGameTimerEvent = this.time.addEvent({ delay: 10000, callback: this.SavePosition, callbackScope: this, loop: true });

        //Changed this to not run on every frame, because when you're overlapping 2 buildings it would get called constantly
        this.overLapTimer = this.time.addEvent({ delay: 300, callback: this.CheckForOverlap, callbackScope: this, loop: true });

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

            //console.log('THIS IS THE SCENE THAT WILL BE ENTERED ' + this.sceneToOpen);

            this.EnterBuilding(this.sceneToOpen);
        }

    }

    CreateSounds() {

        let vol = 0.5;

        this.footSteps = [];

        this.footSteps.push(this.sound.add('Footstep1', { volume: vol, pauseOnBlur: true }));
        this.footSteps.push(this.sound.add('Footstep2', { volume: vol, pauseOnBlur: true }));
        this.footSteps.push(this.sound.add('Footstep3', { volume: vol, pauseOnBlur: true }));
        this.footSteps.push(this.sound.add('Footstep4', { volume: vol, pauseOnBlur: true }));
        this.footSteps.push(this.sound.add('Footstep5', { volume: vol, pauseOnBlur: true }));
        this.footSteps.push(this.sound.add('Footstep6', { volume: vol, pauseOnBlur: true }));

        this.clickSound = this.sound.add('Click', { volume: 0, pauseOnBlur: true });

        this.birdSounds = [];
        this.birdSounds.push(this.sound.add('Birds1', { volume: 0, pauseOnBlur: true }));
        this.birdSounds.push(this.sound.add('Birds2', { volume: 0, pauseOnBlur: true }));
        this.birdSounds.push(this.sound.add('Birds3', { volume: 0, pauseOnBlur: true }));
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
        this.player.setDepth(this.player.y).setScale(0.2);
        this.player.setRectangle(20, 20).setBounce(0).setFixedRotation().setFriction(1, 0).setIgnoreGravity(true).setDisplayOrigin(190, 320);
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

                if (element.entrance) {
                    this.sceneToOpen = element.entrance.sceneKey;


                    //If the player is standing at the entrance and clicks the building it will enter the building
                    if (this.playerOverLapping == true && this.sceneToOpen && this.currentOverlapBody == element.entrance) {
                        //this.EnterBuilding();

                        this.enteringBuilding = true;
                    }

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

            if ((this.playerOverLapping === false || this.currentOverlapBody !== bodyB) && bodyB.collisionFilter === collisionCat2) {

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

        //This is here, because it checks for overlap just like the piece of code above, but it does other stuff too
        //this.ManageSoundTriggers();

        this.CheckForDistanceToSounds();

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
                this.movementVector.setLength(this.speed * (this.sys.game.loop.delta / 10));
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

        let maxZoom = 3;
        let minZoom = 1.5;

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

        this.anims.create({
            key: 'talk',
            frames: this.anims.generateFrameNumbers('talk', { start: 0, end: 15 }),
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

    //Creates a point in the map that plays a sound when the player is close to it
    //sound is an array of existing sounds added to the scene
    CreateSoundPoint(x, y, sound, distance) {
        let soundPoint = new Phaser.Math.Vector2(x, y);

        soundPoint.soundsToPlay = [];

        sound.forEach(item => {

            let newSound = item;
            newSound.volume = 0;
            //When the sound has stopped playing, pick a random sound from the list of sounds in this sound point and play it
            newSound.on('complete', function () {

                //Randomly pick a new sound, repeat if the sound is the same as the one that just finished playing
                do {
                    soundPoint.currentSound = soundPoint.soundsToPlay[Math.floor(Math.random() * soundPoint.soundsToPlay.length)];
                }
                while (soundPoint.currentSound === newSound);

                soundPoint.currentSound.play();
            }, this);
            soundPoint.soundsToPlay.push(newSound);
        }, this);

        soundPoint.currentSound = soundPoint.soundsToPlay[Math.floor(Math.random() * soundPoint.soundsToPlay.length)];

        soundPoint.currentSound.play();

        console.log(soundPoint.currentSound);

        //Rectangle collider that shows the position for the sound trigger or point or whatever you wanna call it, not visible when debug turned off
        soundPoint.marker = this.matter.add.rectangle(soundPoint.x, soundPoint.y, 10, 10, { collisionFilter: collisionCat2 });

        //Determines how close you have to be to the soundpoint to trigger the sounds
        soundPoint.distance = distance;

        this.soundPoints.push(soundPoint);
    }

    //Checks for the player's distance to a sound point and adjusts its volume based on it
    CheckForDistanceToSounds() {
        this.soundPoints.forEach(trigger => {
            let distance = this.CheckDistance(this.player, trigger);

            //trigger.currentSound.config = { volume: 1/distance, pauseOnBlur: true};
            //trigger.currentSound.play();

            //Adjusts the volume based on the current distance of the player to the trigger and based on the distance value on the trigger
            trigger.currentSound.volume = (1 - (distance/trigger.distance));

            //console.log(distance);
            if (trigger.currentSound.volume < 0.01) {
                trigger.currentSound.volume = 0;
            }
        }, this);
    }

}