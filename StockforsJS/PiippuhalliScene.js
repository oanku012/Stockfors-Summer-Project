class PiippuhalliScene extends BuildingScene
{
    constructor()
    {
        super('PiippuhalliScene');

        this.name = 'Piippuhalli';

    }

    create()
    {
        this.images = [];

        this.images.push("PiippuImage1", "PiippuImage2");

        super.create();
    }
}