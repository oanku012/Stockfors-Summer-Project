class PatruunantaloScene extends BuildingScene
{
    constructor()
    {
        super('PatruunantaloScene');

        this.name = 'Patruunantalo';

    }

    preload ()
    {
        super.preload();
    }

    create ()
    {
        //this.playerSpawnPosition.x = 800;
        //this.playerSpawnPosition.y = 800;

        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);
        this.images.push(["1thumb", "1full" ]);

        this.minigame = 'PalapeliScene';

        super.create();
    }

    createContainer () 
    {
        super.createContainer();

        // possibly other stuff here
    }
}