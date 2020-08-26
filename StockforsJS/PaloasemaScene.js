class PaloasemaScene extends BuildingScene
{
    constructor()
    {
        super('PaloasemaScene');

        this.name = 'Paloasema';

        this.backgroundImage = 'PaloImage';

    }

    create()
    {
        this.images = [];

        this.images.push("PaloImage");

        super.create();
    }
}