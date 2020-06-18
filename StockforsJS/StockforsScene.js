class StockforsScene extends MapScene
{
    constructor()
    {
        super('StockforsScene');

        this.PatruunanTalo;
        this.PakkausMuseo;

        this.KirkkoTie;
    }

    preload()
    {
        this.load.image('map', 'Assets/images/map/Red Bank.png');
        this.load.spritesheet('player', 'Assets/images/character/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('buttonBG', 'Assets/images/menu/button-bg.png');
        this.load.image('buttonText', 'Assets/images/menu/button-text.png');
        this.load.image('menuBG', 'Assets/images/menu/menu-bg.png');

        this.load.image('PatruunanTalo', 'Assets/images/map/Buildings/rem_0002');
        this.load.image('PakkausMuseo','Assets/images/map/Buildings/rem_0005');
        this.load.image('exitButton', 'Assets/images/menu/exit-button.png');

        this.load.image('Nuoli', 'Assets/images/map/arrowSign');
    }

    //Use parameters when starting this scene from another scene to set the position of the player
    create(startingPointX, startingPointY)
    {
        //Check if parameters are not numbers and if so give them the default values
        if(isNaN(startingPointX) && isNaN(startingPointY))
        {
            startingPointX = 400;
            startingPointY = 300;
        }

        this.add.image(400, 300, 'map').setDepth(0);
        this.add.text(300, 40, "Stockfors", {font: "40px Arial", fill: "yellow"});
        
        
        super.create(startingPointX, startingPointY);

    }

    BuildingsInitialize()
    {
        super.BuildingsInitialize();

        this.PatruunanTalo = this.buildings.create(600, 400, 'PatruunanTalo').setScale(0.3).setDepth(400).refreshBody();

        this.PatruunanTalo.setPosition(600, 370);

        this.PatruunanTalo.body.setSize(175, 75);

        this.PatruunanTalo.scene = 'PatruunaScene';

        this.PakkausMuseo = this.buildings.create(800, 200, 'PakkausMuseo').setScale(0.3).setDepth(200).refreshBody();

        this.PakkausMuseo.setPosition(800, 150);

        this.PakkausMuseo.body.setSize(175, 50);

        this.PakkausMuseo.scene = 'PakkausMuseoScene';

        this.KirkkoTie = this.buildings.create(1400, 500, 'Nuoli').setScale(0.1).setDepth(500).refreshBody();

        this.KirkkoTie.scene = 'KirkkoScene'; 

        //let testitalo = this.add.image(200, 200, 'PatruunanTalo');

        //testitalo.depth = testitalo.y + 64;

        /*let buildingsArray = this.buildings.getChildren();

        for(var i = 0; i< buildingsArray.length; i++)
        {
            buildingsArray[i].setDepth(buildingsArray[i].y + 64);
        }*/
    }
}