class MuistiPeliScene extends Phaser.Scene {

    constructor() {
        super('MuistiPeliScene');

        this.element;
        this.frontTween;
        this.backTween;

    }

    create() {

        console.log('Muistipeli');

        let frontDiv = document.createElement('div');
        frontDiv.style = 'background-color: green; width: 220px; height: 100px; font: 48px Arial; font-weight: bold; backface-visibility: hidden;';
        frontDiv.innerText = 'Front';

        let backDiv = document.createElement('div');
        backDiv.style = 'background-color: red; width: 220px; height: 100px; font: 48px Arial; font-weight: bold; backface-visibility: hidden;';
        backDiv.innerText = 'Back';

        this.cardFront = this.add.dom(800, 300, frontDiv);
        this.cardFront.setPerspective(config.width).setInteractive().setDepth(10);
        this.cardFront.rotate3d.set(0, 1, 0, 0);
        this.cardFront.on('pointerdown', function () {

            if (this.frontTween.isPlaying() == false && this.backTween.isPlaying() == false) {
                console.log('Clicked front of the card.');

                this.RotateCard(false);
                this.cardBack.setDepth(10);
                this.cardFront.setDepth(1);
            }

        }, this);

        this.cardBack = this.add.dom(800, 300, backDiv);
        this.cardBack.setPerspective(config.width).setInteractive().setDepth(1);
        this.cardBack.rotate3d.set(0, 1, 0, 180);
        this.cardBack.on('pointerdown', function () {

            if (this.frontTween.isPlaying() == false && this.backTween.isPlaying() == false) {
                console.log('Clicked back of the card.');

                this.RotateCard(true);
                this.cardBack.setDepth(1);
                this.cardFront.setDepth(10);
            }

        }, this);


        this.frontTween = this.tweens.add({
            targets: this.cardFront.rotate3d,
            w: 180,
            duration: 1000,
            ease: 'Sine.easeInOut',
            paused: true
        });

        this.backTween = this.tweens.add({
            targets: this.cardBack.rotate3d,
            w: 360,
            duration: 1000,
            ease: 'Sine.easeInOut',
            paused: true
        });


    }

    RotateCard(goBackward) {


        if (goBackward == true) {

            this.frontTween = this.tweens.add({
                targets: this.cardFront.rotate3d,
                w: 0,
                duration: 1000,
                ease: 'Sine.easeInOut',
            });

            this.backTween = this.tweens.add({
                targets: this.cardBack.rotate3d,
                w: 180,
                duration: 1000,
                ease: 'Sine.easeInOut',
            });
        }
        else {

            this.frontTween = this.tweens.add({
                targets: this.cardFront.rotate3d,
                w: 180,
                duration: 1000,
                ease: 'Sine.easeInOut',
            });

            this.backTween = this.tweens.add({
                targets: this.cardBack.rotate3d,
                w: 360,
                duration: 1000,
                ease: 'Sine.easeInOut',
            });
        }





    }
}