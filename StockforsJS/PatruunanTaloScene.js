class PatruunantaloScene extends BuildingScene
{
    constructor()
    {
        super('PatruunantaloScene');

        this.name = 'Patruunantalo';
        this.url = 'https://www.google.com';

    }

    preload ()
    {
        super.preload();
    }

    create ()
    {
        //this.playerSpawnPosition.x = 800;
        //this.playerSpawnPosition.y = 800;

        this.images = [];

        this.images.push("PatruunaImage1", "PatruunaImage2", "PatruunaImage3", "PatruunaImage4","PatruunaImage5", "PatruunaImage6", "PatruunaImage7", 
        "PatruunaImage8", "PatruunaImage9", "PatruunaImage10", "PatruunaImage11", "PatruunaImage12","PatruunaImage13","PatruunaImage14","PatruunaImage15");

        this.panoramas = [];

        this.panoramas.push("PatruunaPano1", "PatruunaPano2");

        this.panoramaThumbs = [];

        this.panoramaThumbs.push('PatruunaPanoThumb1', 'PatruunaPanoThumb2');

        this.minigame = 'PalapeliScene';

        super.create();
    }

    createContainer () 
    {
        super.createContainer();

        // possibly other stuff here
    }
}