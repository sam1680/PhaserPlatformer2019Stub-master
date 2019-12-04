class FirstScene extends Phaser.Scene {
    player;
    cursors;
    platforms;
    constructor(config) {
        super(config);
    }
    preload() {
        this.load.image('hills', 'assets/hills.jpg');
        this.load.image('ground-1600', 'assets/platform-1600.png')
        this.load.spritesheet('dude', 'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        });
    }
    create() {
        this.add.image(800, 300, 'hills');
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.jumpCount = 0;
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.platforms = this.physics.add.staticGroup();
        this.physics.add.collider(this.player, this.platforms);
        this.platforms.create(800, 586, 'ground-1600');
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{
                key: 'dude',
                frame: 4
            }],
            frameRate: 10
        })
    }
    update() {
        if(this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if(this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        if(Phaser.Input.Keyboard.JustDown(this.cursors.space) && this.player.jumpCount < 2) {
            this.player.jumpCount++;
            this.player.setVelocityY(-250);
        }
        if(this.player.body.touching.down) {
            this.player.jumpCount = 0;
        }
    }
}