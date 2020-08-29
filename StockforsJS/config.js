//const { Game } = require("phaser");

var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    soundOn: true,
    musicOn: true,
    language: 'FI',
    parent: 'game',

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: 'game',
        orientation: Phaser.Scale.Orientation.LANDSCAPE
    },

    dom: {
        createContainer: true
    },

    fps: {
        //target: 60,
        //forceSetTimeOut: true
    },

    physics: {
        default: 'matter',
        matter: {
            debug: false,
            enablesleeping: true,
            gravity: {
                y: 0
            }
            
        },
        arcade: {
            //gravity: { y: 0 },
            debug: true
        }
    },


    //Make sure UI scene is last so that it will always appear at the top
    scene: [BootScene, PreloadScene, OpeningScene, StockforsScene, BuildingScene, KirkkoScene, PatruunantaloScene, PakkausmuseoScene, OptionsMenuScene, CreditsScene, MuistiPeliScene, PalapeliScene,  KaarihalliScene, TallirakennusScene, SceneLoader, HistoryScene, HunajataloScene, PaloasemaScene, HiomoScene, PiippuhalliScene, HallirakennusScene, LintuhoitolaScene, UI]


};

//If pointer is over UI-elements
var pointerOverUI;

//Put this here so I can easily reference it in the options menu scene and muistipeliscene
var optionsButton;
var historyButton;

//Whether if player is ready to move
var readyToMove = false;

//Collision layers, these are global because to my understanding the value given by this.matter.world.nextcategory() doesn't go back to the start when re-creating a scene and collision would break after entering and re-entering a scene certain amount of times
var collisionCat1;
var collisionCat2;

//Default position for spawning the player at the beginning of the game
var playerStartPosition = { x: 1500, y: 1000 };

//Default game state values when starting a new game
var startingGameState = {
    currentMap: 'StockforsScene',
    playerX: playerStartPosition.x,
    playerY: playerStartPosition.y,
    musicOn: true,
    soundOn: true,
    MPScoreEasy: 0,
    MPScoreMedium: 0,
    MPScoreHard: 0,
    newGame: true,
    readyToEnter: true
};

//Game state passed on to the save file
var gameState = startingGameState;

function saveGame(state = {
    currentMap: gameState.currentMap,
    playerX: gameState.playerX,
    playerY: gameState.playerY,
    musicOn: gameState.musicOn,
    soundOn: gameState.soundOn,
    MPScoreEasy: gameState.MPScoreEasy,
    MPScoreMedium: gameState.MPScoreMedium,
    MPScoreHard: gameState.MPScoreHard,
    newGame: gameState.newGame,
    readyToEnter: gameState.readyToEnter
}) {

    let oldGameState = JSON.parse(JSON.stringify(gameState));

    //Assigns values from function parameter to the gamestate without removing the existing values with a different key
    Object.assign(gameState, state);

    //Save only if the new game state is different from the old one
    if (compareObjectValues(gameState, oldGameState) == false) {
        localStorage.setItem('saveFile', JSON.stringify(gameState)); 

        console.log('Game saved.'); 

        //console.log(oldGameState);
        console.log(gameState);

    }
    else
    {
        console.log('State has not changed, save cancelled.');

        //console.log(oldGameState);
        //console.log(gameState);
    }

}

function loadGame() {

    var file = JSON.parse(localStorage.getItem('saveFile'));

    if (file) {
        gameState = file;
    }

    return file;

};

function compareObjectValues(obj1, obj2)
{
    let obj1Keys = Object.keys(obj1);
    let obj2Keys = Object.keys(obj2);

    if(obj1Keys.length !== obj2Keys.length){
        return false;
    }

    for(let objKey of obj1Keys){
        if(obj1[objKey] !== obj2[objKey]){
            return false;
        }
    }

    return true;
}
/*
function PlaySound(soundKey, context)
{
    context.sound.play(soundKey);
}
*/


function FontsInit()
{
    //  Inject our CSS
    var element = document.createElement('style');

    document.head.appendChild(element);

    var sheet = element.sheet;

    var styles = '@font-face { font-family: "LexendTera"; src: url("Assets/fonts/LexendTera-Regular.ttf") format("truetype"); }\n';

    sheet.insertRule(styles, 0);

    styles = '@font-face { font-family: "Carme"; src: url("Assets/fonts/Carme-Regular.ttf") format("truetype"); }';

    sheet.insertRule(styles, 0);

    WebFont.load({
        custom: {
            families: [ 'LexendTera', 'Carme' ]
        }
    });

}

/*function SetCustomFont(text, font)
{
    //var add = context.add;
    //var input = this.input;

    /*WebFont.load({
        custom: {
            families: [ 'LexendTera', 'Carme' ]
        },
        active: function ()
        {
            //add.text(32, 32, 'The face of the\nmoon was in\nshadow.', { fontFamily: 'LexendTera', fontSize: 80, color: '#ff0000' }).setShadow(2, 2, "#333333", 2, false, true);

            //add.text(150, 350, 'Waves flung themselves\nat the blue evening.', { fontFamily: 'Carme', fontSize: 64, color: '#5656ee' });

            text.setStyle(Object.assign(text.style, {fontFamily: font}));
        }
    });
}*/






