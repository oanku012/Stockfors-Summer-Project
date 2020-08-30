class PaloasemaScene extends BuildingScene
{
    constructor()
    {
        super('PaloasemaScene');

        this.name = 'Paloasema';

        this.backgroundImage = 'PaloImage1';

    }

    create()
    {
        this.images = [];

        this.images.push("PaloImage1", "PaloImage2", "PaloImage3", "PaloImage4");

        super.create();
    }
}