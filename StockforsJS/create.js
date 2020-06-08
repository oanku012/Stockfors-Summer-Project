var player;

var arrowKeys;

var wasdKeys;

var pointer;

var debugText;

function create ()
    {

                

        this.add.image(400, 300, 'map');
        
        player = this.physics.add.sprite(400, 300, 'player');

        this.add.text(300, 40, "Stockfors", {font: "40px Arial", fill: "yellow"});

        debugText = this.add.text(1600, 10, "Debug stuff here.", {font: "40px Arial", fill: "white"});
        
        debugText.setScrollFactor(0, 0);

        arrowKeys = this.input.keyboard.createCursorKeys();
        wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        pointer = this.input.activePointer;

        this.input.mouse.disableContextMenu();
        
        player.body.setCollideWorldBounds(true);

        this.InitializeCamera();
        this.MovementInitialize();

        this.createButton(200, 200);
        
        
    }

