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

        this.matter.world.setBounds(0, 0, 5000, 2000, 64, true, true, true, true);


        //Check if initialized parameters are not numbers and if so give them default values
        if (isNaN(this.startingPoint.x) && isNaN(this.startingPoint.y)) {
            this.startingPoint.x = playerStartPosition.x;
            this.startingPoint.y = playerStartPosition.y;
        }

        this.map = this.add.image(0, 0, 'map').setDepth(0).setDisplayOrigin(0, 0);

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

        this.buildings.PatruunanTalo = this.matter.add.sprite(1900, 730, 'buildingSheet', 'Patruunantalo', { shape: bodies.Patruunantalo }).setScale(0.8);
        let Patruuna = this.buildings.PatruunanTalo;
        Patruuna.entrance = this.matter.add.circle(Patruuna.x + 160, Patruuna.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.PakkausMuseo = this.matter.add.sprite(1100, 900, 'buildingSheet', 'Pakkausmuseo', { shape: bodies.Pakkausmuseo }).setScale(0.4);
        let Pakkaus = this.buildings.PakkausMuseo;
        Pakkaus.entrance = this.matter.add.circle(Pakkaus.x + 90, Pakkaus.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Hunajatalo = this.matter.add.sprite(1620, 820, 'buildingSheet', 'Hunajatalo', { shape: bodies.Hunajatalo }).setScale(0.5);
        let Hunaja = this.buildings.Hunajatalo;
        Hunaja.entrance = this.matter.add.circle(Hunaja.x + 40, Hunaja.y + 10, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Tallirakennus = this.matter.add.sprite(760, 970, 'buildingSheet', 'Tallirakennus', { shape: bodies.Tallirakennus }).setScale(0.5);
        let Talli = this.buildings.Tallirakennus;
        Talli.entrance = this.matter.add.circle(Talli.x + 150, Talli.y - 20, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Kaarihalli = this.matter.add.sprite(600, 590, 'buildingSheet', 'Kaarihalli', { shape: bodies.Kaarihalli }).setScale(0.6);
        let Kaari = this.buildings.Kaarihalli;
        Kaari.entrance = this.matter.add.circle(Kaari.x + 180, Kaari.y - 40, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Hallirakennus = this.matter.add.sprite(2450, 430, 'buildingSheet', 'Hallirakennus', { shape: bodies.Hallirakennus }).setScale(0.5);
        let Halli = this.buildings.Hallirakennus;
        Halli.entrance = this.matter.add.circle(Halli.x + 100, Halli.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Piippuhalli = this.matter.add.sprite(2810, 475, 'buildingSheet', 'Piippuhalli', { shape: bodies.Piippuhalli }).setScale(0.7);
        let Piippu = this.buildings.Piippuhalli;
        Piippu.entrance = this.matter.add.circle(Piippu.x - 60, Piippu.y + 10, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Paloasema = this.matter.add.sprite(2554, 790, 'buildingSheet', 'Paloasema', { shape: bodies.Paloasema }).setScale(0.7);
        let Palo = this.buildings.Paloasema;
        Palo.entrance = this.matter.add.circle(Palo.x + 190, Palo.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Lintuhoitola = this.matter.add.sprite(3323, 897, 'buildingSheet', 'Lintuhoitola', { shape: bodies.Lintuhoitola }).setScale(1);
        let Lintu = this.buildings.Lintuhoitola;
        Lintu.entrance = this.matter.add.circle(Lintu.x - 350, Lintu.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Hiomo = this.matter.add.sprite(4230, 600, 'buildingSheet', 'Hiomo', { shape: bodies.Hiomo }).setScale(0.6);
        let Hiomo = this.buildings.Hiomo;
        Hiomo.entrance = this.matter.add.circle(Hiomo.x + 150, Hiomo.y, entranceRadius, { collisionFilter: collisionCat2 });

        //this.buildings.KirkkoTie = this.matter.add.image(1400, 500, 'Nuoli').setScale(0.1);

        Object.values(this.buildings).forEach(building => {

            building.setDepth(building.y).setStatic(true);

            building.entrance.sceneKey = building.frame.name + 'Scene';

            this.buildingEntrances.push(building.entrance);

            building.entrance.arrow = this.add.sprite(building.entrance.position.x, building.entrance.position.y - 60, 'MenuAtlas', 'UI Buttons/Arrow').setScale(0.2, 0.3).setDepth(2000).setRotation(1.5707963268);

            this.tweens.add({
                targets: building.entrance.arrow,
                y: building.entrance.arrow.y - 20,
                duration: 1000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                loop: -1
            });

            //building.entrance.arrow.setAlpha(0.5);

            //this.arrows.push(building.entrance.arrow);

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
