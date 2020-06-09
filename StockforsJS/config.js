var config = {
        type: Phaser.AUTO,
        width: 1920,
        height: 1080,

        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        
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
                
                InitializeCamera: InitializeCamera,  
                MovementInitialize: MovementInitialize,
                MovementUpdate: MovementUpdate,
                createContainer: createContainer
            }
        }
    };

//var game = new Phaser.game(config);





    