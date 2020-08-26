class HunajataloScene extends BuildingScene
{
    constructor()
    {
        super('HunajataloScene');

        this.name = 'Hunajatalo';

    }

    create ()
    {

        this.images = [];

        this.images.push("HunajaImage1", "HunajaImage2", "HunajaImage3");

        super.create();
        
        
    }

}