var config = {
        type: Phaser.AUTO,
        width: 1920,
        height: 1080,
        parent: 'phaser-example',
        
        physics: {
            default: 'arcade',
            arcade: {
                //gravity: { y: 0 },
                debug: true
            }
        },

        scene: {
            preload: preload,
            create: create,
            update: update,

            extend: {
                createContainer: createContainer,
                InitializeCamera: InitializeCamera,  
                MovementInitialize: MovementInitialize,
                MovementUpdate: MovementUpdate
            }
        }
    };

//var game = new Phaser.game(config);





    