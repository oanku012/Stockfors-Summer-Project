class StockforsScene extends MapScene {
    constructor() {

        super('StockforsScene');


    }

    preload() {
        
        this.load.spritesheet('player', 'Assets/images/character/player.png', { frameWidth: 72.5, frameHeight: 109.6 });

        this.load.image('map', 'Assets/images/map/kartta.png');
        /*this.load.image('PatruunanTalo', 'Assets/images/map/Buildings/Patruunantalo');
        this.load.image('PakkausMuseo', 'Assets/images/map/Buildings/Pakkausmuseo');
        this.load.image('Kaarihalli', 'Assets/images/map/Buildings/Kaarihalli');
        this.load.image('Hunajatalo', 'Assets/images/map/Buildings/Hunajatalo');
        this.load.image('Tallirakennus', 'Assets/images/map/Buildings/Tallirakennus');*/
        this.load.image('Nuoli', 'Assets/images/map/arrowSign');

        this.load.image('buttonBG', 'Assets/images/menu/button-bg.png');
        this.load.image('buttonText', 'Assets/images/menu/button-text.png');
        this.load.image('menuBG', 'Assets/images/menu/menu-bg.png');
        this.load.image('exitButton', 'Assets/images/menu/exit-button.png');

        this.load.atlas('buildingSheet', 'Assets/images/map/Buildings/TPBuildings.png', 'Assets/images/map/Buildings/TPBuildings.json')
        this.load.json('buildingBodies', 'Assets/images/map/Buildings/PEBuildings.json');
        
    }

    //Use parameters when starting this scene from another scene to set the position of the player
    create() {

        this.matter.world.setBounds(0, 0, 2000, 2000);

        //Check if initialized parameters are not numbers and if so give them default values
        if (isNaN(this.startingPoint.x) && isNaN(this.startingPoint.y)) {
            this.startingPoint.x = 200;
            this.startingPoint.y = 300;
        }

        this.map = this.add.image(0, 0, 'map').setDepth(0).setDisplayOrigin(0, 0);

        this.add.text(300, 40, "Stockfors", { font: "40px Arial", fill: "yellow" });

        super.create();

    }

    BuildingsInitialize() {
        super.BuildingsInitialize();

        let bodies = this.cache.json.get('buildingBodies');

        this.buildings.PatruunanTalo = this.matter.add.sprite(1090, 760, 'buildingSheet', 'Patruunantalo', {shape: bodies.Patruunantalo }).setScale(0.4);
        //this.buildings.PatruunanTalo.setRectangle(300, 150);
        
        this.buildings.PakkausMuseo = this.matter.add.sprite(550, 850, 'buildingSheet', 'Pakkausmuseo', {shape: bodies.Pakkausmuseo }).setScale(0.2);
        //this.buildings.PakkausMuseo.setRectangle(150, 75);

        this.buildings.Hunajatalo = this.matter.add.sprite(840, 750, 'buildingSheet', 'Hunajatalo', {shape: bodies.Hunajatalo }).setScale(0.2);
        //this.buildings.Hunajatalo.setRectangle(200, 100);

        this.buildings.Tallirakennus = this.matter.add.sprite(380, 930, 'buildingSheet', 'Tallirakennus', {shape: bodies.Tallirakennus }).setScale(0.25);
        //this.buildings.Tallirakennus.setRectangle(300, 100);

        this.buildings.Kaarihalli = this.matter.add.sprite(450, 500, 'buildingSheet', 'Kaarihalli', {shape: bodies.Kaarihalli}).setScale(0.3);
        //this.buildings.Kaarihalli.setRectangle(300, 150);

        this.buildings.KirkkoTie = this.matter.add.image(1400, 500, 'Nuoli').setScale(0.1);

        
        Object.values(this.buildings).forEach(building => {
            
            building.setDepth(building.y).setStatic(true);
        
            building.sceneKey = building.frame.name + 'Scene';

            //console.log(building.sceneKey);
            
        }, this);

        //this.levelContainer.setScale(1.5);

    }
}