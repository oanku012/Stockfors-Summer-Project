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

        this.add.image(400, 300, 'map');
        this.add.text(300, 40, "Stockfors", {font: "40px Arial", fill: "yellow"});
        
        
        super.create(startingPointX, startingPointY);
        this.createButton(200, 200);

    }

    BuildingsInitialize()
    {
        super.BuildingsInitialize();

        this.PatruunanTalo = this.buildings.create(600, 400, 'PatruunanTalo').setScale(0.3).refreshBody();

        this.PatruunanTalo.scene = 'MenuScene';

        this.PakkausMuseo = this.buildings.create(800, 200, 'PakkausMuseo').setScale(0.3).refreshBody();

        this.PakkausMuseo.scene = 'MenuScene';

        this.KirkkoTie = this.buildings.create(1400, 500, 'Nuoli').setScale(0.1).refreshBody();

        this.KirkkoTie.scene = 'KirkkoScene';
    }
}