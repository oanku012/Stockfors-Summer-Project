var config = {
        type: Phaser.AUTO,
        width: 3000,
        height: 3000,
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
                createButton: createButton,
            }
        }
    };

//var game = new Phaser.game(config);





    