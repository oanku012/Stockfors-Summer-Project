class Katettu_siltaScene extends BuildingScene
{
    constructor()
    {
        super('Katettu_siltaScene');

        this.name = 'Katettu_silta';

        this.backgroundImage = 'SiltaImage1';

    }

    create()
    {
        this.images = [];

        this.images.push("SiltaImage1", "SiltaImage2", "SiltaImage3", "SiltaImage4", "SiltaImage5");

        super.create();
    }

}