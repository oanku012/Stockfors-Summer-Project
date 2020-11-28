//const { Game } = require("phaser");

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
    soundOn: true,
    musicOn: true,
    language: 'FI',
    parent: 'game',

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: 'game'
        //orientation: Phaser.Scale.Orientation.LANDSCAPE
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
    scene: [BootScene, PreloadScene, OpeningScene, StockforsScene, BuildingScene, KirkkoScene, PatruunantaloScene, PakkausmuseoScene, OptionsMenuScene, CreditsScene, MuistiPeliScene, PalapeliScene, KaarihalliScene, TallirakennusScene, SceneLoader, HistoryScene, HunajataloScene, PaloasemaScene, HiomoScene, PiippuhalliScene, HallirakennusScene, LintuhoitolaScene, ColombierScene, PyrollScene, Katettu_siltaScene, StrukanSulutScene, Karting_rataScene, LanguageLoader, UI]


};

function getWindowWidth()
{
    return window.innerWidth * window.devicePixelRatio;
}

function getWindowHeight()
{
    return window.innerHeight * window.devicePixelRatio;
}

//Rescales the scene on orientation change or on changing to fullscreen, optionally you can add specific elements to reposition
function rescaleSceneEvent(currentScene) {


    let centerX = currentScene.cameras.main.centerX;
    let centerY = currentScene.cameras.main.centerY;

    /*if (currentScene.sys.game.device.os.iOS || currentScene.sys.game.device.os.iPhone || currentScene.sys.game.device.os.android || currentScene.sys.game.device.os.windowsPhone) {



        //Rescales the window based on screen orientation on mobile devices
        currentScene.scene.scene.scale.on('orientationchange', function (orientation) {

            if (currentScene.scene.isActive()) {



                console.log(window);

                let sizeX = window.innerWidth * window.devicePixelRatio;
                let sizeY = window.innerHeight * window.devicePixelRatio;

                currentScene.scene.scene.scale.setGameSize(sizeX, sizeY);
                game.scale.resize(sizeX, sizeY);

                currentScene.cameras.main.centerOn(centerX, centerY);

                if (orientation === Phaser.Scale.PORTRAIT) {



                } else if (orientation === Phaser.Scale.LANDSCAPE) {


                }

                console.log(currentScene.scene.scene.scale);
                console.log(game.scale);
            }


        }, this);

    }*/

    //Rescales the game every time the window is resized, this includes orientation changes as well as toggling fullscreen
    window.addEventListener('resize', () => {
        
        if (currentScene.scene.isActive()) {



            //console.log(window);

            let sizeX = getWindowWidth();
            let sizeY = getWindowHeight();

            currentScene.scale.setGameSize(sizeX, sizeY);
            game.scale.resize(sizeX, sizeY);

            currentScene.cameras.main.centerOn(centerX, centerY);

            console.log('Game resized');
        }
    });

}

function rescaleObjects(object, scene, scalePortrait, scaleLandscape) {
    if (scene.sys.game.device.os.iOS || scene.sys.game.device.os.iPhone || scene.sys.game.device.os.android || scene.sys.game.device.os.windowsPhone) {

        if (scene.scale.orientation === Phaser.Scale.PORTRAIT) {
            object.setScale(scalePortrait * window.devicePixelRatio * (window.innerWidth + window.innerHeight));
            
        }
        else if (scene.scale.orientation === Phaser.Scale.LANDSCAPE) {
            object.setScale(scaleLandscape * window.devicePixelRatio * (window.innerWidth + window.innerHeight));
            //object.setScale(0.5 * window.devicePixelRatio * (window.innerHeight / 1000));

        }


    }
    else {
        object.setScale(scaleLandscape * window.devicePixelRatio * (window.innerWidth + window.innerHeight));
        //object.setScale(0.5 * window.devicePixelRatio * (window.innerHeight / 1000));
    }
}

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
    else {
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

function compareObjectValues(obj1, obj2) {
    let obj1Keys = Object.keys(obj1);
    let obj2Keys = Object.keys(obj2);

    if (obj1Keys.length !== obj2Keys.length) {
        return false;
    }

    for (let objKey of obj1Keys) {
        if (obj1[objKey] !== obj2[objKey]) {
            return false;
        }
    }

    return true;
}







