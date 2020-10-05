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
        this.load.image('tausta', 'Assets/images/menu/Tausta.jpg');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create ()
    {
        //Loads up all the fonts
        FontsInit();

        this.scene.start('PreloadScene', { sceneToLoad: 'OpeningScene' });
    }
}


function FontsInit()
{
    //  Inject our CSS
    var element = document.createElement('style');

    document.head.appendChild(element);

    var sheet = element.sheet;

    var styles = '@font-face { font-family: "LexendTera"; src: url("Assets/Fonts/LexendTera-Regular.ttf") format("truetype"); }\n';

    sheet.insertRule(styles, 0);

    styles = '@font-face { font-family: "Carme"; src: url("Assets/Fonts/Carme-Regular.ttf") format("truetype"); }';

    sheet.insertRule(styles, 0);

    WebFont.load({
        custom: {
            families: [ 'LexendTera', 'Carme' ]
        }
    });

}