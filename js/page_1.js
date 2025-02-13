

import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { DeviceOrientationControls } from './DeviceOrientationControls.js';

console.log(THREE);


let scene = new THREE.Scene();


let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


camera.position.z = 5;


let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


let raycaster = new THREE.Raycaster();


let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);


let mobileMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
let desktopControls = new PointerLockControls(camera, renderer.domElement);
let mobileControls = null;
console.log(desktopControls);
let confirmDevice = false;

function OnDeviceTilt(e) {

	console.log(e);

	if (!confirmDevice && e.alpha !== null && e.beta !== null && e.gamma !== null) {
		cube.material = mobileMaterial;
		confirmDevice = true;

		desktopControls.disconnect();
		desktopControls.dispose();

		mobileControls = new DeviceOrientationControls(camera);
	}


}


function OnWindowResize(e) {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function OnPointerDown(e) {

	let pointer = new THREE.Vector2();
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;


	raycaster.setFromCamera(pointer, camera);
	let intersects = raycaster.intersectObject(cube);

	if (intersects.length > 0) {

		console.log(intersects[0]);
		intersects[0].object.material.color.set('#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'));

	}

}


function OnMouseDown(e) {
	desktopControls.lock();
};

function OnMouseUp(e) {
	if (mobileControls === null) {
		desktopControls.unlock();
	}
}

function OnTouchStart(e) {
	if (mobileControls === null) {
		desktopControls.lock();
	}
}

function OnTouchEnd(e) {
	if (mobileControls === null) {
		desktopControls.unlock();
	}
}



function animate() {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	if (mobileControls !== null) {

		mobileControls.update();

	}

	renderer.render(scene, camera);
}



window.addEventListener("resize", OnWindowResize);
window.addEventListener("deviceorientation", OnDeviceTilt);
window.addEventListener("mousedown", OnMouseDown);
window.addEventListener("mouseup", OnMouseUp);
window.addEventListener("pointerdown", OnPointerDown);
window.addEventListener("touchstart", OnTouchStart);
window.addEventListener("touchend", OnTouchEnd);

renderer.setAnimationLoop(animate);
