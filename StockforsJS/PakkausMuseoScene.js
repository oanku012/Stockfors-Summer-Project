class PakkausmuseoScene extends MenuScene
{
    constructor()
    {
        super('PakkausmuseoScene');

        this.title = 'Pakkausmuseo';
        this.description = 'Tämä on pakkausmuseo.';

    }

    preload ()
    {
        super.preload();
    }

    create ()
    {
        super.create();
        
        //Should add this to container later
        let muistipeliButton = this.add.image(800, 800, 'buttonBG');

        muistipeliButton.setInteractive();

        muistipeliButton.on('pointerup', function () {
            this.scene.start('MuistiPeliScene');
        }, this);
    }

    createContainer () 
    {
        super.createContainer();

        // possibly other stuff here
    }
}