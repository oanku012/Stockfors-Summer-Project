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
<<<<<<< HEAD
                createContainer: createContainer,
                InitializeCamera: InitializeCamera,  
                MovementInitialize: MovementInitialize,
                MovementUpdate: MovementUpdate
=======
                createButton: createButton,
>>>>>>> 094798a98394f66fd38919d6f7e92214fab5d62a
            }
        }
    };

//var game = new Phaser.game(config);





    