class MuistiPeliScene extends Phaser.Scene {

    constructor() {
        super('MuistiPeliScene');

        this.cardCount = 16;
        this.columnCount = 4;

        this.cardSize = 160;

        this.cardArray = [];

        this.cardImages = [];

        this.eskimo = { src: 'Assets/images/Muistipeli/Kortti (1)', added: 0 };
        this.aino = { src: 'Assets/images/Muistipeli/Kortti (2)', added: 0 };
        this.katriina = { src: 'Assets/images/Muistipeli/Kortti (3)', added: 0 };
        this.paula = { src: 'Assets/images/Muistipeli/Kortti (4)', added: 0 };
        this.punahilkka = { src: 'Assets/images/Muistipeli/Kortti (5)', added: 0 };
        this.tupakka = { src: 'Assets/images/Muistipeli/Kortti (6)', added: 0 };
        this.koskenlaskija = { src: 'Assets/images/Muistipeli/Kortti (7)', added: 0 };
        this.rana = { src: 'Assets/images/Muistipeli/Kortti (8)', added: 0 };

        this.openedCards = [];
    }

    create() {

        console.log('Muistipeli');

        this.cardImages.push(this.eskimo, this.aino, this.katriina, this.paula, this.punahilkka, this.tupakka, this.koskenlaskija, this.rana);

        let currentRow = 1;
        let currentColumn = 1;

        for (var i = 0; i < this.cardCount; i++) {

            if (i > (currentRow * this.columnCount) - 1) {
                currentRow++;
                currentColumn = 1;
            }

            let x = 600 + (currentColumn - 1) * (this.cardSize + 20);
            let y = 100 + (currentRow - 1) * (this.cardSize + 20);

            let image;

            do {
                image = this.cardImages[Math.floor(Math.random() * this.cardImages.length)];
            }
            while (image.added == 2)

            image.added++;

            this.cardArray.push(this.CreateCard(image.src, x, y, i));

            currentColumn++;
        }

    }

    CreateCard(img, x, y, index) {
        let card = {};

        card.frontTween;
        card.backTween;
        card.index = index;

        let frontIMG = document.createElement('img');
        frontIMG.src = img;
        frontIMG.style = 'width: ' + this.cardSize + 'px; height: ' + this.cardSize + 'px; backface-visibility: hidden; position: relative; left: ' + this.cardSize / 2 + 'px; top: ' + this.cardSize / 2 + 'px';

        let backIMG = document.createElement('img');
        backIMG.src = 'Assets/images/Muistipeli/Kortti (9)';
        backIMG.style = 'width: ' + this.cardSize + 'px; height: ' + this.cardSize + 'px; backface-visibility: hidden; position: relative; left: ' + this.cardSize / 2 + 'px; top: ' + this.cardSize / 2 + 'px';

        card.front = this.add.dom(x, y, frontIMG);
        card.front.setPerspective(config.width).setInteractive().setDepth(1);
        card.front.rotate3d.set(0, 1, 0, 180);

        /*card.front.on('pointerup', function () {

            if (card.frontTween.isPlaying() == false && card.backTween.isPlaying() == false) {
                console.log('Clicked front of ' + img);

                this.RotateCard(card, false);
                card.back.setDepth(10);
                card.front.setDepth(1);
                

                card.open = false;
            }

        }, this);*/

        card.back = this.add.dom(x, y, backIMG);
        card.back.setPerspective(config.width).setInteractive().setDepth(10);
        card.back.rotate3d.set(0, 1, 0, 0);
        card.back.on('pointerup', function () {

            if (card.frontTween.isPlaying() == false && card.backTween.isPlaying() == false) {
                console.log('Clicked back of ' + img);

                this.RotateCard(card, true);

                this.openedCards.push(card);

                if (this.openedCards.length == 2) {
                    this.time.delayedCall(2000, function () {
                        this.openedCards.forEach(element => {
                            this.RotateCard(element, false);

                        });

                        this.openedCards = [];

                    }, this);
                }
            }

        }, this);

        //These two are just added so the code can check if the tween is currently playing on the first click
        card.frontTween = this.tweens.add({
            targets: card.front.rotate3d,
            w: -360,
            duration: 1000,
            ease: 'Sine.easeInOut',
            paused: true
        });

        card.backTween = this.tweens.add({
            targets: card.back.rotate3d,
            w: -180,
            duration: 1000,
            ease: 'Sine.easeInOut',
            paused: true
        });

        return card;

    }

    update() {

    }

    RotateCard(card, reveal) {


        if (reveal == true) {

            card.frontTween = this.tweens.add({
                targets: card.front.rotate3d,
                w: 360,
                duration: 500,
                ease: 'Sine.easeInOut',
            });

            card.backTween = this.tweens.add({
                targets: card.back.rotate3d,
                w: 180,
                duration: 500,
                ease: 'Sine.easeInOut',
            });

            card.back.setDepth(1);
            card.front.setDepth(10);
            card.open = true;

        }
        else {

            card.frontTween = this.tweens.add({
                targets: card.front.rotate3d,
                w: 180,
                duration: 500,
                ease: 'Sine.easeInOut',
            });

            card.backTween = this.tweens.add({
                targets: card.back.rotate3d,
                w: 0,
                duration: 500,
                ease: 'Sine.easeInOut',
            });

            card.back.setDepth(10);
            card.front.setDepth(1);
            card.open = false;

        }





    }
}