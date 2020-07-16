class BootScene extends Phaser.Scene {

    constructor()
    {
        super('BootScene');
    }

    preload ()
    {
        // load all files necessary for the loading screen and all json files here
        this.load.json('assets', 'Assets/assets.json');
        this.load.json('buildingBodies', 'Assets/images/map/Buildings/PEBuildings.json');
        this.load.image('logo', 'Assets/images/menu/Logo.png');
    }

    create ()
    {
        this.scene.start('PreloadScene');
    }

}