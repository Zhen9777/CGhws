import * as THREE from "https://threejs.org/build/three.module.js";
import {scene} from './hw4_main.js';

class Candle {
	constructor (x, y, z, name) {

		this.candle = new THREE.Group();
		let body = new THREE.Mesh (new THREE.CylinderGeometry(5,5,20,32), new THREE.MeshPhongMaterial({color:'#9F5000'}));
		
		
		let loader = new THREE.TextureLoader();
		// load a resource
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
				this.candle.add (flameMesh);
			},
			undefined, // onProgress
			// onError ...
			function(xhr) {
				console.log('An error happened');
			}
		);
		
		let light = new THREE.PointLight(0xffffff, 0.4);
		light.position.y = 18;
		this.candle.add(light);
		this.candle.add (body);
		this.candle.name = name;
		
		this.candle.position.set(x, y, z);
		scene.add (this.candle);
	}
   
   
	textureAnimate() {
		
		this.count = (this.count === undefined) ? 1 : this.count;
		if (this.candle.material.map!== undefined) {
		this.texture = this.candle.material.map;
		this.texture.offset.x += 1/3;
 
		if (this.count % 3 === 0) {
			this.texture.offset.y -= 1/3;
		}
		this.count++;
		}
	}


	flameExtinguish(){
		
		this.candle.children[0].intensity = 0;
		setTimeout (this.flameLight.bind(this), Math.random()*3000);
	}
   
	flameLight() {
		this.candle.children[0].intensity = 0.4;
	}
	
}

export { Candle };