class PakkausmuseoScene extends BuildingScene
{
    constructor()
    {
        super('PakkausmuseoScene');

        this.name = 'Pakkausmuseo';

    }

    preload ()
    {
        super.preload();
    }

    create ()
    {
        this.minigame = 'MuistiPeliScene';

        super.create();
        
        
    }

    createContainer () 
    {
        super.createContainer();

        // possibly other stuff here
    }
}