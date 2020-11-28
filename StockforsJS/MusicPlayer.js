class MusicPlayer extends Phaser.Scene {

    constructor()
    {
        super('MusicPlayer');

        this.music;
        this.defaultVolume = 0.15;
    }

    preload() {

    }


    create() {

        // this.playSong('entrance')
    }


    playSong(key) {
        this.music = this.sound.removeAll();
        this.music = this.sound.add(key, this.defaultVolume, true);

        this.music.play();

        if (config.musicOn)
        {
            this.changeVolume(this.defaultVolume);
        }
        else
        {
            this.changeVolume(0);
        }

    }


    getVolume() {
        return this.music.volume;
    }


    changeVolume(value) {

        this.music.volume = value;

        if (value > 0)
        {
            this.music.mute = false;
        }
        
        else
        {
            this.music.mute = true;
        }

    }
}