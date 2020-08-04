var introPlaying = false;

class StockforsScene extends MapScene {
    constructor() {

        super('StockforsScene');


    }

    preload() {

        //Moved everything here to OpeningScene

    }

    //Use parameters when starting this scene from another scene to set the position of the player
    create() {

        this.matter.world.setBounds(0, 0, 2000, 2000);

        //Check if initialized parameters are not numbers and if so give them default values
        if (isNaN(this.startingPoint.x) && isNaN(this.startingPoint.y)) {
            this.startingPoint.x = playerStartPosition.x;
            this.startingPoint.y = playerStartPosition.y;
        }

        this.map = this.add.image(0, 0, 'map').setDepth(0).setDisplayOrigin(0, 0);

        this.add.text(300, 40, "Stockfors", { font: "40px Arial", fill: "yellow" });

        super.create();

        /*this.CreateWaveAnim();

        if (gameState.newGame) {
            console.log('Intro is playing.');
            introPlaying = true;
            readyToMove = false;
            this.player.anims.play('wave');
            this.cameras.main.setZoom(3);
            saveGame({ newGame: false });


        }*/
    }

    BuildingsInitialize() {


        let bodies = this.cache.json.get('buildingBodies');

        let entranceRadius = 40;

        this.buildings.PatruunanTalo = this.matter.add.sprite(1090, 760, 'buildingSheet', 'Patruunantalo', { shape: bodies.Patruunantalo }).setScale(0.4);
        let Patruuna = this.buildings.PatruunanTalo;
        Patruuna.entrance = this.matter.add.circle(Patruuna.x + 110, Patruuna.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.PakkausMuseo = this.matter.add.sprite(550, 850, 'buildingSheet', 'Pakkausmuseo', { shape: bodies.Pakkausmuseo }).setScale(0.2);
        let Pakkaus = this.buildings.PakkausMuseo;
        Pakkaus.entrance = this.matter.add.circle(Pakkaus.x + 70, Pakkaus.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Hunajatalo = this.matter.add.sprite(830, 770, 'buildingSheet', 'Hunajatalo', { shape: bodies.Hunajatalo }).setScale(0.2);
        let Hunaja = this.buildings.Hunajatalo;
        Hunaja.entrance = this.matter.add.circle(Hunaja.x + 90, Hunaja.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Tallirakennus = this.matter.add.sprite(380, 930, 'buildingSheet', 'Tallirakennus', { shape: bodies.Tallirakennus }).setScale(0.25);
        let Talli = this.buildings.Tallirakennus;
        Talli.entrance = this.matter.add.circle(Talli.x + 130, Talli.y - 20, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Kaarihalli = this.matter.add.sprite(450, 500, 'buildingSheet', 'Kaarihalli', { shape: bodies.Kaarihalli }).setScale(0.3);
        let Kaari = this.buildings.Kaarihalli;
        Kaari.entrance = this.matter.add.circle(Kaari.x + 150, Kaari.y, entranceRadius, { collisionFilter: collisionCat2 });

        //this.buildings.KirkkoTie = this.matter.add.image(1400, 500, 'Nuoli').setScale(0.1);


        Object.values(this.buildings).forEach(building => {

            building.setDepth(building.y).setStatic(true);

            building.entrance.sceneKey = building.frame.name + 'Scene';

            this.buildingEntrances.push(building.entrance);

            //console.log(building.sceneKey);

        }, this);

        //this.levelContainer.setScale(1.5);

        super.BuildingsInitialize();

    }

    CreateWaveAnim() {
        this.anims.create({
            key: 'wave',
            frames: this.anims.generateFrameNumbers('wave', { start: 0, end: 7 }),
            frameRate: this.frameRate,
            repeat: -1
        });
    }

    update() {

        super.update();

        /*if (this.pointer.isDown == true && introPlaying) {
            console.log('Intro ended.');
            readyToMove = true;
            introPlaying = false;
        }*/
    }
}
