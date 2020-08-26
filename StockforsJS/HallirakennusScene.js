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

        //this.images.push("HalliImage");

        super.create();
    }
}