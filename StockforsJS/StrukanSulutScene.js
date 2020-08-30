class StrukanSulutScene extends BuildingScene
{
    constructor()
    {
        super('StrukanSulutScene');

        this.name = 'StrukanSulut';

    }

    create()
    {
        this.images = [];

        this.images.push("SulkuImage1", "SulkuImage2", "SulkuImage3", "SulkuImage4", "SulkuImage5", "SulkuImage6");

        super.create();
    }

}