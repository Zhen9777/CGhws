import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { TeapotGeometry } from "https://threejs.org/examples/jsm/geometries/TeapotGeometry.js";

var camera, scene, renderer;
var pointLight, mesh;
var angle = 0;
var sceneRTT, renderTarget;
var quad;
var teapots = [];

function init() {
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
	camera.position.set (50, 180, 400);
	
	var gridXZ = new THREE.GridHelper(400, 20, 'red', 'white');
	scene.add(gridXZ);

	let controls = new OrbitControls(camera, renderer.domElement);

	var ambientLight = new THREE.AmbientLight(0x555555);
	scene.add(ambientLight);

	window.addEventListener('resize', onWindowResize, false);
  /////////////////////////////////////////////////////////

	sceneRTT = new THREE.Scene();
	pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(0, 300, 200);
	sceneRTT.add(pointLight);

	renderTarget = new THREE.WebGLRenderTarget(
		1024, 1024, {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBFormat
		}
	);

	let meshMaterial = new THREE.ShaderMaterial({
		uniforms: {
			lightpos: {type: 'v3', value: new THREE.Vector3()}
		},
		vertexShader: document.getElementById('myVertexShader').textContent,
		fragmentShader: document.getElementById('myFragmentShader').textContent
	});
	
	mesh = new THREE.Mesh(new TeapotGeometry (1), meshMaterial);
	mesh.scale.set(32, 32, 32);
	sceneRTT.add(mesh);

	let plane = new THREE.PlaneBufferGeometry(200, 100);
  
	let rttmaterial = new THREE.ShaderMaterial({
		uniforms: {
			mytex: {
				type: "t",
				value: renderTarget.texture
			}
		},
		vertexShader: document.getElementById('myPlaneVertexShader').textContent,
		fragmentShader: document.getElementById('myPlaneFragmentShader').textContent
	});


	//quad = new THREE.Mesh(plane,rttmaterial);
	//scene.add(quad);
	
	for(var i = 0, num = 0, x=180; i<10; i++){
		for(var j=0, z=180; j<10; j++, num++){
			quad = new THREE.Mesh(plane,rttmaterial);
			teapots.push(quad);
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
	requestAnimationFrame(animate);
	angle += 0.005;
	mesh.rotation.y = -angle;

	// render mesh to texture
	renderer.setRenderTarget (renderTarget);
	renderer.setClearColor(0xffff00);
	renderer.render(sceneRTT, camera);

	// render texture to quad
	renderer.setRenderTarget(null);
	renderer.setClearColor(0xFFE4CA);
	renderer.render(scene, camera);
	teapots.forEach(function(a){ a.lookAt (camera.position); });
	
}

export {init, animate, scene, onWindowResize};