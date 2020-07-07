class MuistiPeliScene extends Phaser.Scene {

    constructor() {
        super('MuistiPeliScene');

        this.cardCount = 16;
        this.columnCount = 4;

        this.cardSize = 160;

        this.cardArray = [];

        this.cardImages = [];

        this.eskimo = { src: 'Assets/images/Muistipeli/Eskimo', added: 0 };
        this.aino = { src: 'Assets/images/Muistipeli/Aino', added: 0 };
        this.katriina = { src: 'Assets/images/Muistipeli/Katriina', added: 0 };
        this.paula = { src: 'Assets/images/Muistipeli/Paula', added: 0 };
        this.punahilkka = { src: 'Assets/images/Muistipeli/Punahilkka', added: 0 };
        this.tupakka = { src: 'Assets/images/Muistipeli/Tupakka', added: 0 };
        this.koskenlaskija = { src: 'Assets/images/Muistipeli/Koskenlaskija', added: 0 };
        this.rana = { src: 'Assets/images/Muistipeli/Rana', added: 0 };

        this.openedCards = [];

        this.clicks = 0;
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

        card.frontIMG = document.createElement('img');
        card.frontIMG.src = img;
        card.frontIMG.style = 'width: ' + this.cardSize + 'px; height: ' + this.cardSize + 'px; backface-visibility: hidden; position: relative; left: ' + this.cardSize / 2 + 'px; top: ' + this.cardSize / 2 + 'px';

        card.backIMG = document.createElement('img');
        card.backIMG.src = 'Assets/images/Muistipeli/Takapuoli';
        card.backIMG.style = 'width: ' + this.cardSize + 'px; height: ' + this.cardSize + 'px; backface-visibility: hidden; position: relative; left: ' + this.cardSize / 2 + 'px; top: ' + this.cardSize / 2 + 'px';

        card.front = this.add.dom(x, y, card.frontIMG);
        card.front.setPerspective(config.width).setInteractive().setDepth(1);
        card.front.rotate3d.set(0, 1, 0, 180);

        //This was for clicking the front-side of the card, but it's not really necessary
        /*card.front.on('pointerup', function () {

            if (card.frontTween.isPlaying() == false && card.backTween.isPlaying() == false) {
                console.log('Clicked front of ' + img);

                this.RotateCard(card, false);
                card.back.setDepth(10);
                card.front.setDepth(1);
                

                card.open = false;
            }

        }, this);*/

        card.back = this.add.dom(x, y, card.backIMG);
        card.back.setPerspective(config.width).setInteractive().setDepth(10);
        card.back.rotate3d.set(0, 1, 0, 0);
        card.back.on('pointerup', function () {

            if (card.frontTween.isPlaying() == false && card.backTween.isPlaying() == false && this.openedCards.length<2) {
                console.log('Clicked back of ' + img);

                this.clicks++;

                this.RotateCard(card, true);

                this.openedCards.push(card);

                console.log('Cards opened: ' + this.openedCards.length);

                if (this.openedCards.length == 2) {

                    console.log(this.openedCards[0].frontIMG.src); 
                    console.log(this.openedCards[1].frontIMG.src); 

                    if (this.openedCards[0].frontIMG.src != this.openedCards[1].frontIMG.src) {

                        this.time.delayedCall(2000, function () {
                            this.openedCards.forEach(element => {
                                this.RotateCard(element, false);

                            });

                            this.openedCards = [];

                        }, null, this);

                    }
                    else
                    {
                        this.openedCards = [];

                        if(this.cardArray.every(function(current) {
                            return current.open == true;
                        })){
                            console.log('You won the game. Clicks: ' + this.clicks);
                        }
                    
                    }
                    
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