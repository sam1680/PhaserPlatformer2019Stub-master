class FirstScene extends Phaser.Scene {
    player;
    cursors;
    platforms;
    stars;
    bombs;
    scoreText;
    score = 0;
    gameOver = false;
    constructor(config) {
        super(config);
    }
    preload() {
        this.load.image('hills', 'assets/hills.jpg');
        this.load.image('ground-1600', 'assets/platform-1600.png');
        this.load.image('ground-100', 'assets/platform-100.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        });
    }
    create() {
        this.cameras.main.setBounds(0, 0, 1600, 600);
        this.physics.world.setBounds(0, 0, 1600, 600);
        this.add.image(800, 300, 'hills');
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.jumpCount = 0;
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        this.player.setSize(30, 40).setOffset(1, 8);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.platforms = this.physics.add.staticGroup();
        this.physics.add.collider(this.player, this.platforms);
        this.platforms.create(800, 586, 'ground-1600');
        this.platforms.create(150, 470, 'ground-100');
        this.platforms.create(650, 470, 'ground-100');
        this.platforms.create(400, 470, 'ground-100');
        this.platforms.create(275, 350, 'ground-100');
        this.platforms.create(525, 350, 'ground-100');
        this.platforms.create(650, 230, 'ground-100');
        this.platforms.create(400, 230, 'ground-100');
        this.platforms.create(150, 230, 'ground-100');
        this.platforms.create(775, 350, 'ground-100');
        this.platforms.create(900, 470, 'ground-100');
        this.platforms.create(1025, 350, 'ground-100');
        this.platforms.create(1150, 470, 'ground-100');
        this.platforms.create(1275, 350, 'ground-100');
        this.platforms.create(900, 230, 'ground-100');
        this.platforms.create(1150, 230, 'ground-100');
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.overlap(this.player, this.bombs, this.endGame, null, this);
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 31,
            setXY: {
                x: 25,
                y: 0,
                stepX: 50
            },
        });
        this.stars.children.iterate(
            function(child){
                child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
            }
        );
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000'
        }).setScrollFactor(0);
        this.makeBomb();
        // anims
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
        if(!this.gameOver) {
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
            if(Phaser.Input.Keyboard.JustDown(this.cursors.space) && this.player.jumpCount < 1) {
                this.player.jumpCount++;
                this.player.setVelocityY(-250);
            }
            if(this.player.body.touching.down) {
                this.player.jumpCount = 0;
            }
        }
    }
    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        if(this.stars.countActive(true) === 0) {
            this.stars.children.iterate(
                function(child) {
                    child.enableBody(true, child.x, 0, true, true);
                }
            )
            this.makeBomb();
        }
    }
    makeBomb() {
        let x = (this.player.x < 600) ? Phaser.Math.Between(600, 1200) : Phaser.Math.Between(0, 600);
        let bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-400, 400), 20);
        bomb.allowGravity = false;
    }
    endGame() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
    }
}