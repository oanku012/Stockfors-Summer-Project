class TallirakennusScene extends BuildingScene
{
    constructor()
    {
        super('TallirakennusScene');

        this.name = 'Tallirakennus';

    }

    preload ()
    {
        
    }

    create ()
    {
        //this.minigame = 'MuistiPeliScene';

        this.images = [];

        this.images.push("TalliImage1", "TalliImage2", "TalliImage3", "TalliImage4", "TalliImage5", "TalliImage6");

        super.create();
        
        
    }

    createContainer () 
    {
        super.createContainer();

        // possibly other stuff here
    }
}