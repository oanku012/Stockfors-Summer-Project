class PakkausmuseoScene extends BuildingScene
{
    constructor()
    {
        super('PakkausmuseoScene');

        this.name = 'Pakkausmuseo';

        this.backgroundImage = 'PakkausBG';

        this.panoramas = [ 
            "Pakkausmuseo1.jpg",
            "Pakkausmuseo2.jpg"
        ];
    }

    preload ()
    {
        super.preload();
    }

    create ()
    {
        this.minigame = 'MuistiPeliScene';

        this.images = [];

        this.images.push("PakkausImage1", "PakkausImage2", "PakkausImage3", "PakkausImage4");

        this.panoramaThumbs = [];

        this.panoramaThumbs.push('PakkausPanoThumb1', 'PakkausPanoThumb2');

        super.create();
        
        
    }

    createContainer () 
    {
        super.createContainer();

        // possibly other stuff here
    }
}