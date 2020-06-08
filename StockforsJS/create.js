var player;

var arrowKeys;

var wasdKeys;

var pointer;

var currentScene = this;


function create ()
    {

                

        this.add.image(400, 300, 'map');
        
        player = this.physics.add.sprite(400, 300, 'player');

        this.add.text(300, 40, "Stockfors", {font: "40px Arial", fill: "yellow"});

        arrowKeys = this.input.keyboard.createCursorKeys();
        wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        pointer = this.input.activePointer;
        
        player.setCollideWorldBounds(true);

        this.InitializeCamera();
        this.MovementInitialize();

        this.createContainer();
    }

