class PakkausmuseoScene extends BuildingScene
{
    constructor()
    {
        super('PakkausmuseoScene');

        this.name = 'Pakkausmuseo';

        this.backgroundImage = 'PakkausBG';

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

        super.create();
        
        
    }

    createContainer () 
    {
        super.createContainer();

        // possibly other stuff here
    }
}