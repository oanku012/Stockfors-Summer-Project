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

        this.data = this.cache.json.get('data').Stockfors;

        this.bodies = this.cache.json.get('buildingBodies');

        //this.matter.world.setBounds(0, 0, 5000, 2000, 64, true, true, true, true);


        //Check if initialized parameters are not numbers and if so give them default values
        if (isNaN(this.startingPoint.x) && isNaN(this.startingPoint.y)) {
            this.startingPoint.x = playerStartPosition.x;
            this.startingPoint.y = playerStartPosition.y;
        }

        this.background = this.add.image(-600, -500, 'mapTausta').setScale(0.52).setDisplayOrigin(0);

        this.map = this.matter.add.image(0, 0, 'map', null, { shape: this.bodies.Kartta }).setDepth(0).setStatic(true);

        this.map.setPosition(this.map.width/2 + 375, this.map.height/2 + 70);

        //this.map.body.position.x = -1000;
        //this.map.body.position.y = ;

        console.log(this.map);

        super.create();

        //this.CreateWaveAnim();

        if (gameState.newGame) {
            console.log('Intro is playing.');
            introPlaying = true;
            readyToMove = false;
            //this.player.anims.play('wave');
            this.player.anims.play('talk');
            //this.cameras.main.setZoom(3);
            saveGame({ newGame: false });

            //let playerTopRight = this.player.getTopRight();

            let bubbleDuration = 3000;

            //let posX = playerTopRight.x + 30;
            //let posY = playerTopRight.y - 30;

            //This looks like a mess I know, basically it makes new speech bubbles for the player on a timer
            let firstSpeechEvent = this.time.addEvent({
                delay: bubbleDuration, startAt: 2000, callback: function () {
                    let firstBubble = this.CreateSpeechBubble(this.data.Intro1, 0.3);

                    firstBubble.close.on('pointerup', function () {
                        if (firstBubble.close.pressed) {
                            secondSpeechEvent.remove(true);
                        }

                    }, this);

                    let secondSpeechEvent = this.time.addEvent({
                        delay: bubbleDuration, callback: function () {
                            let secondBubble = this.CreateSpeechBubble(this.data.Intro2, 0.3);
                            firstBubble.destroy();

                            secondBubble.close.on('pointerup', function () {
                                if (secondBubble.close.pressed) {
                                    thirdSpeechEvent.remove(true);
                                }

                            }, this);

                            let thirdSpeechEvent = this.time.addEvent({
                                delay: bubbleDuration, callback: function () {
                                    let thirdBubble = this.CreateSpeechBubble(this.data.Intro3, 0.3);
                                    secondBubble.destroy();

                                    thirdBubble.close.on('pointerup', function () {
                                        if (thirdBubble.close.pressed) {
                                            fourthSpeechEvent.remove(true);
                                        }

                                    }, this);

                                    let fourthSpeechEvent = this.time.addEvent({
                                        delay: bubbleDuration, callback: function () {
                                            let fourthBubble = this.CreateSpeechBubble(this.data.Intro4, 0.3);
                                            thirdBubble.destroy();

                                            fourthBubble.close.on('pointerup', function () {
                                                if (fourthBubble.close.pressed) {
                                                    introEndEvent.remove(true);

                                                }

                                            }, this);

                                            let introEndEvent = this.time.addEvent({
                                                delay: bubbleDuration, callback: function () {
                                                    readyToMove = true;
                                                    fourthBubble.destroy();
                                                    introPlaying = false;
                                                }, callbackScope: this
                                            });

                                        }, callbackScope: this
                                    });

                                }, callbackScope: this
                            });

                        }, callbackScope: this
                    });

                }, callbackScope: this
            });



        }
    }

    BuildingsInitialize() {


     

        let entranceRadius = 25;

        this.buildings.PatruunanTalo = this.matter.add.sprite(1970, 670, 'buildingSheet', 'Patruunantalo', { shape: this.bodies.Patruunantalo }).setScale(0.75);
        let Patruuna = this.buildings.PatruunanTalo;
        Patruuna.entrance = this.matter.add.circle(Patruuna.x + 160, Patruuna.y - 10, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.PakkausMuseo = this.matter.add.sprite(1320, 800, 'buildingSheet', 'Pakkausmuseo', { shape: this.bodies.Pakkausmuseo }).setScale(0.4);
        let Pakkaus = this.buildings.PakkausMuseo;
        Pakkaus.entrance = this.matter.add.circle(Pakkaus.x + 90, Pakkaus.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Hunajatalo = this.matter.add.sprite(1730, 769, 'buildingSheet', 'Hunajatalo', { shape: this.bodies.Hunajatalo }).setScale(0.5);
        let Hunaja = this.buildings.Hunajatalo;
        Hunaja.entrance = this.matter.add.circle(Hunaja.x + 50, Hunaja.y + 30, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Tallirakennus = this.matter.add.sprite(1060, 870, 'buildingSheet', 'Tallirakennus', { shape: this.bodies.Tallirakennus }).setScale(0.5);
        let Talli = this.buildings.Tallirakennus;
        Talli.entrance = this.matter.add.circle(Talli.x + 150, Talli.y - 20, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Kaarihalli = this.matter.add.sprite(930, 590, 'buildingSheet', 'Kaarihalli', { shape: this.bodies.Kaarihalli }).setScale(0.6);
        let Kaari = this.buildings.Kaarihalli;
        Kaari.entrance = this.matter.add.circle(Kaari.x + 180, Kaari.y - 60, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Hallirakennus = this.matter.add.sprite(2440, 420, 'buildingSheet', 'Hallirakennus', { shape: this.bodies.Hallirakennus }).setScale(0.5);
        let Halli = this.buildings.Hallirakennus;
        Halli.entrance = this.matter.add.circle(Halli.x + 100, Halli.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Piippuhalli = this.matter.add.sprite(2780, 455, 'buildingSheet', 'Piippuhalli', { shape: this.bodies.Piippuhalli }).setScale(0.6);
        let Piippu = this.buildings.Piippuhalli;
        Piippu.entrance = this.matter.add.circle(Piippu.x - 60, Piippu.y + 20, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Paloasema = this.matter.add.sprite(2524, 720, 'buildingSheet', 'Paloasema', { shape: this.bodies.Paloasema }).setScale(0.7);
        let Palo = this.buildings.Paloasema;
        Palo.entrance = this.matter.add.circle(Palo.x + 190, Palo.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Lintuhoitola = this.matter.add.sprite(3083, 837, 'buildingSheet', 'Lintuhoitola', { shape: this.bodies.Lintuhoitola }).setScale(1);
        let Lintu = this.buildings.Lintuhoitola;
        Lintu.entrance = this.matter.add.circle(Lintu.x - 350, Lintu.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.Hiomo = this.matter.add.sprite(3870, 540, 'buildingSheet', 'Hiomo', { shape: this.bodies.Hiomo }).setScale(0.6);
        let Hiomo = this.buildings.Hiomo;
        Hiomo.entrance = this.matter.add.circle(Hiomo.x + 150, Hiomo.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.KartingRata = this.matter.add.sprite(4370, 600, 'buildingSheet', 'Karting_rata', { shape: this.bodies.Karting_rata }).setScale(0.7);
        //let Kart = this.buildings.KartingRata;
        //Kart.entrance = this.matter.add.circle(Kart.x + 150, Kart.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.KatettuSilta = this.matter.add.sprite(1120, 380, 'buildingSheet', 'Katettu_silta', { shape: this.bodies.Katettu_silta }).setScale(0.6);
        let Silta = this.buildings.KatettuSilta;
        Silta.entrance = this.matter.add.circle(Silta.x + 170, Silta.y + 20, entranceRadius, { collisionFilter: collisionCat2 });

        this.buildings.historiaKyltti = this.matter.add.sprite(1620, 850, 'buildingSheet', 'History', { shape: this.bodies.History }).setScale(0.15);
        let History = this.buildings.historiaKyltti;
        History.entrance = this.matter.add.circle(History.x, History.y, entranceRadius, { collisionFilter: collisionCat2 });

        this.puska1 = this.matter.add.sprite(2320, 640, 'buildingSheet', 'Pensas', { shape: this.bodies.Pensas }).setScale(0.5).setStatic(true);
        this.puska2 = this.matter.add.sprite(2220, 570, 'buildingSheet', 'Pensas2', { shape: this.bodies.Pensas2 }).setScale(0.5).setStatic(true);
        this.puskaAita = this.matter.add.sprite(1985, 760, 'buildingSheet', 'Pensas_ja_aita', { shape: this.bodies.Pensas_ja_aita }).setScale(0.6).setStatic(true);
        this.aita = this.matter.add.sprite(2290, 675, 'buildingSheet', 'Valkoinen_aita', { shape: this.bodies.Valkoinen_aita }).setScale(0.7).setStatic(true);
        this.buildings.portti1 = this.matter.add.sprite(1900, 870, 'buildingSheet', 'Portti', { shape: this.bodies.Portti }).setScale(0.6).setStatic(true);
        this.buildings.portti2 = this.matter.add.sprite(1840, 825, 'buildingSheet', 'Portti2', { shape: this.bodies.Portti2 }).setScale(0.6).setStatic(true);
        
        

            //this.buildings.KirkkoTie = this.matter.add.image(1400, 500, 'Nuoli').setScale(0.1);

            Object.values(this.buildings).forEach(building => {

                building.setDepth(building.y).setStatic(true);

                if (building.entrance) {
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

                }

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
