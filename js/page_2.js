import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

console.log(THREE);


let scene = new THREE.Scene();


let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


camera.position.z = 5;


let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);
controls.mouseButtons = {
	//LEFT: THREE.MOUSE.PAN,
	MIDDLE: THREE.MOUSE.PAN,
	RIGHT: THREE.MOUSE.PAN
};

controls.touches = {
	//ONE: THREE.TOUCH.PAN,
	TWO: THREE.TOUCH.DOLLY_PAN
};

let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);



function OnWindowResize(e) {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function OnPointerDown(e) {

	console.log("getting input");

}


function OnMouseDown(e) {

};

function OnMouseUp(e) {

}

function OnTouchStart(e) {

}

function OnTouchEnd(e) {

}



function animate() {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;



	renderer.render(scene, camera);
}



window.addEventListener("resize", OnWindowResize);
window.addEventListener("mousedown", OnMouseDown);
window.addEventListener("mouseup", OnMouseUp);
window.addEventListener("pointerdown", OnPointerDown);
window.addEventListener("touchstart", OnTouchStart);
window.addEventListener("touchend", OnTouchEnd);


renderer.setAnimationLoop(animate);
