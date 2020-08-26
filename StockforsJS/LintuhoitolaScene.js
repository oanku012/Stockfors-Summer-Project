class LintuhoitolaScene extends BuildingScene
{
    constructor()
    {
        super('LintuhoitolaScene');

        this.name = 'Lintuhoitola';
        
        this.backgroundImage = 'LintuImage1';

    }

    create ()
    {

        this.images = [];

        this.images.push("LintuImage1", "LintuImage2", "LintuImage3", "LintuImage4");

        super.create();
        
        
    }

}