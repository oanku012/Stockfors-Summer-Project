class PaloasemaScene extends BuildingScene
{
    constructor()
    {
        super('PaloasemaScene');

        this.name = 'Paloasema';

    }

    create()
    {
        this.images = [];

        this.images.push("PaloImage");

        super.create();
    }
}