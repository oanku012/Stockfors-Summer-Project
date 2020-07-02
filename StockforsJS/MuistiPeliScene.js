class MuistiPeliScene extends Phaser.Scene {

    constructor() {
        super('MuistiPeliScene');

        this.element
    }

    create() {
        //Ei toimi tää shittipaska
        console.log('Muistipeli');

        let div = document.createElement('div');
        div.style = 'background-color: red; width: 220px; height: 100px; font: 48px Arial; font-weight: bold';
        div.innerText = 'Phaser 3';

        this.element = this.add.dom(this, 400, 300, div);
        this.element.setPerspective(800);
        this.element.rotate3d.set(0, 1, 0, 0);

        this.tweens.add({
            targets: this.element.rotate3d,
            w: 80,
            duration: 3000,
            ease: 'Sine.easeInOut',
            loop: -1,
            yoyo: true
        });
    }
}