class PatruunantaloScene extends BuildingScene
{
    constructor()
    {
        super('PatruunantaloScene');

        this.name = 'Patruunantalo';
        this.url = 'https://www.google.com';

    }

    preload ()
    {
        super.preload();

        this.load.image('PatruunaImage1', 'Assets/images/Albums/Patruunantalo/Patruunantalo.jpg');
        this.load.image('PatruunaImage2', 'Assets/images/Albums/Patruunantalo/Patruunantalo2.jpg');
    }

    create ()
    {
        //this.playerSpawnPosition.x = 800;
        //this.playerSpawnPosition.y = 800;

        /*this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);*/

        this.images.push("PatruunaImage1");
        this.images.push("PatruunaImage1");
        this.images.push("PatruunaImage1");
        this.images.push("PatruunaImage1");
        this.images.push("PatruunaImage1");
        this.images.push("PatruunaImage2");
        this.images.push("PatruunaImage2");
        this.images.push("PatruunaImage2");
        this.images.push("PatruunaImage2");
        this.images.push("PatruunaImage2");

        this.minigame = 'PalapeliScene';

        super.create();
    }

    createContainer () 
    {
        super.createContainer();

        // possibly other stuff here
    }
}