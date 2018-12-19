var BigBoss = {

	preload: function(){

		game.load.audio('theme','assets/audio/ambience.mp3');
		game.load.audio('shoot','assets/audio/shoot.wav');
		game.load.audio('boom','assets/audio/boom.wav');
		game.load.audio('healthSound','assets/audio/heal.mp3');
		game.load.audio('bossTheme','assets/audio/megalovania.mp3');


		game.load.bitmapFont('spacefont','assets/spacefont/font.png','assets/spacefont/font.fnt');



		game.load.image('starfield', 'assets/backgrounds/starfield.png');
		game.load.image('ship', 'assets/sprites/car.png');
		game.load.image('bullet', 'assets/bullets/bullet.png');

		
		game.load.spritesheet('explosion','assets/sprites/explode.png',128,128);
		game.load.spritesheet('up','assets/sprites/ball.png',98,98);
		game.load.image('blueEnemyBullet','assets/bullets/blue-enemy-bullet.png');


		game.load.image('boss','assets/enemies/boss.png');
		game.load.image('health','assets/sprites/health.png');

	},
	create: function(){

		game.camera.flash(0, 4000);
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


		theme = game.add.audio('theme');
		theme.loopFull(0.1);

		bossTheme = game.add.audio('bossTheme');
		bossTheme.volume = 0.2;

		shoot = game.add.audio('shoot');
		shoot.volume = 0.1;

		boom = game.add.audio('boom');
		boom.volume = 0.05;

		healthSound = game.add.audio('healthSound');


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
		player.alpha = 1;
		player.scale.setTo(0.1,0.1);
		player.health = 100;
		player.anchor.setTo(1, 0.7);
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.velocity.setTo(SPEED, SPEED);
		player.body.setSize(300,80,50,30);

		player.weaponLevel = 3;
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


    	// The baddies!

    	/*
    	boss = game.add.sprite(game.width+100, game.height/2, 'boss');	//150
    	boss.anchor.setTo(0.5,0.5);
    	boss.angle = 270;
    	boss.scale.setTo(1.3,0.9);
    	boss.enableBody = true;
    	game.physics.enable(boss, Phaser.Physics.ARCADE);
		*/

		boss = game.add.group();
		boss.enableBody = true;
		boss.physicsBodyType = Phaser.Physics.ARCADE;
		boss.createMultiple(1,'boss');
		boss.setAll('anchor.x',0.5);
		boss.setAll('anchor.y',0.5);
		boss.setAll('scale.x',0.7);
		boss.setAll('scale.y',0.4);
		boss.forEach(function(boss){
			boss.damageAmount = 25;
			boss.body.setSize(100,180,100,-40);
		});

		bossBullets = game.add.group();
		bossBullets.enableBody = true;
		bossBullets.physicsBodyType = Phaser.Physics.ARCADE;
		bossBullets.createMultiple(300,'blueEnemyBullet');
		bossBullets.callAll('crop', null, {x: 90, y: 0, width: 90, height: 70});
		bossBullets.setAll('anchor.x',0.5);
		bossBullets.setAll('anchor.y',0.5);
		bossBullets.setAll('outOfBoundsKill',true);
		bossBullets.setAll('checkWorldBounds',true);
		bossBullets.forEach(function(enemy){
        	enemy.body.setSize(20,5,20,32);
    	});
    	launchDeathMachineOfDeath();

    	up = game.add.group();
    	up.enableBody = true;
    	up.physicsBodyType = Phaser.Physics.ARCADE;
    	up.createMultiple(5,'up');
    	up.setAll('outOfBoundsKill',true);
		up.setAll('checkWorldBounds',true);
		up.forEach(function(up){
			up.body.velocity.setTo(-200,20);
			up.scale.setTo(0.5,0.5);
			up.animations.add('play',[0,1,2,3,4]);
		});

		healthUp = game.add.group();
		healthUp.enableBody = true;
		healthUp.physicsBodyType = Phaser.Physics.ARCADE;
		healthUp.createMultiple(10,'health');
		healthUp.setAll('outOfBoundsKill',true);
		healthUp.setAll('checkWorldBounds',true);
		healthUp.forEach(function(health){
			health.scale.setTo(0.075,0.075);
			health.body.velocity.setTo(-200,20);		
		});




    	scoreText = game.add.bitmapText(10,10, 'spacefont', '' ,30);
    	scoreText.render = function(){
    		scoreText.text = score;
    	};
    	scoreText.render();

    	// Game Over Text

    	gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!',110);
    	gameOver.x = gameOver.x - gameOver.textWidth / 2;
    	gameOver.y = gameOver.y - gameOver.textHeight / 3;
    	gameOver.visible = false;

    	// Shields stat

    	shields = game.add.bitmapText(game.world.width-200 , 10,'spacefont', '' + player.health +'%', 30);
    	shields.render = function() {
    		shields.text = 'Shields: ' + Math.max(player.health, 0) + '%';
    	};
    	shields.render();
			

		//Weapon level text

		weaponLevelText = game.add.bitmapText(350,530,'spacefont','Weapon LV ' + player.weaponLevel ,15);
	},
	update: function(){

		expBar.bringToTop();
		emptyExpBar.bringToTop();

		//  Scroll the background
		starfield.tilePosition.x -= 2;



		//  Reset the player, then check for movement keys

		if(player.body.enable){
			player.body.velocity.x =0;
			player.body.velocity.y =0;

			if (cursors.up.isDown) {
				player.body.velocity.y = -SPEED;
			} else if (cursors.down.isDown) {
				player.body.velocity.y = SPEED;
			} else if (cursors.left.isDown) {
				player.body.velocity.x = -SPEED;
			} else if (cursors.right.isDown) {
				player.body.velocity.x = SPEED;
			}
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
		shipTrail.x = player.x - 50;

		//Check collisions

		game.physics.arcade.overlap(boss,bullets,hitBoss,null,this);
		game.physics.arcade.overlap(player,up,levelOverlap);
		game.physics.arcade.overlap(player,healthUp,healthOverlap);


		if(player.alpha==1){
			game.physics.arcade.collide(player,boss);
			game.physics.arcade.overlap(bossBullets, player, enemyHitsPlayer,null,this);

		}

	

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
	render: function(){
		/*
		for (var i = 0; i < boss.length; i++)
    	 {
    	    game.debug.body(boss.children[i]);
    	 }	
    	 */
	}
}