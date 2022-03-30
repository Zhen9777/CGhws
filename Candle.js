import * as THREE from "three";
import {scene} from './hw4_main.js';

class Candle {
	constructor (x, y, z, name) {

		this.candle = new THREE.Group();
		let body = new THREE.Mesh (new THREE.CylinderGeometry(5,5,20,32), new THREE.MeshPhongMaterial({color:'#D26900'}));
		//this.candle children 
		
		let loader = new THREE.TextureLoader();
		loader.load(
			'https://i.imgur.com/JjQsgf3.png',
			function(texture) {
				var flameMesh = new THREE.Mesh(new THREE.PlaneGeometry(15, 15),
											   new THREE.MeshBasicMaterial({
												   map: texture,
												   alphaTest:0.5
				}));
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set (1/3,1/3);
				texture.offset.set (0,2/3);
				flameMesh.position.y = 18; 
				body.add (flameMesh);//body children
			},
			undefined, // onProgress
			// onError ...
			function(xhr) {
				console.log('An error happened');
			}
		);
		
		let light = new THREE.PointLight(0xffffff, 0.4); // this.candle children
		light.position.set(0, 20, 0);
		this.candle.add(light);
		this.candle.add (body);
		this.candle.name = name;
		
		this.flameInterval = setInterval (this.textureAnimate.bind(this), 100);
		
		this.candle.position.set(x, y, z);
		scene.add (this.candle);
	}
   
   
	textureAnimate() {
		
		this.count = (this.count === undefined) ? 1 : this.count;

		if (this.candle.children[1].children[0]!== undefined) {
			var texture = this.candle.children[1].children[0].material.map;
			texture.offset.x += 1/3;
	 
			if (this.count % 3 === 0) {
				texture.offset.y -= 1/3;
			}
			this.count++;
		}
		
	}


	flameExtinguish(){
		
		clearInterval (this.flameInterval);
		this.candle.children[1].children[0].material.visible = false;
		this.candle.children[0].intensity = 0;
		setTimeout (this.flameLight.bind(this), Math.random()*3000);
		
	}
   
	flameLight() {
		
		this.flameInterval = setInterval (this.textureAnimate.bind(this), 100);
		this.candle.children[1].children[0].material.visible = true;
		this.candle.children[0].intensity = 0.4;
		
	}
	
}

export { Candle };