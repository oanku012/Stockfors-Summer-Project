class PalapeliScene extends Phaser.Scene {

    constructor() {
        super('PalapeliScene');

        this.difficulties = {
            EASY: 'easy',
            MEDIUM: 'medium',
            HARD: 'hard'
        }

        this.difficulty;


        this.PIECE_WIDTH = 200;
        this.PIECE_HEIGHT = 200;
        this.BOARD_COLS;
        this.BOARD_ROWS;

        this.piecesGroup;
        this.piecesAmount;
        this.shuffledIndexArray = [];

        this.board;

        this.totalMoves = 0;

        this.gameWon = false;
    }

    preload() {
        // Probably move this to assets.json once the game is working
        this.load.spritesheet("puzzleEasy", "Assets/images/palapeli/patruunantalo_easy.jpg", { "frameWidth": this.PIECE_WIDTH, "frameHeight": this.PIECE_HEIGHT } );
        this.load.spritesheet("puzzleMedium", "Assets/images/palapeli/patruunantalo_medium.jpg", { "frameWidth": this.PIECE_WIDTH, "frameHeight": this.PIECE_HEIGHT } );
        this.load.spritesheet("puzzleHard", "Assets/images/palapeli/patruunantalo_hard.jpg", { "frameWidth": this.PIECE_WIDTH, "frameHeight": this.PIECE_HEIGHT } );
        this.load.spritesheet("blackPiece", "Assets/images/palapeli/black.jpg", { "frameWidth": this.PIECE_WIDTH, "frameHeight": this.PIECE_HEIGHT } );
    }

    create() {
        
        this.data = this.cache.json.get('data').Palapeli;

        this.createMainMenu();

    }

    createMainMenu()
    {
        this.cameras.main.backgroundColor.setTo(255, 255, 255);

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

        // difficulty menu
        this.menu = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
        let menuBG = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/Pelipohja').setScale(0.55, 0.3);
        //let menuBG = this.add.sprite(0, 0, 'MenuAtlas', 'UI Pohjat/Pelipohja').setScale(0.25, 0.32);
        this.menu.add(menuBG);

        this.menu.bg = menuBG;

        let easyButton = CreateTextButton(this, -330, 200, 'UI Buttons/Nappi', this.data.Easy).setScale(0.8);
        let mediumButton = CreateTextButton(this, 0, 200, 'UI Buttons/Nappi', this.data.Normal).setScale(0.8);
        let hardButton = CreateTextButton(this, 330, 200, 'UI Buttons/Nappi', this.data.Hard).setScale(0.8);
        let back = CreateTextButton(this, 200, 1000, 'UI Buttons/Takaisin', this.data.Exit);

        this.menu.add([easyButton, mediumButton, hardButton, title, description]);

        easyButton.on('pointerup', function () {
            if (easyButton.pressed) {
                
                //menu.destroy();
                easyButton.destroy();
                mediumButton.destroy();
                hardButton.destroy();
                title.destroy();
                description.destroy();
                menuBG.setScale(0.4, 0.4);
                this.setupGame(this.difficulties.EASY);
            }
        }, this);

        mediumButton.on('pointerup', function () {
            if (mediumButton.pressed) {
                
                //menu.destroy();
                easyButton.destroy();
                mediumButton.destroy();
                hardButton.destroy();
                title.destroy();
                description.destroy();
                menuBG.setScale(0.5, 0.38);
                this.setupGame(this.difficulties.MEDIUM);
            }
        }, this);

        hardButton.on('pointerup', function () {
            if (hardButton.pressed) {
                
                //menu.destroy();
                easyButton.destroy();
                mediumButton.destroy();
                hardButton.destroy();
                title.destroy();
                description.destroy();
                menuBG.setScale(0.5, 0.5);
                this.setupGame(this.difficulties.HARD);
            }
        }, this);

        back.on('pointerup', function () {
            if (back.pressed) {
                this.scene.start('PatruunantaloScene');

            }
        }, this);

    }

    setupGame(difficulty)
    {
        this.totalMoves = 0;

        this.prepareBoard(difficulty);

        // code for clicking on pieces
        this.input.on('gameobjectdown', function (pointer, gameObject) {

            console.log("Piece " + gameObject.name + " clicked.");
            this.selectPiece(gameObject);
    
        }, this);


        // Win game button for testing, remove when finished
        var keyObj = this.input.keyboard.addKey('W');
            keyObj.on('up', function(event) { this.finishGame(); }, this);
    }


    prepareBoard(difficulty) {

        let back = CreateTextButton(this, 0, (this.menu.bg.height/2) * this.menu.bg.scaleY, 'UI Buttons/Nappi', this.data.Restart).setScale(0.7);

        back.on('pointerup', function()
        {
            if(back.pressed)
            {
                this.scene.restart();
            }
        }, this);

        this.menu.add(back);

        this.gameWon = false;

        var piecesIndex = 0,
            i, j,
            piece;

        switch (difficulty)
        {
            // Make sure the photos used for the game have the same resolutions that are used here
            case this.difficulties.EASY:
                this.BOARD_COLS = Math.floor(600 / this.PIECE_WIDTH);
                this.BOARD_ROWS = Math.floor(600 / this.PIECE_HEIGHT);
                this.board = this.add.container(this.cameras.main.centerX - 570 * .35, this.cameras.main.centerY - 500 * .4);
                console.log("EASY game started");
                break;

            case this.difficulties.MEDIUM:
                this.BOARD_COLS = Math.floor(800 / this.PIECE_WIDTH);
                this.BOARD_ROWS = Math.floor(600 / this.PIECE_HEIGHT);
                this.board = this.add.container(this.cameras.main.centerX - 850 * .35, this.cameras.main.centerY - 500 * .4);
                console.log("MEDIUM game started");
                break;

            case this.difficulties.HARD:
                this.BOARD_COLS = Math.floor(800 / this.PIECE_WIDTH);
                this.BOARD_ROWS = Math.floor(800 / this.PIECE_HEIGHT);
                this.board = this.add.container(this.cameras.main.centerX - 850 * .35, this.cameras.main.centerY - 750 * .4);
                console.log("HARD game started");
                break;
        }
        

        this.piecesAmount = this.BOARD_COLS * this.BOARD_ROWS;

        this.shuffledIndexArray = this.createShuffledIndexArray();

        this.piecesGroup = this.add.group();


        for (i = 0; i < this.BOARD_ROWS; i++)
        {
            for (j = 0; j < this.BOARD_COLS; j++)
            {
                if (this.shuffledIndexArray[piecesIndex])
                {

                    switch (difficulty)
                    {
                        case this.difficulties.EASY:
                            piece = this.piecesGroup.create(j * this.PIECE_WIDTH, i * this.PIECE_HEIGHT, "puzzleEasy", this.shuffledIndexArray[piecesIndex]);
                            break;

                        case this.difficulties.MEDIUM:
                            piece = this.piecesGroup.create(j * this.PIECE_WIDTH, i * this.PIECE_HEIGHT, "puzzleMedium", this.shuffledIndexArray[piecesIndex]);
                            break;

                        case this.difficulties.HARD:
                            piece = this.piecesGroup.create(j * this.PIECE_WIDTH, i * this.PIECE_HEIGHT, "puzzleHard", this.shuffledIndexArray[piecesIndex]);
                            break;
                    }
                }
                else
                {
                    piece = this.piecesGroup.create(j * this.PIECE_WIDTH, i * this.PIECE_HEIGHT, 'blackPiece', 0, false);
                    piece.black = true;
                }

                piece.name = 'piece' + i.toString() + 'x' + j.toString();
                piece.currentIndex = piecesIndex;
                piece.destIndex = this.shuffledIndexArray[piecesIndex];
                piece.inputEnabled = true;
                piece.setInteractive();
                this.board.add(piece);
                piece.posX = j;
                piece.posY = i;
                piecesIndex++;
            }
        }

    }

    selectPiece(piece) {

        var blackPiece = this.canMove(piece);

        // check if there is a black tile where we can move piece to
        if (blackPiece) {
            this.movePiece(piece, blackPiece);
        }
    }

    canMove(piece) {
        var foundBlackElem = false;

        this.piecesGroup.children.each(function(element) {
            if (element.posX === (piece.posX - 1) && element.posY === piece.posY && element.black ||
            element.posX === (piece.posX + 1) && element.posY === piece.posY && element.black ||
            element.posY === (piece.posY - 1) && element.posX === piece.posX && element.black ||
            element.posY === (piece.posY + 1) && element.posX === piece.posX && element.black) 
            {
                foundBlackElem = element;
                return;
            }
        });

        return foundBlackElem;
    }

    movePiece(piece, blackPiece) {
        var tmpPiece = {
            posX: piece.posX,
            posY: piece.posY,
            currentIndex: piece.currentIndex
        };
  
        //this.add.tween(piece).to({x: blackPiece.posX * this.PIECE_WIDTH, y: blackPiece.posY * this.PIECE_HEIGHT}, 300, Phaser.Easing.Linear.None, true);
        
        this.tweens.add({
            targets: [piece],
            x: blackPiece.posX * this.PIECE_WIDTH,
            y: blackPiece.posY * this.PIECE_HEIGHT,
            duration: 60
        });

        //change places of piece and blackPiece
        piece.posX = blackPiece.posX;
        piece.posY = blackPiece.posY;
        piece.currentIndex = blackPiece.currentIndex;
        piece.name ='piece' + piece.posX.toString() + 'x' + piece.posY.toString();

        //piece is the new black
        blackPiece.posX = tmpPiece.posX;
        blackPiece.posY = tmpPiece.posY;
        blackPiece.currentIndex = tmpPiece.currentIndex;
        blackPiece.name ='piece' + blackPiece.posX.toString() + 'x' + blackPiece.posY.toString();

        this.totalMoves++;

        this.checkIfFinished();
    }

    checkIfFinished() {
        var isFinished = true;

        this.piecesGroup.children.each(function(element) {
            if (element.currentIndex !== element.destIndex) {
                isFinished = false;
                return;
            }
        });
    
        if (isFinished) {
            this.finishGame();
        }
    }

    finishGame() {
        if (!this.gameWon)
        {

            // end game menu
            let menu = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
            let menuBG = this.add.sprite(0, 0, 'menuBG');

            /*
            var style = { font: "40px Arial", fill: "black", align: "center"};
            var winText = this.add.text(-200, -100, this.data.Win, style);
            var movesText = this.add.text(0, 0, this.data.Win, style);
            */

            let style = {
                font: '40px Arial',
                fill: 'black',
                wordWrap: { width: 600 }
            };
    
            let winText = this.make.text({
                x: 0,
                y: -200,
                text: this.data.Win,
                origin: { x: 0.5, y: 0.5 },
                style: style
            });

            let movesText = this.make.text({
                x: 0,
                y: -100,
                text: this.data.TotalMoves + this.totalMoves,
                origin: { x: 0.5, y: 0.5 },
                style: style
            });

            let button = CreateTextButton(this, 0, 200, 'UI Buttons/Nappi', this.data.BackToMenu);
    
            menu.add([menuBG, winText, movesText, button]);

            button.on('pointerup', function () {
                if (button.pressed) {
                    this.scene.start(this);
    
                }
            }, this);
        }
        
        this.gameWon = true;
    }
    
    createShuffledIndexArray() {
        var indexArray = [];

        for (var i = 0; i < this.piecesAmount; i++)
        {
            indexArray.push(i);
        }
    
        return this.shuffle(indexArray);
    }

    shuffle(array) {
        var counter = array.length,
        temp,
        index;

        while (counter > 0)
        {
            index = Math.floor(Math.random() * counter);

            counter--;

            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
        }


}