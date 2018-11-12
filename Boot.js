var Boot = {
	preload: function() {

		game.load.audio('launch','assets/audio/launch.mp3');
		game.load.image('bg','assets/backgrounds/sky.png');
		game.load.spritesheet('falcon','assets/sprites/falcon.png',99,350);
		game.load.spritesheet('falconTrail','assets/sprites/trail.png',17,14);
		game.load.spritesheet('smoke','assets/sprites/smoke.png',128,128);

	},

	create: function(){
		
		launch_sound = game.add.audio('launch');
		launch_sound.volume = 0.3;
		launch_sound.play();

		boot_background = game.add.image(0,0,'bg');
		
		falcon = game.add.sprite(400,450,'falcon');
		falcon.anchor.x = 0.5;
		falcon.anchor.y = 0.5;

		falcon.animations.add('tremble',[0,1],10,true);		//constantly moving the rocket left and right to give the illussion of trembling while taking off
		falcon.animations.play('tremble');
		
		
		falconTrail = game.add.sprite(falcon.position.x -28 , falcon.position.y + 225 , 'falconTrail');
		falconTrail.scale.setTo(4,4);
		falconTrail.angle = 270;
		falconTrail.animations.add('flying',[0,1,2],5,true);
		falconTrail.animations.play('flying');

		falcon_smoke = game.add.emitter(falcon.position.x, falcon.position.y + 150 , 'smoke');
		falcon_smoke.width = 10;
		falcon_smoke.height = 10;
		falcon_smoke.makeParticles('smoke',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35],100,false);
		falcon_smoke.start(false,300,10);
	
	},
	update: function(){
		
		falcon_smoke.position.y -= falcon_speed;
		falconTrail.position.y -= falcon_speed;
		falcon.position.y += -falcon_speed;
		falcon_speed *= 1.02;						//a rockets speed isn't linear. To simulate the acceleration we're constantly increasing speed.
		
		if(falcon_speed>1.05){							//smoke disperses after a while
			falcon_smoke.on = false;
		}
		
		if(falcon_speed>20){
			launch_sound.stop();
			game.state.start('Menu');
		}
	}
}