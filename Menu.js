var Menu = {
	preload: function() {
		game.load.image('starfield','assets/backgrounds/starfield.png');
		game.load.spritesheet('falcon','assets/sprites/falcon.png',99,350);
		game.load.audio('menu_theme','assets/audio/life_on_mars.mp3');
		game.load.spritesheet('falconTrail', 'assets/sprites/trail.png',17,14);
		game.load.image('lvl1','assets/lvl1.png',10,10);
		game.load.image('lvl2','assets/lvl2.png',10,10);
		game.load.bitmapFont('spacefont','assets/spacefont/font.png','assets/spacefont/font.fnt');
	},

	create: function(){
		


		starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

		menu_theme = game.add.audio('menu_theme');
		menu_theme.loop = true;
		menu_theme.play();

		

		falcon = game.add.sprite(400,750,'falcon');
		falcon.anchor.x = 0.5;
		falcon.anchor.y = 0.5;

		
		falconTrail = game.add.sprite(falcon.position.x -28 , falcon.position.y + 225 , 'falconTrail');
		falconTrail.scale.setTo(4,4);
		falconTrail.angle = 270;
		falconTrail.animations.add('flying',[0,1,2],5,true);
		falconTrail.animations.play('flying');


		button1 = game.add.button(75,50, "lvl1", click1 , this, function(){});
		button2 = game.add.button(game.width-200,50, "lvl2", click2, this, function(){});
		button1.scale.setTo(0.3,0.3);
		button2.scale.setTo(0.3,0.3);


	},
	update: function(){


		starfield.tilePosition.y += background_speed;

		if (falcon.position.y > 300){
			falcon.position.y -= 0.5;
			falconTrail.position.y -= 0.5;
		}
		else {
			background_speed = 2;
		}
	}	
}