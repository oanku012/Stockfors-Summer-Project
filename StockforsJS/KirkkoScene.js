class KirkkoScene extends BuildingScene
{
    constructor()
    {
        super('KirkkoScene');

        this.name = 'Kirkko';

        this.backgroundImage = "KirkkoImage1";

    }

    preload()
    {

    }

    create()
    {

        this.images = [];

        this.images.push("KirkkoImage1", "KirkkoImage2", "KirkkoImage3", "KirkkoImage4");

        super.create();
    }

    update()
    {
        super.update();
    }


}