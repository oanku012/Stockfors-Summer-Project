class PreloadScene extends Phaser.Scene {

    init(data){
        this.sceneToLoad = data.sceneToLoad;
      }

    constructor()
    {
        super('PreloadScene');
    }

    preload ()
    {
        console.log("Loading scene: " + this.sceneToLoad);
        this.cameras.main.backgroundColor.setTo(255, 255, 255);
        this.loadAssets(this.cache.json.get('assets'));
        //Backgroundimage
        this.background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'tausta').setScale(1.34);
        let logo = this.add.image(this.centerX(), this.centerY(), 'logo');
        logo.setScale(0.8);
        this.createProgressbar(this.centerX(), this.centerY() + 200);
    }

    create()
    {
        rescaleSceneEvent(this);

        /*this.scale.on('resize', () => {
            rescaleSceneEvent(this);
        }, this);*/
    }

    createProgressbar (x, y)
    {
        // size & position
        let width = 400;
        let height = 20;
        let xStart = x - width / 2;
        let yStart = y - height / 2;

        // border size
        let borderOffset = 2;

        let borderRect = new Phaser.Geom.Rectangle(
            xStart - borderOffset,
            yStart - borderOffset,
            width + borderOffset * 2,
            height + borderOffset * 2);

        let border = this.add.graphics({
            lineStyle: {
                width: 5,
                color: 0xaaaaaa
            }
        });
        border.strokeRectShape(borderRect);

        let progressbar = this.add.graphics();

        /**
         * Updates the progress bar.
         * 
         * @param {number} percentage 
         */
        let updateProgressbar = function (percentage)
        {
            progressbar.clear();
            progressbar.fillStyle(0x000000, 1);
            progressbar.fillRect(xStart, yStart, percentage * width, height);
        };

        this.load.on('progress', updateProgressbar);

        this.load.once('complete', function ()
        {
            // unload dummy file so we can load it again
            this.textures.remove('dummy');

            this.load.off('progress', updateProgressbar);
            this.scene.start(this.sceneToLoad);

        }, this);
    }

    loadAssets (json)
    {
        Object.keys(json).forEach(function (group)
        {
            Object.keys(json[group]).forEach(function (key)
            {
                let value = json[group][key];

                if (group === 'atlas' ||
                    group === 'unityAtlas' ||
                    group === 'bitmapFont' ||
                    group === 'spritesheet' ||
                    group === 'multiatlas')
                {

                    // atlas:ƒ       (key, textureURL,  atlasURL,  textureXhrSettings, atlasXhrSettings)
                    // unityAtlas:ƒ  (key, textureURL,  atlasURL,  textureXhrSettings, atlasXhrSettings)
                    // bitmapFont ƒ  (key, textureURL,  xmlURL,    textureXhrSettings, xmlXhrSettings)
                    // spritesheet:ƒ (key, url,         config,    xhrSettings)
                    // multiatlas:ƒ  (key, textureURLs, atlasURLs, textureXhrSettings, atlasXhrSettings)
                    this.load[group](key, value[0], value[1]);

                }
                else if (group === 'audio')
                {

                    // do not add mp3 unless, you bought a license ;) 
                    // opus, webm and ogg are way better than mp3
                    if (value.hasOwnProperty('opus') && this.sys.game.device.audio.opus)
                    {
                        this.load[group](key, value['opus']);

                    }
                    else if (value.hasOwnProperty('webm') && this.sys.game.device.audio.webm)
                    {
                        this.load[group](key, value['webm']);

                    }
                    else if (value.hasOwnProperty('ogg') && this.sys.game.device.audio.ogg)
                    {
                        this.load[group](key, value['ogg']);

                    }
                    else if (value.hasOwnProperty('wav') && this.sys.game.device.audio.wav)
                    {
                        this.load[group](key, value['wav']);
                    }
                }
                else if (group === 'html')
                {
                    // html:ƒ (key, url, width, height, xhrSettings)
                    this.load[group](key, value[0], value[1], value[2]);

                }
                else
                {
                    // animation:ƒ (key, url, xhrSettings)
                    // binary:ƒ (key, url, xhrSettings)
                    // glsl:ƒ (key, url, xhrSettings)
                    // image:ƒ (key, url, xhrSettings)
                    // image:ƒ (key, [url, normal-url], xhrSettings)
                    // json:ƒ (key, url, xhrSettings)
                    // plugin:ƒ (key, url, xhrSettings)
                    // script:ƒ (key, url, xhrSettings)
                    // svg:ƒ (key, url, xhrSettings)
                    // text:ƒ (key, url, xhrSettings)
                    // tilemapCSV:ƒ (key, url, xhrSettings)
                    // tilemapTiledJSON:ƒ (key, url, xhrSettings)
                    // tilemapWeltmeister:ƒ (key, url, xhrSettings)
                    // xml:ƒ (key, url, xhrSettings)
                    this.load[group](key, value);
                }

            }, this);
        }, this);

        // load dummy file to ensure loading gets completed
        this.load.image('dummy', 'Assets/images/dummy.jpg');

    }

    centerX ()
    {
        return this.sys.game.config.width / 2;
    }
    centerY ()
    {
        return this.sys.game.config.height / 2;
    }
}