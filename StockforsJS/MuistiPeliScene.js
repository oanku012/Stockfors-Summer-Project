class MuistiPeliScene extends Phaser.Scene {

    constructor() {
        super('MuistiPeliScene');

        //Count of cards on the board
        this.cardCount;
        this.columnCount;

        this.cardSize;

        //Array of cards on the board
        this.cardArray;

        //Array of all the different card arts that can be randomly assigned for the cards on board
        this.cardImages;

        this.eskimo;
        this.aino;
        this.katriina;
        this.paula;
        this.punahilkka;
        this.tupakka;
        this.koskenlaskija;
        this.rana;

        this.openedCards;

        this.clicks;

        this.difficulty;

        //Array of all menu dom elements in the scene, used to hide them when opening options
        this.menuElements;
        this.cardElements;
    }

    create() {

        this.data = this.cache.json.get('data');

        this.data = this.data.Muistipeli;

        console.log('Muistipeli');

        //If all the dom elements are visible
        this.visible = true;

        this.gameEnded = false;

        this.clicks = 0;
        this.cardSize = 0;

        this.cardCount = 16;
        this.columnCount = 4;

        this.cardSize = 160;

        this.cardArray = [];
        this.openedCards = [];
        this.menuElements = [];
        this.cardElements = [];

        this.difficulty = 'normal';

        //Added is used to check how many copies of this card are on the board, used is for checking if the card was chosen to be included in the game
        this.eskimo = { src: 'Assets/images/Muistipeli/Eskimo', added: 0, used: false };
        this.aino = { src: 'Assets/images/Muistipeli/Aino', added: 0, used: false };
        this.katriina = { src: 'Assets/images/Muistipeli/Katriina', added: 0, used: false };
        this.paula = { src: 'Assets/images/Muistipeli/Paula', added: 0, used: false };
        this.punahilkka = { src: 'Assets/images/Muistipeli/Punahilkka', added: 0, used: false };
        this.tupakka = { src: 'Assets/images/Muistipeli/Tupakka', added: 0, used: false };
        this.koskenlaskija = { src: 'Assets/images/Muistipeli/Koskenlaskija', added: 0, used: false };
        this.rana = { src: 'Assets/images/Muistipeli/Rana', added: 0, used: false };

        this.cardImages = [this.eskimo, this.aino, this.katriina, this.paula, this.punahilkka, this.tupakka, this.koskenlaskija, this.rana];

        //On hindsight I'm not sure why I used dom elements for these when I only really needed them for the cards
        /*let startDiv = document.createElement('div');
        startDiv.style = 'background-color: brown; width: 200px; height: 100px; font: 48px Arial; font-weight: bold; text-align: center; position: relative; left: 100px; top: 50px;';
        startDiv.innerText = 'Start game';

        let easyDiv = document.createElement('div');
        easyDiv.style = 'background-color: brown; width: 200px; height: 100px; font: 48px Arial; font-weight: bold; text-align: center; position: relative; left: 100px; top: 50px;';
        easyDiv.innerText = 'Easy';

        let normalDiv = document.createElement('div');
        normalDiv.style = 'background-color: brown; width: 200px; height: 100px; font: 48px Arial; font-weight: bold; text-align: center; position: relative; left: 100px; top: 50px;';
        normalDiv.innerText = 'Normal';

        let hardDiv = document.createElement('div');
        hardDiv.style = 'background-color: brown; width: 200px; height: 100px; font: 48px Arial; font-weight: bold; text-align: center; position: relative; left: 100px; top: 50px;';
        hardDiv.innerText = 'Hard';

        let gameStart = this.add.dom(920, 320, startDiv);
        let easy = this.add.dom(700, 200, easyDiv);
        let normal = this.add.dom(920, 200, normalDiv);
        let hard = this.add.dom(1140, 200, hardDiv);*/
        //let gameStart = CreateTextButton(this, 920, 320, 'UI Buttons/OK', 'Start game');
        //let easy = CreateTextButton(this, 700, 200, 'UI Buttons/OK', 'Easy');
        //let normal = CreateTextButton(this, 920, 200, 'UI Buttons/OK', 'Normal');
        //let hard = CreateTextButton(this, 1140, 200, 'UI Buttons/OK', 'Hard');


        // kopsasin nää vaa nyt siitä palapelist
        let menu = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
        let menuBG = this.add.sprite(0, 0, 'menuBG');
        menu.add(menuBG);

        let easy = CreateTextButton(this, 0, -200, 'UI Buttons/Nappi', this.data.Easy);
        let normal = CreateTextButton(this, 0, 0, 'UI Buttons/Nappi', this.data.Normal);
        let hard = CreateTextButton(this, 0, 200, 'UI Buttons/Nappi', this.data.Hard);
        let back = CreateTextButton(this, -600, 300, 'UI Buttons/Takaisin', this.data.Exit);
        menu.add([easy, normal, hard, back]);

        easy.on('pointerup', function () {
            if (easy.pressed) {
                this.difficulty = 'easy';
                console.log('Selected: ' + this.difficulty);
                menu.destroy();
                this.StartGame(this.difficulty);
            }
        }, this);

        normal.on('pointerup', function () {
            if (normal.pressed) {
                this.difficulty = 'normal';
                menu.destroy();
                console.log('Selected: ' + this.difficulty);
                this.StartGame(this.difficulty);
            }
        }, this);

        hard.on('pointerup', function () {
            if (hard.pressed) {
                this.difficulty = 'hard';
                console.log('Selected: ' + this.difficulty);
                menu.destroy();
                this.StartGame(this.difficulty);
            }
        }, this);

        back.on('pointerup', function () {
            if (back.pressed) {
                this.scene.start(gameState.currentMap, { x: gameState.playerX, y: gameState.playerY });

            }
        }, this);

        /*gameStart.setInteractive();
        gameStart.on('pointerup', function () {



            this.StartGame(this.difficulty);

            this.menuElements = [];
            gameStart.destroy();
            easy.destroy();
            normal.destroy();
            hard.destroy();
            back.destroy();

        }, this);

        easy.setInteractive();
        easy.on('pointerdown', function () {

            this.difficulty = 'easy';
            console.log('Selected: ' + this.difficulty);

        }, this);

        normal.setInteractive();
        normal.on('pointerdown', function () {


            this.difficulty = 'normal';
            console.log('Selected: ' + this.difficulty);

        }, this);

        hard.setInteractive();
        hard.on('pointerdown', function () {


            this.difficulty = 'hard';
            console.log('Selected: ' + this.difficulty);

        }, this);*/

        this.menuElements.push(easy, normal, hard);


    }

    StartGame(difficulty) {
        let currentRow = 1;
        let currentColumn = 1;

        let cardsToUse = [];

        //Change count of cards for the game based on difficulty and randomly choose what card arts to use 
        if (difficulty == 'easy') {
            this.cardCount = 8;
            for (var i = 0; i < this.cardCount / 2; i++) {
                let cardToUse;

                //Check if card has already been chosen once
                do {
                    cardToUse = this.cardImages[Math.floor(Math.random() * this.cardImages.length)];
                }
                while (cardToUse.used == true)

                cardToUse.used = true;

                cardsToUse.push(cardToUse);
            }
        }
        else if (difficulty == 'normal') {
            this.cardCount = 16;
            for (var i = 0; i < this.cardCount / 2; i++) {
                let cardToUse;
                do {
                    cardToUse = this.cardImages[Math.floor(Math.random() * this.cardImages.length)];
                }
                while (cardToUse.used == true)

                cardToUse.used = true;

                cardsToUse.push(cardToUse);
            }
        }
        else if (difficulty == 'hard') {
            this.cardCount = 24;
            for (var i = 0; i < this.cardCount / 2; i++) {
                let cardToUse;
                do {
                    cardToUse = this.cardImages[Math.floor(Math.random() * this.cardImages.length)];
                }
                while (cardToUse.used == true)

                cardToUse.used = true;

                cardsToUse.push(cardToUse);
            }
        }

        //Add the cards to the board
        for (var i = 0; i < this.cardCount; i++) {

            if (i > (currentRow * this.columnCount) - 1) {
                currentRow++;
                currentColumn = 1;
            }

            let x = 600 + (currentColumn - 1) * (this.cardSize + 20);
            let y = 100 + (currentRow - 1) * (this.cardSize + 20);

            let image;

            do {
                image = cardsToUse[Math.floor(Math.random() * cardsToUse.length)];
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
        card.back.on('pointerdown', function () {

            if (card.frontTween.isPlaying() == false && card.backTween.isPlaying() == false && this.openedCards.length < 2) {

                console.log('Clicked back of ' + img);

                this.clicks++;

                this.RotateCard(card, true);

                this.openedCards.push(card);

                console.log('Cards opened: ' + this.openedCards.length);

                //If player revealed 2 cards
                if (this.openedCards.length == 2) {

                    //Close cards with a delay if they are not the same, otherwise check if all cards have been revealed
                    if (this.openedCards[0].frontIMG.src != this.openedCards[1].frontIMG.src) {

                        this.time.delayedCall(1000, function () {
                            this.openedCards.forEach(element => {
                                this.RotateCard(element, false);

                            });

                            this.openedCards = [];

                        }, null, this);

                    }
                    else {
                        this.openedCards = [];

                        //If every card has been revealed, win the game
                        if (this.cardArray.every(function (current) {
                            return current.open == true;
                        })) {

                            this.time.delayedCall(1000, function () {

                                //console.log('You won the game. Clicks: ' + this.clicks);

                                this.gameEnded = true;

                                this.HideCards(false);

                                /*let winDiv = document.createElement('div');
                                winDiv.style = 'background-color: brown; width: 400px; height: 150px; font: 40px Arial; font-weight: bold; text-align: center; position: relative; left: 100px; top: 50px';
                                winDiv.innerText = 'You won the game. \n Number of reveals: ' + this.clicks;
    
                                let win = this.add.dom(600, 100, winDiv);
                                win.setDepth(20).setDisplayOrigin(0);
    
                                let restartDiv = document.createElement('div');
                                restartDiv.style = 'background-color: brown; width: 400px; height: 100px; font: 40px Arial; font-weight: bold; text-align: center; position: relative; left: 100px; top: 50px';
                                restartDiv.innerText = 'Click to restart';
    
                                let restart = this.add.dom(600, 250, restartDiv);
                                restart.setDepth(20).setInteractive().setDisplayOrigin(0);*/

                                let win = CreateTextButton(this, this.cameras.main.centerX, 300, 'UI Buttons/Nappi', this.data.Win + this.clicks + '\n' + this.data.highScore).disableInteractive();
                                //let highScore = CreateTextButton(this, this.cameras.main.centerX, 350, 'UI Buttons/Nappi', this.data.HighScore).disableInteractive();
                                win.bg.setScale(1, 2);
                                let restart = CreateTextButton(this, this.cameras.main.centerX, 500, 'UI Buttons/OK', this.data.Restart);

                                restart.on('pointerup', function () {

                                    if (restart.pressed) {
                                        this.scene.restart();
                                    }

                                }, this);

                                if (this.difficulty == 'easy') {
                                    if (this.clicks < gameState.MPScoreEasy || gameState.MPScoreEasy == startingGameState.MPScoreEasy) {
                                        saveGame({ MPScoreEasy: this.clicks });

                                    }

                                    //highScore.text.text = this.data.HighScore + gameState.MPScoreEasy;
                                    win.text.text = this.data.Win + this.clicks + '\n' + this.data.HighScore + gameState.MPScoreEasy;
                                }
                                else if (this.difficulty == 'normal') {
                                    if (this.clicks < gameState.MPScoreMedium || gameState.MPScoreMedium == startingGameState.MPScoreMedium) {
                                        saveGame({ MPScoreMedium: this.clicks });
                                    }

                                    //highScore.text.text = this.data.HighScore + gameState.MPScoreMedium;
                                    win.text.text = this.data.Win + this.clicks + '\n' + this.data.HighScore + gameState.MPScoreEasy;


                                }
                                else if (this.difficulty == 'hard') {
                                    if (this.clicks < gameState.MPScoreHard || gameState.MPScoreHard == startingGameState.MPScoreHard) {
                                        saveGame({ MPScoreHard: this.clicks });
                                    }
                                    win.text.text = this.data.Win + this.clicks + '\n' + this.data.HighScore + gameState.MPScoreEasy;
                                    //highScore.text.text = this.data.HighScore + gameState.MPScoreHard;

                                }

                            }, null, this);
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

        this.cardElements.push(card.front, card.back);

        return card;

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

    update() {

        //Dom elements are hidden when options are opened
        if (optionsButton.open && this.visible) {

            this.HideCards(false);

        }
        else if (this.visible == false && optionsButton.open == false && this.gameEnded == false) {

            this.HideCards(true);

        }
    }

    //If reveal cards is true then reveal cards
    HideCards(revealCards) {
        if (!revealCards) {
            this.cardElements.forEach(function (element) {

                if (element) {
                    element.setVisible(false);
                    element.disableInteractive();
                }

            }, this);

            this.visible = false;
        }
        else {
            this.cardElements.forEach(function (element) {
                if (element) {
                    element.setVisible(true);
                    element.setInteractive();
                }
            }, this);

            this.visible = true;
        }
    }
}