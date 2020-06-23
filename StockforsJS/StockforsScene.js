class StockforsScene extends MapScene {
    constructor() {

        super('StockforsScene');


    }

    preload() {
        this.load.image('map', 'Assets/images/map/Red Bank.png');
        this.load.spritesheet('player', 'Assets/images/character/player.png', { frameWidth: 72.5, frameHeight: 109.6 });
        this.load.image('buttonBG', 'Assets/images/menu/button-bg.png');
        this.load.image('buttonText', 'Assets/images/menu/button-text.png');
        this.load.image('menuBG', 'Assets/images/menu/menu-bg.png');

        this.load.image('PatruunanTalo', 'Assets/images/map/Buildings/rem_0002');
        this.load.image('PakkausMuseo', 'Assets/images/map/Buildings/rem_0005');
        this.load.image('exitButton', 'Assets/images/menu/exit-button.png');

        this.load.image('Nuoli', 'Assets/images/map/arrowSign');
    }

    //Use parameters when starting this scene from another scene to set the position of the player
    create() {

        this.matter.world.setBounds(0, 0, 2000, 2000);

        //Check if initialized parameters are not numbers and if so give them default values
        if (isNaN(this.startingPoint.x) && isNaN(this.startingPoint.y)) {
            this.startingPoint.x = 200;
            this.startingPoint.y = 300;
        }

        this.map = this.add.image(400, 300, 'map').setDepth(0);
        this.add.text(300, 40, "Stockfors", { font: "40px Arial", fill: "yellow" });


        super.create();

    }

    BuildingsInitialize() {
        super.BuildingsInitialize();

        const thisScene = this.scene;

        this.buildings.PatruunanTalo = this.matter.add.image(600, 400, 'PatruunanTalo').setScale(0.3).setStatic(true);
        this.buildings.PatruunanTalo.openScene = function () {
            thisScene.start('PatruunaScene');
        };

        this.buildings.PakkausMuseo = this.matter.add.image(800, 200, 'PakkausMuseo').setScale(0.3).setStatic(true);
        this.buildings.PakkausMuseo.openScene = function () {
            thisScene.start('PakkausMuseoScene');
        };

        this.buildings.KirkkoTie = this.matter.add.image(1400, 500, 'Nuoli').setScale(0.1).setStatic(true);
        this.buildings.KirkkoTie.openScene = function () {
            thisScene.start('KirkkoScene');
        };
    }
}