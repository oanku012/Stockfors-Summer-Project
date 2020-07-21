class PalapeliScene extends Phaser.Scene {

    constructor() {
        super('PalapeliScene');

        this.PIECE_WIDTH = 200;
        this.PIECE_HEIGHT = 200;
        this.BOARD_COLS;
        this.BOARD_ROWS;

        this.piecesGroup;
        this.piecesAmount;
        this.shuffledIndexArray = [];

        this.board;

        this.gameWon = false;
    }

    preload() {
        // Probably move this to assets.json once the game is working
        this.load.spritesheet("puzzleBackground", "Assets/images/palapeli/patruunantalo.jpg", { "frameWidth": this.PIECE_WIDTH, "frameHeight": this.PIECE_HEIGHT } );
    }

    create() {

        this.prepareBoard();

        // code for clicking on pieces
        this.input.on('gameobjectdown', function (pointer, gameObject) {

            console.log("Piece " + gameObject.name + " clicked.");
            this.selectPiece(gameObject);
    
        }, this);


        // Win game button for testing, remove when finished
        var keyObj = this.input.keyboard.addKey('W');
            keyObj.on('up', function(event) { this.finishGame(); }, this);

    }


    prepareBoard() {
        this.gameWon = false;

        var piecesIndex = 0,
            i, j,
            piece;

        
        // currently set for 800x600 res since that seems to be the only one the base background works with
        this.BOARD_COLS = Math.floor(800 / this.PIECE_WIDTH);
        this.BOARD_ROWS = Math.floor(600 / this.PIECE_HEIGHT);
        

        this.piecesAmount = this.BOARD_COLS * this.BOARD_ROWS;

        this.shuffledIndexArray = this.createShuffledIndexArray();

        this.piecesGroup = this.add.group();

        this.board = this.add.container(this.cameras.main.centerX *.5, this.cameras.main.centerY *.5);
        

        for (i = 0; i < this.BOARD_ROWS; i++)
        {
            for (j = 0; j < this.BOARD_COLS; j++)
            {
                if (this.shuffledIndexArray[piecesIndex])
                {
                    piece = this.piecesGroup.create(j * this.PIECE_WIDTH, i * this.PIECE_HEIGHT, "puzzleBackground", this.shuffledIndexArray[piecesIndex]);
                }
                else
                {
                    piece = this.piecesGroup.create(j * this.PIECE_WIDTH, i * this.PIECE_HEIGHT);
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

        this.piecesGroup.children.each(function(element) {
            console.log(element.name);
        });
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
            var container = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);

            var style = { font: "60px Arial", fill: "white", align: "center"};
            var text = this.add.text(0, 0, "Congratulations! \nYou made it!", style);
            container.add(text);

            // Todo add buttons for restart or exit
    
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