class HiomoScene extends BuildingScene
{
    constructor()
    {
        super('HiomoScene');

        this.name = 'Hiomo';

    }

    create()
    {
        this.images = [];

        this.images.push("HiomoImage1", "HiomoImage2");

        super.create();
    }

}