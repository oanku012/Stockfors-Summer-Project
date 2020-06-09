class MainScene extends Phaser.Scene
{
    constructor()
    {
        super('MainScene');

        //From create.js
        this.player;
        this.arrowKeys;
        this.wasdKeys;
        this.pointer;
        //this.debugText;

        //From movement.js
        this.currentPath;
        this.destination = new Phaser.Math.Vector2();
        this.movingOnPath = false;
        this.speed = 400;
        this.debug;
    }

    preload ()
    {
        this.load.image('map', 'Assets/images/map/Red Bank.png');
        this.load.spritesheet('player', 'Assets/images/character/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('buttonBG', 'Assets/images/menu/button-bg.png');
        this.load.image('buttonText', 'Assets/images/menu/button-text.png');
        this.load.image('menuBG', 'Assets/images/menu/menu-bg.png');
    }

    create ()
    {

                

        this.add.image(400, 300, 'map');
        
        this.player = this.physics.add.sprite(400, 300, 'player');

        this.add.text(300, 40, "Stockfors", {font: "40px Arial", fill: "yellow"});

        /*this.debugText = this.add.text(1600, 10, "Debug stuff here.", {font: "40px Arial", fill: "white"});
        
        this.debugText.setScrollFactor(0, 0);*/

        this.arrowKeys = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        this.pointer = this.input.activePointer;

        this.input.mouse.disableContextMenu();
        
        this.player.body.setCollideWorldBounds(true);

        this.InitializeCamera();
        this.MovementInitialize();

        this.createButton(200, 200);
        
        
    }

    update ()
    {
    
        //pointer = this.input.activePointer;

        this.MovementUpdate();
    }

    MovementInitialize(){
    
        this.input.on('pointerup', function (pointer)
        {
            //cursor.setVisible(true).setPosition(pointer.x, pointer.y);
            this.destination.x = this.pointer.worldX;
            this.destination.y = this.pointer.worldY;
    
            /*debug = this.add.graphics();
    
            debug.clear().lineStyle(1, 0x00ff00);
            debug.lineBetween(0, destination.y, 800, destination.y);
            debug.lineBetween(destination.x, 0, destination.x, 600);*/
    
            this.physics.moveToObject(this.player, this.destination, this.speed);
    
            this.movingOnPath = true;
    
            
        }, this);
    
        //Stop player from moving when hitting the edges of the map
        this.player.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', this.onWorldBounds);
        
    }
    
    //Called when a physics object hits the edges of the map
    onWorldBounds(body)
    {
    
        //Stops object from moving
        body.speed = 0;
    
        this.movingOnPath = false;
    
        
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
        
        //Check the distance between the player and the destination
        let distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.destination.x, this.destination.y);
    
        if (this.player.body.speed > 0)
        {
            //distanceText.setText('Distance: ' + distance);
    
            //  4 is our distance tolerance, i.e. how close the source can get to the target
            //  before it is considered as being there. The faster it moves, the more tolerance is required.
            if (distance < 4)
            {
                this.player.body.reset(this.destination.x, this.destination.y);
    
                this.movingOnPath = false;
    
                //This is just to let the this.player move using keys after moving to a position with the mouse
                this.destination.x = -1000;
                this.destination.y = -1000;
            }
    
            
        }

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
    let bg = this.add.image(0, 0, 'buttonBG');
    let text = this.add.image(0, 0, 'buttonText');

    
    let button = this.add.container(posX, posY, [ bg, text ]);


    button.setSize(bg.width, bg.height);

    button.setInteractive();

    let popupBG = this.add.image(0, 0, 'menuBG');
    let popup = this.add.container(800, 600, [ popupBG ]);
    popup.setVisible(false);


    button.on('pointerover', function () {

        bg.setTint(0x44ff44);

    });

    button.on('pointerout', function () {

        bg.clearTint();

    });

    button.on('pointerdown', function () {

        if (popup.visible == true)
        {
            popup.setVisible(false);
        }
        else 
        {
            popup.setVisible(true);
        }
        
    });

    
    }



}
