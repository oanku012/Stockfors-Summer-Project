function create ()
    {

                

        this.add.image(400, 300, 'map');
        
        player = this.add.sprite(400, 300, 'player');

        this.add.text(300, 40, "Stockfors", {font: "40px Arial", fill: "yellow"});

        
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        MovementInitialize();
    }