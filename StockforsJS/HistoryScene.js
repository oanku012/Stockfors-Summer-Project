class HistoryScene extends Phaser.Scene{
    constructor(){
        super('HistoryScene');


    }

    create()
    {
        
        this.background = this.add.image(0, 0, 'MenuAtlas', 'UI Pohjat/Infokorttipohja').setScale(1.2, 1.6);


        this.container = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY - 20, [this.background]);

        
    }
}