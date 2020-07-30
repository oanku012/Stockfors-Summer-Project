class SceneLoader extends Phaser.Scene {

    init(data){
        this.sceneToLoad = data.sceneToLoad;
      }

    constructor()
    {
        super('SceneLoader');
    }

    preload ()
    {
        // load all files necessary for the loading screen and all json files here
        this.cache.json.remove('assets');
        this.load.json('assets', 'Assets/json/'+this.sceneToLoad+'Assets.json');
        this.load.image('logo', 'Assets/images/menu/Logo.png');
    }

    create ()
    {
        this.scene.start('PreloadScene', { sceneToLoad: this.sceneToLoad });
    }
}