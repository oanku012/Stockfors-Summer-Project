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

    preload()
    {
        //this.load.image('background', 'Assets/images/Albums/Pakkausmuseo/Pakkausmuseo.jpg');
    }

    create() {

        rescaleSceneEvent(this);

        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;

        this.add.image(this.centerX, this.centerY, 'PakkausImage3').setScale(1.3);

        this.cameras.main.backgroundColor.setTo(255, 255, 255);

        this.data = this.cache.json.get('data').Muistipeli;

        let title = this.make.text({
            x: 0,
            y: -220,
            text: this.data.Title,
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: '64px LexendTera',
                fill: 'black',
                //backgroundColor: '#747474',
                
            }
        });

        title.setShadow(5, 5, 'grey', 5, false, true);

        let description = this.make.text({
            x: -480,
            y: -20,
            text: this.data.Description,
            origin: { x: 0, y: 0.5 },
            style: {
                font: '40px Carme',
                fill: 'black',
                wordWrap: { width: 980 }
                //backgroundColor: '#747474',
                
            }
        });

        console.log('Muistipeli');

        //If all the dom elements are visible
        this.visible = true;

        this.gameEnded = false;

        this.clicks = 0;

        this.cardCount = 16;
        this.columnCount = 4;

        this.cardSize = 0.05*window.devicePixelRatio * (window.innerWidth + window.innerHeight);

        this.cardArray = [];
        this.openedCards = [];
        this.menuElements = [];
        this.cardElements = [];
        this.cardImages = [];

        this.difficulty = 'normal';

        //Added is used to check how many copies of this card are on the board, used is for checking if the card was chosen to be included in the game
        for(let i = 1; i<29; i++)
        {
            this.cardImages.push({ src: 'Assets/images/Muistipeli/Kortti'+ i +'.png', added: 0, used: false })
        }

        // kopsasin nää vaa nyt siitä palapelist
        this.menu = this.add.container(this.centerX, this.centerY - 3).setScale(0.9);
        let menuBG = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/Pelipohja').setScale(0.55, 0.3);

        this.menu.bg = menuBG;

        let easy = CreateTextButton(this, -330, 200, 'UI Buttons/Nappi', this.data.Easy).setScale(0.8);
        let normal = CreateTextButton(this, 0, 200, 'UI Buttons/Nappi', this.data.Normal).setScale(0.8);
        let hard = CreateTextButton(this, 330, 200, 'UI Buttons/Nappi', this.data.Hard).setScale(0.8);
        this.exit = CreateTextButton(this, 170, 70, 'UI Buttons/Takaisin', this.data.Exit).setScale(0.8);
        
        this.menu.add([menuBG, title, description, easy, normal, hard]);

        easy.on('pointerup', function () {
            if (easy.pressed) {
                this.difficulty = 'easy';
                console.log('Selected: ' + this.difficulty);
                easy.destroy();
                normal.destroy();
                hard.destroy();
                title.destroy();
                description.destroy();
                menuBG.setScale(0.5, 0.4);
                this.StartGame(this.difficulty);
                
            }
        }, this);

        normal.on('pointerup', function () {
            if (normal.pressed) {
                this.difficulty = 'normal';
                easy.destroy();
                normal.destroy();
                hard.destroy();
                description.destroy();
                title.destroy();
                console.log('Selected: ' + this.difficulty);
                menuBG.setScale(0.6, 0.5);
                this.StartGame(this.difficulty);
                
            }
        }, this);

        hard.on('pointerup', function () {
            if (hard.pressed) {
                this.difficulty = 'hard';
                console.log('Selected: ' + this.difficulty);
                easy.destroy();
                normal.destroy();
                hard.destroy();
                title.destroy();
                description.destroy();
                menuBG.setScale(0.7, 0.56);
                this.StartGame(this.difficulty);
            }
        }, this);

        this.exit.on('pointerup', function () {
            if (this.exit.pressed) {
                this.scene.start('PakkausmuseoScene');

            }
        }, this);

        this.menuElements.push(easy, normal, hard);

        this.scale.on('resize', this.resize, this);

        if ((this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) && this.scale.orientation === Phaser.Scale.PORTRAIT) {
            this.exit.setPosition(this.centerX - getWindowWidth() * 0.35, this.centerY + getWindowHeight() * 0.4);
        }
        else {
            this.exit.setPosition(this.centerX - getWindowWidth() * 0.4, this.centerY + getWindowHeight() * 0.4);

        }

        rescaleObjects(this.exit, this, 0.00025, 0.00030);
        rescaleObjects(this.menu, this, 0.0003, 0.0003);

    }

    resize()
    {
        if (this.scene.isActive(this.scene.key)) {
            if ((this.sys.game.device.os.iOS || this.sys.game.device.os.iPhone || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) && this.scale.orientation === Phaser.Scale.PORTRAIT) {
                this.exit.setPosition(this.centerX - getWindowWidth() * 0.35, this.centerY + getWindowHeight() * 0.4);
            }
            else {
                this.exit.setPosition(this.centerX - getWindowWidth() * 0.4, this.centerY + getWindowHeight() * 0.4);

            }

            rescaleObjects(this.exit, this, 0.00025, 0.00030);
            rescaleObjects(this.menu, this, 0.0003, 0.0003);

            /*this.cardElements.forEach((card) => {
                rescaleObjects(card, this, 0.0002, 0.0002);
            }, this);*/

        }
    }

    StartGame(difficulty) {


        let back = CreateTextButton(this, 0, (this.menu.bg.height/2) * this.menu.bg.scaleY, 'UI Buttons/Nappi', this.data.Back).setScale(0.7);

        back.on('pointerup', function()
        {
            if(back.pressed)
            {
                this.scene.restart();
            }
        }, this);

        this.menu.add(back);

        this.menu.back = back;

        let currentRow = 1;
        let currentColumn = 1;

        let cardsToUse = [];

        let startX = getWindowWidth()*0.27;

        //Change count of cards for the game based on difficulty and randomly choose what card arts to use 
        if (difficulty == 'easy') {
            this.cardCount = 12;
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
            this.cardCount = 20;
            this.columnCount = 5;
            startX = 544;
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
            this.cardCount = 30;
            this.columnCount = 6;
            startX = 460;
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

        let rowCount = this.cardCount/this.columnCount;

        //Made this to make it easier to position the cards
        this.cardContainer = this.add.container(0, 0);

        //this.menu.add(this.cardContainer);

        //Add the cards to the board
        for (var i = 0; i < this.cardCount; i++) {

            if (i > (currentRow * this.columnCount) - 1) {
                currentRow++;
                currentColumn = 1;
            }

            //let x = startX + (currentColumn - 1) * (this.cardSize + 20);
            let x = ((this.centerX -((this.cardSize/2)+this.cardSize*0.05)*this.columnCount) + (currentColumn - 1) * (this.cardSize + this.cardSize*0.1));
            //Should position the cards roughly on the center of the screen regardless of the amount
            let y = (this.centerY - ((this.cardSize/2) + this.cardSize*0.05) * rowCount )+ (currentRow - 1) * (this.cardSize + this.cardSize*0.1);
            //let y = (-((this.cardSize/2) + 10) * rowCount )+ (currentRow - 1) * (this.cardSize + 20);

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
        //card.frontIMG.style = 'width: ' + this.cardSize + 'px; height: ' + this.cardSize + 'px; backface-visibility: hidden; position: relative; left: ' + this.cardSize / 2 + 'px; top: ' + this.cardSize / 2 + 'px';
        card.frontIMG.style = 'width: ' + this.cardSize + 'px; height: ' + this.cardSize + 'px; backface-visibility: hidden; position: relative; left: ' + this.cardSize / 2 + 'px; top: ' + this.cardSize / 2 + 'px; transform-origin: 100% 100%';

        card.backIMG = document.createElement('img');
        card.backIMG.src = 'Assets/images/Muistipeli/Korttipohja.png';
        card.backIMG.style = 'width: ' + this.cardSize + 'px; height: ' + this.cardSize + 'px; backface-visibility: hidden; position: relative; left: ' + this.cardSize / 2 + 'px; top: ' + this.cardSize / 2 + 'px; transform-origin: 100% 100%';

        card.front = this.add.dom(x, y, card.frontIMG);
        card.front.setPerspective(getWindowWidth()).setInteractive().setDepth(1);
        card.front.rotate3d.set(0, 1, 0, 180);

        card.back = this.add.dom(x, y, card.backIMG);
        card.back.setPerspective(getWindowWidth()).setInteractive().setDepth(10);
        card.back.rotate3d.set(0, 1, 0, 0);
        
        //For debugging
        /*let graphics = this.add.graphics();

        graphics.fillRectShape(card.back);*/

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

                                let title = this.make.text({
                                    x: this.centerX,
                                    y: this.centerY - 75,
                                    text: this.data.Congratz,
                                    origin: { x: 0.5, y: 0.5 },
                                    style: {
                                        font: '64px LexendTera',
                                        fill: 'black'
                                        
                                    }
                                });
                        
                                title.setShadow(5, 5, 'grey', 5, false, true);
                        
                                let description = this.make.text({
                                    x: this.centerX,
                                    y: this.centerY + 25,
                                    text: this.data.Win,
                                    origin: { x: 0.5, y: 0.5 },
                                    style: {
                                        font: '40px Carme',
                                        fill: 'black',
                                        wordWrap: { width: 980 },
                                        align: 'center'
                                        
                                    }
                                });

                                this.menu.bg.setScale(0.5, 0.16);
                                this.menu.back.setPosition(0, (this.menu.bg.height/2) * this.menu.bg.scaleY);

                                if (this.difficulty == 'easy') {
                                    if (this.clicks < gameState.MPScoreEasy || gameState.MPScoreEasy == startingGameState.MPScoreEasy) {
                                        saveGame({ MPScoreEasy: this.clicks });

                                    }
                                    description.text = this.data.Win + this.clicks + '\n' + this.data.HighScore + gameState.MPScoreEasy;

                                }
                                else if (this.difficulty == 'normal') {
                                    if (this.clicks < gameState.MPScoreMedium || gameState.MPScoreMedium == startingGameState.MPScoreMedium) {
                                        saveGame({ MPScoreMedium: this.clicks });
                                    }
                                    description.text = this.data.Win + this.clicks + '\n' + this.data.HighScore + gameState.MPScoreMedium;


                                }
                                else if (this.difficulty == 'hard') {
                                    if (this.clicks < gameState.MPScoreHard || gameState.MPScoreHard == startingGameState.MPScoreHard) {
                                        saveGame({ MPScoreHard: this.clicks });
                                    }
                                    description.text = this.data.Win + this.clicks + '\n' + this.data.HighScore + gameState.MPScoreHard;

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

        //this.cardContainer.add([card.front, card.back]);

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