class HallirakennusScene extends BuildingScene
{
    constructor()
    {
        super('HallirakennusScene');

        this.name = 'Hallirakennus';

        this.backgroundImage = 'HalliImage1';
    }

    create()
    {
        this.images = [];

        this.images.push("HalliImage1", "HalliImage2", "HalliImage3", "HalliImage4", "HalliImage5", "HalliImage6", "HalliImage7", "HalliImage8", "HalliImage9", "HalliImage10", "HalliImage11", "HalliImage12", "HalliImage13");

        super.create();
    }
}