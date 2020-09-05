class ColombierScene extends BuildingScene
{
    constructor()
    {
        super('ColombierScene');

        this.name = 'Colombier';

        this.url = 'https://colombier.com/';

        this.backgroundImage = "ColombierImage1";

    }

    create()
    {
        this.images = [];

        this.images.push("ColombierImage1", "ColombierImage2", "ColombierImage3", "ColombierImage4");

        super.create();
    }

}