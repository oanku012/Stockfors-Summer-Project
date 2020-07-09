//const { Game } = require("phaser");

var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    soundOn: true,
    musicOn: true,
    parent: 'game',

    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,

    },

    dom: {
        createContainer: true
    },

    physics: {
        default: 'matter',
        matter: {
            debug: true,
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



    scene: [OpeningScene, StockforsScene, MenuScene, KirkkoScene, PatruunantaloScene, PakkausmuseoScene, OptionsMenuScene, MuistiPeliScene]


};

//Currently active map
//var currentMap;

//Whether if player is ready to move
var readyToMove = false;

//This is updated every time player enters a building, player can then be spawned back to that position when exiting the building
var playerExitPosition;

//Collision layers, these are global because to my understanding the value given by this.matter.world.nextcategory() doesn't go back to the start when re-creating a scene and collision would break after entering and re-entering a scene certain amount of times
var collisionCat1;
var collisionCat2;

//Default position for spawning the player at the beginning of the game
var playerStartPosition = { x: 200, y: 300 };

//Values in this object are updated when playing the game and this object is passed on to the save file
var gameState = {
    currentMap: 'StockforsScene',
    playerX: playerStartPosition.x,
    playerY: playerStartPosition.y,
    musicOn: true,
    soundOn: true,
    MPScore: 0
};

/*
function saveGame(currentMap = gameState.currentMap, posX = gameState.playerX, posY = gameState.playerY,
    musicOn = gameState.musicOn, soundOn = gameState.soundOn, MPScore = gameState.MPScore) {

    var state = {
        currentMap: currentMap,
        playerX: posX,
        playerY: posY,
        musicOn: musicOn,
        soundOn: soundOn,
        MPScore: MPScore
    }

    localStorage.setItem('saveFile', JSON.stringify(state));

    gameState = state;

    console.log('Game saved. Current map: ' + state.currentMap + ' Player position: ' + state.playerX + ' ' + state.playerY + ' Music on: ' + state.musicOn + ' Sound on: ' + state.soundOn + ' MPScore: ' + state.MPScore);


}*/

function saveGame(state = {currentMap: gameState.currentMap, playerX: gameState.playerX, playerY: gameState.playerY, musicOn: gameState.musicOn, soundOn: gameState.soundOn, MPScore: gameState.MPScore}) {

    if(state.currentMap){
        gameState.currentMap = state.currentMap;
    }

    if(state.playerX){
        gameState.playerX = state.playerX;
    }

    if(state.playerY){
        gameState.playerY = state.playerY;
    }

    if(state.musicOn){
        gameState.musicOn = state.musicOn;
    }

    if(state.soundOn){
        gameState.soundOn = state.soundOn;
    }

    if(state.MPScore){
        gameState.MPScore = state.MPScore;
    }

    localStorage.setItem('saveFile', JSON.stringify(gameState));

    console.log('Game saved. Current map: ' + gameState.currentMap + ' Player position: ' + gameState.playerX + ' ' + gameState.playerY + ' Music on: ' + gameState.musicOn + ' Sound on: ' + gameState.soundOn + ' MPScore: ' + gameState.MPScore);

}

function loadGame() {

    var file = JSON.parse(localStorage.getItem('saveFile'));

    if (file != null) {

    }

    return file;

};

/*function loadSettings() {
    var file = JSON.parse(localStorage.getItem('settings'));

    return file;
}*/

//Moved this here so the options menu could be added to the opening scene as well, some things like pointerOverUI only apply to map scenes
function createButton(posX, posY, scene, runOnTop, scrollFactor, scale, context) {
    // Button
    let buttonBG = context.add.image(0, 0, 'buttonBG');
    let buttonText = context.add.image(0, 0, 'buttonText');

    let button = context.add.container(posX, posY, [buttonBG, buttonText]);
    button.setSize(buttonBG.width, buttonBG.height);
    button.setInteractive();

    button.setScrollFactor(scrollFactor).setDepth(9999).setScale(scale);

    var pressed = false;

    button.on('pointerover', function () {

        buttonBG.setTint(0x44ff44);

        //This is just to stop the player from moving when clicking options menu
        context.scene.pointerOverUI = true;

    });

    button.on('pointerout', function () {

        buttonBG.clearTint();
        pressed = false;

        //Enable clicking movement when cursor goes away from the UI-button
        context.scene.pointerOverUI = false;

    });

    button.on('pointerdown', function () {

        pressed = true;



    });

    button.on('pointerup', function (event) {


        if (pressed) {
            readyToMove = false;

            //Only affects timer events, have to be setup separately for physics
            //this.time.paused = true;

            if (runOnTop == true) {
                context.scene.run(scene);
            }
            else {
                context.scene.start(scene);
            }

        }
    }, context);



    return button;

}







