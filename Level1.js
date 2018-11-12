var Level1 = {

	preload: function() {

		//  We need this because the assets are on github pages
		//  Remove the next 2 lines if running locally
		//game.load.baseURL = 'https://aMimikyu.github.io/Shooter/';
		//game.load.crossOrigin = 'anonymous';
			
		game.load.audio('theme','assets/audio/theme.mp3');
		game.load.audio('shoot','assets/audio/shoot.wav');

		game.load.bitmapFont('spacefont','assets/spacefont/font.png','assets/spacefont/font.fnt');

		game.load.image('starfield', 'assets/backgrounds/starfield.png');
		game.load.image('ship', 'assets/sprites/car.png');
		game.load.image('bullet', 'assets/bullets/bullet.png');
		game.load.image('enemy2', 'assets/enemies/enemy2.png');
		game.load.image('enemy-blue','assets/enemies/enemy3.png');
		game.load.image('blueEnemyBullet','assets/bullets/blue-enemy-bullet.png');
		game.load.spritesheet('explosion','assets/sprites/explode.png',128,128);
		
	},


		
	create: function() {

		game.scale.pageAlignHorizontally = true;
			
		//  The scrolling starfield background
		starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
			
		bmd = game.add.bitmapData(600,20);					//bitmapdata for exp rectangle and the box containing it
		bmd.ctx.beginPath();
		bmd.ctx.rect(0,0,600,30);
		bmd.ctx.fillStyle = '#7F0000';	
		bmd.ctx.fill();

		bmd2 = game.add.bitmapData(1210,50);
		bmd2.ctx.beginPath();
		bmd2.ctx.rect(5,5,1200,25);
		bmd2.ctx.strokeStyle="white";
		bmd2.ctx.stroke();

		emptyExpBar = game.add.sprite(90,575,bmd2);
		emptyExpBar.width = 601;
		emptyExpBar.anchor.y = 0.5;

		expBar = game.add.sprite(95 , 568 , bmd);			//create the exp bar with the data
		expBar.width = 0;
		expBar.anchor.y = 0.5;

		//sounds
		theme = game.add.audio('theme');
		shoot = game.add.audio('shoot');
		shoot.volume = 0.3;
		theme.loopFull(0.3);


		//  Our bullet group
		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(30, 'bullet');
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 1);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);

		//  The hero!
		player = game.add.sprite(100, game.height / 2, 'ship');
		player.scale.setTo(0.15,0.15);
		player.health = 100;
		player.anchor.setTo(1, 0.7);
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
		player.body.drag.setTo(DRAG, DRAG);
		player.weaponLevel = 1;
		player.events.onKilled.add(function(){
			shipTrail.kill()
		});
		player.events.onRevived.add(function(){
			shipTrail.start(false, 5000,10);
		});

		//  And some controls to play the game with
		cursors = game.input.keyboard.createCursorKeys();
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		//  Add an emitter for the ship's trail
		shipTrail = game.add.emitter(player.x - 60, player.y, 400);
		shipTrail.height = 10;
		shipTrail.makeParticles('bullet');
		shipTrail.setYSpeed(20, -20);
		shipTrail.setXSpeed(-140, -120);
		shipTrail.setRotation(50, -50);
		shipTrail.setAlpha(1, 0.01, 800);
		shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000,
				Phaser.Easing.Quintic.Out);
		shipTrail.start(false, 5000, 10);

		//  An explosion pool
		explosions = game.add.group();
    	explosions.enableBody = true;
    	explosions.physicsBodyType = Phaser.Physics.ARCADE;
    	explosions.createMultiple(30, 'explosion');
    	explosions.setAll('anchor.x', 0.5);
    	explosions.setAll('anchor.y', 0.5);
    	explosions.forEach( function(explosion) {
        	explosion.animations.add('explosion');
   		});


    	// Big explosion

    	playerDeath = game.add.emitter(player.x,player.y);
    	playerDeath.width = 50;
    	playerDeath.height = 50;
    	playerDeath.makeParticles('explosion',[0,1,2,3,4,5,6,7],10);
    	playerDeath.setAlpha(0.9,0,800);
    	playerDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);
    		
    	// Shields stat

    	shields = game.add.bitmapText(game.world.width-200 , 10,'spacefont', '' + player.health +'%', 30);
    	shields.render = function() {
    		shields.text = 'Shields: ' + Math.max(player.health, 0) + '%';
    	};
    	shields.render();

    	// Score

    	scoreText = game.add.bitmapText(10,10, 'spacefont', '' ,30);
    	scoreText.render = function(){
    		scoreText.text = 'Score: ' + score;
    	};
    	scoreText.render();

    	// Game Over Text

    	gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!',110);
    	gameOver.x = gameOver.x - gameOver.textWidth / 2;
    	gameOver.y = gameOver.y - gameOver.textHeight / 3;
    	gameOver.visible = false;
			

		//Weapon level text

		weaponLevelText = game.add.bitmapText(350,530,'spacefont','LEVEL' + player.weaponLevel ,15);


		// The baddies!

		enemy2 = game.add.group();
		enemy2.enableBody = true;
		enemy2.physicsBodyType = Phaser.Physics.ARCADE;
		enemy2.createMultiple(5,'enemy2');
		enemy2.setAll('anchor.x',0.5);
		enemy2.setAll('anchor.y',0.5);
		enemy2.setAll('angle',0);
		enemy2.setAll('scale.x',1);
		enemy2.setAll('scale.y',1);

		enemy2.forEach(function(enemy){
			addEnemyEmitterTrail(enemy);
			enemy.body.setSize(enemy.width * 3 / 4, enemy.height);
			enemy.damageAmount = 20;
			enemy.events.onKilled.add(function(){
				enemy.trail.kill();
			});
		});
		game.time.events.add(1000, launchEnemy2);

		blueEnemyBullets = game.add.group();
		blueEnemyBullets.enableBody = true;
		blueEnemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
		blueEnemyBullets.createMultiple(30,'blueEnemyBullet');
		blueEnemyBullets.callAll('crop', null, {x: 90, y: 0, width: 90, height: 70});
   		blueEnemyBullets.setAll('alpha', 0.9);
    	blueEnemyBullets.setAll('anchor.x', 0.5);
    	blueEnemyBullets.setAll('anchor.y', 0.5);
    	blueEnemyBullets.setAll('outOfBoundsKill', true);
    	blueEnemyBullets.setAll('checkWorldBounds', true);
    	blueEnemyBullets.forEach(function(enemy){
        	enemy.body.setSize(20, 30);
    	});

		blueEnemies = game.add.group();
		blueEnemies.enableBody = true;
		blueEnemies.physicsBodyType = Phaser.Physics.ARCADE;
		blueEnemies.createMultiple(30,'enemy-blue');
		blueEnemies.setAll('anchor.x',0.5);
		blueEnemies.setAll('anchor.y',0.5);
		blueEnemies.setAll('angle',0);
		blueEnemies.forEach(function(enemy){
			enemy.damageAmount = 40;
		});
	},

	update: function() {

		expBar.bringToTop();
		emptyExpBar.bringToTop();

		//  Scroll the background
		starfield.tilePosition.x -= 2;



		//  Reset the player, then check for movement keys

		player.body.acceleration.y = 0;
		player.body.acceleration.x = 0;

		if (cursors.up.isDown) {
			player.body.acceleration.y = -ACCLERATION;
		} else if (cursors.down.isDown) {
			player.body.acceleration.y = ACCLERATION;
		} else if (cursors.left.isDown) {
			player.body.acceleration.x = -ACCLERATION;
		} else if (cursors.right.isDown) {
			player.body.acceleration.x = ACCLERATION;
		}

		//  Stop at screen edges
		if (player.x > game.width - 30) {
			player.x = game.width - 30;
			player.body.acceleration.x = 0;
		}
		if (player.x < 30) {
			player.x = 30;
			player.body.acceleration.x = 0;
		}
		if (player.y > game.height - 15) {
			player.y = game.height - 15;
			player.body.acceleration.y = 0;
		}
		if (player.y < 15) {
			player.y = 15;
			player.body.acceleration.y = 0;
		}

		//  Fire bullet
		if (player.alive && fireButton.isDown) {
			fireBullet();
		}

		//  Keep the shipTrail lined up with the ship
		shipTrail.y = player.y;
		shipTrail.x = player.x - 60;

		//Check collisions

		game.physics.arcade.overlap(player, enemy2, shipCollide, null, this);
		game.physics.arcade.overlap(enemy2, bullets, hitEnemy, null, this);
		game.physics.arcade.overlap(player,blueEnemies,shipCollide,null,this);
		game.physics.arcade.overlap(blueEnemies,bullets,hitEnemy,null,this);

		game.physics.arcade.overlap(blueEnemyBullets, player, enemyHitsPlayer,null,this);

		// Dead

		if(! player.alive && gameOver.visible === false){
			gameOver.visible = true;
			gameOver.alpha = 0;
			var fadeInGameOver = game.add.tween(gameOver);
			fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
			fadeInGameOver.onComplete.add(setResetHandlers);
			fadeInGameOver.start();
			function setResetHandlers(){
				// The "click to restart" handler
				tapRestart = game.input.onTap.addOnce(_restart,this);
				spaceRestart = fireButton.onDown.addOnce(_restart,this);
				function _restart(){
					tapRestart.detach();
					spaceRestart.detach();
					restart();
				}
			}
		}
	},

	render: function() {
		// for (var i = 0; i < greenEnemies.length; i++)
    	// {
    	//    game.debug.body(greenEnemies.children[i]);
    	// }
		// game.debug.body(player);
	}
}