class KaarihalliScene extends BuildingScene
{
    constructor()
    {
        super('KaarihalliScene');

        this.name = 'Kaarihalli';

    }

    preload ()
    {
        
    }

    create ()
    {
        this.images = [];

        this.images.push("KaariImage1", "KaariImage2");


        super.create();
        
        
    }

    createContainer () 
    {
        super.createContainer();

        // possibly other stuff here
    }
}