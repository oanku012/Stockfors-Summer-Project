class LanguageLoader extends Phaser.Scene {

    init(data){
        this.activeScenes = data.activeScenes;
    }

    constructor() {
        super('LanguageLoader');
    }

    preload() {
        this.cache.json.remove('data');

        var path = ("Localization/" + config.language + "/data.json");
        this.load.json('data', path);

        this.load.once('complete', function () {

            this.activeScenes.forEach(function (scene) {
                //Condition so that this scene and UI aren't restarted
                if (scene != this && scene.scene.key != 'UI') {
                    //scene.time.delayedCall(50, function () {

                        //If scene includes the player then save the current position of the player before restarting
                        if (scene.player) {
                            saveGame({ currentMap: scene.scene.key, playerX: scene.player.x, playerY: scene.player.y });
                            this.scene.start(scene, { x: gameState.playerX, y: gameState.playerY });
                        }
                        else {
                            this.scene.start(scene);

                        }
                        console.log(scene.scene.key + ' restarted to change language.');
                    //}, null, this);
                }
            }, this);

            //Not the most elegant solution, but this is done with a delay so that it's not set to false before opening scene restarts and stops the opening scene from loading the language separately
            /*this.time.delayedCall(100, function () {
                languageChanged = false;
            }, null, this);*/
        }, this);

        console.log('Language loaded');
    }
}