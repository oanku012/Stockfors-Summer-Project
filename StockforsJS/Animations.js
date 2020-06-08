function CreateAnimations()
{
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3}),
        frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'up',
    frames: [ { key: 'player', frame: 4 } ],
    frameRate: 20
});

this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'up',
    frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
});
    
}