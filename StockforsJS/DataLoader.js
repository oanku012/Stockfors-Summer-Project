class DataLoader extends Phaser.Scene {

    init(data) {
        this.sceneToLoad = data.sceneToLoad;
        this.dataToLoad = data.dataToLoad;
        this.path = data.path;
    }

    constructor() {
        super('DataLoader');
    }

    preload() {
        // load all files necessary for the loading screen and all json files here
        this.cache.json.remove(this.dataToLoad);

        this.load.json(this.dataToLoad, this.path);

        /*if (this.dataToLoad === 'assets') {
            this.load.json(this.dataToLoad, 'Assets/json/' + this.sceneToLoad + 'Assets.json');
        }
        else if(this.dataToLoad === 'data')
        {
            this.load.json(this.dataToLoad, "Localization/" + config.language + "/data.json");

        }*/

        this.load.image('logo', 'Assets/images/menu/Logo.png');
    }

    create() {
        if (this.cache.json.exists(this.dataToLoad)) {
            this.scene.start('PreloadScene', { sceneToLoad: this.sceneToLoad, dataToLoad: this.dataToLoad });
        }
        else {
            this.scene.start(this.sceneToLoad);
        }

    }
}