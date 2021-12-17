import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

import { Candle } from "./Candle.js";

var renderer, camera, scene;
var candles = [];
var pickables = [];
var raycaster, mouseLoc;

function init() {
	scene = new THREE.Scene();
		
	renderer = new THREE.WebGLRenderer();
	let width = window.innerWidth;
	let height = window.innerHeight;
	renderer.setSize (width, height);
	document.body.appendChild (renderer.domElement);
	renderer.setClearColor (0xFFE4CA);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	
	camera = new THREE.PerspectiveCamera (50, width/height, 1, 10000);
	camera.position.set (100, 120, 150);
	
	let controls = new OrbitControls(camera, renderer.domElement);
	 
	
	let floor = new THREE.Mesh (new THREE.PlaneGeometry(200,200), new THREE.MeshPhongMaterial({color: '#FFD1A4', side: THREE.DoubleSide}));
	scene.add (floor);
	floor.rotation.x = -Math.PI/2;
	floor.position.y = -10;
	
	/////////////////////////////////
	var candle0 = new Candle(0, 0, 0, 1);
	var candle1 = new Candle(40, 0, 40, 2);
	var candle2 = new Candle(40, 0, -40, 3);
	var candle3 = new Candle(-40, 0, 40, 4);
	var candle4 = new Candle(-40, 0, -40, 5);
	candles.push(candle0, candle1, candle2, candle3, candle4);
	pickables.push(candle0.candle, candle1.candle, candle2.candle, candle3.candle, candle4.candle);
	
	floor.receiveShadow = true;
	
	raycaster = new THREE.Raycaster();
	mouseLoc = new THREE.Vector2();
	document.addEventListener ('pointerdown', doPointerDown, false);
	
};

function doPointerDown (event) {
	event.preventDefault();
	
	mouseLoc.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouseLoc.y = -(event.clientY / window.innerHeight) * 2 + 1;
	
	raycaster.setFromCamera (mouseLoc, camera);
	var intersects = raycaster.intersectObjects (pickables);
	
	if (intersects.length > 0) {
	    for(var i=0; i<5; i++){
			if(intersects[0].object.parent.name === candles[i].candle.name){
				candles[i].flameExtinguish();
			}
		}
	}
	
}

function onWindowResize() {
  
	var width = window.innerWidth;
	var height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
	
}


function animate() {
	requestAnimationFrame (animate);
	renderer.render (scene, camera);
	
	candles.forEach(function(a){ a.candle.lookAt( camera.position.x, 0, camera.position.z); });
	
};

export {init, animate, scene};