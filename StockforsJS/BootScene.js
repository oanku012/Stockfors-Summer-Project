class BootScene extends Phaser.Scene {

    constructor()
    {
        super('BootScene');
    }

    preload ()
    {
        this.cameras.main.backgroundColor.setTo(255, 255, 255);

        // load all files necessary for the loading screen and all json files here
        this.cache.json.remove('assets');
        this.load.json('assets', 'Assets/json/MainAssets.json');
        this.load.json('buildingBodies', 'Assets/images/map/Buildings/PEBuildings.json');
        this.load.image('logo', 'Assets/images/menu/Logo.png');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        
    }

    create ()
    {
        //Loads up all the fonts
        FontsInit();
        
        this.scene.start('PreloadScene', { sceneToLoad: 'OpeningScene' });
    }

    
}