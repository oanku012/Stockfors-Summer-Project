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

        super.create();
    }

    createContainer () 
    {
        super.createContainer();

        // possibly other stuff here
    }
}