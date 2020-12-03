class Karting_rataScene extends BuildingScene
{
    constructor()
    {
        super('Karting_rataScene');

        this.name = 'Karting_rata';

        //this.url = 'http://www.kartingclub.fi/';

        this.backgroundImage = 'KartingImage3';


    }

    create()
    {
        this.images = [];

        this.images.push("KartingImage1", "KartingImage2", "KartingImage3");

        super.create();
    }

}