
//car
function buildVehicle() {

	var car = new THREE.Object3D();
	var mat = new THREE.MeshPhongMaterial({color:'#D26900'});
	
	var Chassis = new THREE.Mesh(new THREE.BoxGeometry(7, 2, 5), mat);
	Chassis.position.set(0,1,0);
	car.add(Chassis);
	
	var body = new THREE.Mesh(new THREE.BoxGeometry(5, 2.5, 4), mat);
	body.position.set(0,3.5,0);
	car.add(body);
	
	var windowR = new THREE.Mesh(new THREE.PlaneGeometry(4,1.5), new THREE.MeshBasicMaterial( {color: 'white', side: THREE.DoubleSide}));
	var windowL = windowR.clone();
	windowR.position.set(0, 3.5, -2.01);
	windowL.position.set(0, 3.5, 2.01);
	car.add(windowR, windowL);
	var windowF = new THREE.Mesh(new THREE.PlaneGeometry(2.5,1.5), new THREE.MeshBasicMaterial( {color: 'white', side: THREE.DoubleSide}));
	windowF.rotation.y = Math.PI / 2;
	var windowB = windowF.clone();
	windowF.position.set(2.51, 3.5, 0);
	windowB.position.set(-2.51, 3.5, 0);
	car.add(windowF, windowB);
	
	var light1 = new THREE.Mesh (new THREE.CircleGeometry(0.5, 30), new THREE.MeshBasicMaterial({color:'#FFED97'}));
	light1.rotation.y = Math.PI / 2;
	var light2 = light1.clone();
	light1.position.set(3.51, 1, 1.3);
	light2.position.set(3.51, 1, -1.3);
	car.add(light1, light2);
	
	return car;
	
}

//car speed and position
function update(dt) {

	keyboard.update();
	  
	if (vel.length() > 0) {
		angle = 1.5*Math.PI + Math.atan2(vel.x, vel.z); 
	}

	if (keyboard.pressed("space"))  
		power = 0.0;               
	if (keyboard.pressed("up"))  
		power += 0.5;        
	if (keyboard.pressed("down"))  
		power -= 0.5;   
	
	//power = Math.clamp (power, 0, 80.0); 
	 
	var angle_thrust = angle;
	if (keyboard.pressed("left"))
		angle_thrust += 0.3;
	if (keyboard.pressed("right"))
		angle_thrust -= 0.3;
    
	if(power<=0.0)
		power = 0.0;
	else if(power>=80.0)
		power = 80.0;
	
	// compute force
	var thrust = new THREE.Vector3(1,0,0).multiplyScalar(power).applyAxisAngle (new THREE.Vector3(0,1,0), angle_thrust);
	force.copy (thrust);
	force.add(vel.clone().multiplyScalar(-2));
	// eulers
	vel.add(force.clone().multiplyScalar(dt));
	pos.add(vel.clone().multiplyScalar(dt));
	
}

function makeRect(car) {
	let Rect = {};
	Rect.max = car.localToWorld ( new THREE.Vector3(3.5, 0, 2.5) );
	Rect.min = car.localToWorld ( new THREE.Vector3(-3.5, 0, -2.5) );
	Rect.px = car.localToWorld (new THREE.Vector3(1.2,0,0)).sub(car.position);
    return Rect;
}	

function Check_Intersect(Rect, C, Rad) {
	const Rad2 = Rad * Rad;
  
	let xHat = Rect.px;
	let zHat = xHat.clone().cross (new THREE.Vector3(0,1,0)).normalize();
  
	let R = {max:{x:0, z:0}, min:{x:0, z:0}};
	let cp = Rect.max.clone().sub (C.position);   
	R.max.x = cp.dot (xHat), R.max.z = cp.dot (zHat);
  
	cp = Rect.min.clone().sub (C.position);
	R.min.x = cp.dot (xHat), R.min.z = cp.dot (zHat);
  
	if (R.max.x < 0){			/* R to left of circle center */
		if (R.max.z < 0) 		/* R in lower left corner */
			return ((R.max.x * R.max.x + R.max.z * R.max.z) < Rad2);
		else if (R.min.z > 0) 	/* R in upper left corner */
			return ((R.max.x * R.max.x + R.min.z * R.min.z) < Rad2);
		else 					/* R due West of circle */
			return(Math.abs(R.max.x) < Rad);
 	}
	else if (R.min.x > 0){  	/* R to right of circle center */
		if (R.max.z < 0) 	/* R in lower right corner */
     		return ((R.min.x * R.min.x + R.max.z * R.max.z) < Rad2);
		else if (R.min.z > 0)  	/* R in upper right corner */
			return ((R.min.x * R.min.x + R.min.z * R.min.z) < Rad2);
		else 				/* R due East of circle */
			return (R.min.x < Rad);
	}
 	else{
		if (R.max.z < 0) 	/* R on circle vertical centerline */ 
     		return (Math.abs(R.max.z) < Rad); /* R due South of circle */
		else if (R.min.z > 0)  	/* R due North of circle */
			return (R.min.z < Rad);
		else 				/* R contains circle centerpoint */
			return(true);
	}
}