import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { TeapotGeometry } from "https://threejs.org/examples/jsm/geometries/TeapotGeometry.js";

var camera, scene, renderer;
var pointLight, mesh;
var turn = true;
var angle = 0;
var teapots = [];

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set (50, 180, 400);

	var gridXZ = new THREE.GridHelper(400, 20, 'red', 'white');
	scene.add(gridXZ);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0xFFE4CA);

	let controls = new OrbitControls(camera, renderer.domElement);

	document.body.appendChild(renderer.domElement);
	
	pointLight = new THREE.PointLight(0xffffff);
	scene.add (pointLight);
	scene.add (new THREE.PointLightHelper(pointLight, 5));

	var ambientLight = new THREE.AmbientLight(0x111111);
	scene.add(ambientLight);
	
	window.addEventListener('resize', onWindowResize, false);
  ///////////////////////////////////////////////////////////

	
	let meshMaterial = new THREE.ShaderMaterial({
		uniforms: {
			lightpos: {type: 'v3', value: new THREE.Vector3()}
		},
		vertexShader: document.getElementById('myVertexShader').textContent,
		fragmentShader: document.getElementById('myFragmentShader').textContent
	});
	
	var geometry = new TeapotGeometry (8);
	for(var i = 0, num = 0, x=180; i<10; i++){
		for(var j=0, z=180; j<10; j++, num++){
			mesh = new THREE.Mesh(geometry, meshMaterial);
			teapots.push(mesh);
			teapots[num].position.set(x, 8, z);
			z -= 40;
			scene.add(teapots[num]);
		}
		x -= 40;
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
	if (turn) angle += 0.01;
	pointLight.position.set(100 * Math.cos(angle), 100, 100 * Math.sin(angle));    
	mesh.material.uniforms.lightpos.value.copy (pointLight.position);
	teapots.forEach(function(a){ a.rotation.y = 1.1*angle; });
	//mesh.rotation.y = 1.3*angle;
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

export {init, animate, scene, onWindowResize};