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

        this.images.push("HiomoImage1", "HiomoImage2", "HiomoImage3", "HiomoImage4", "HiomoImage5", "HiomoImage6", "HiomoImage7", "HiomoImage8", "HiomoImage9" );

        super.create();
    }

}