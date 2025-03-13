
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function lerp(start, end, amt) {
	return (1 - amt) * start + amt * end
}

function inverseLerp(start, end, amt) {
	return (amt - start) / (end - start);
}

function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max);
};

function GetPageHeight() {
	return Math.max(document.body.scrollHeight, document.body.offsetHeight,
		document.documentElement.clientHeight, document.documentElement.scrollHeight,
		document.documentElement.offsetHeight);
}

function WindowScrollNormalPosition() {
	return window.scrollY / (GetPageHeight() - window.innerHeight);
}

function OnScreenLerpPosition(quadBounds, quadScale, quadPos, camera) {

	let cameraTop = -(camera.position.y + window.innerHeight / 2);

	//NOTE: z is applied for vertical bounds for whatever reason (dont ask me)
	let appliedMax = (quadBounds.max.z * quadScale.y) + quadPos.y;
	let appliedMin = ((quadBounds.min.z * quadScale.y) + quadPos.y) - window.innerHeight;

	let normalPos = inverseLerp(appliedMin, appliedMax, cameraTop);

	return normalPos;
}

console.log(THREE);


let scene = new THREE.Scene();
scene.background = new THREE.Color(1, 1, 1);


let camera = new THREE.OrthographicCamera(window.innerWidth / -2,
	window.innerWidth / 2,
	window.innerHeight / 2,
	window.innerHeight / -2, 0.1, 1000);
//camera.aspect = window.innerWidth / window.innerHeight;

camera.position.z = 5;

let cameraStart = 0;
let cameraEnd = 0;


let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



//let controls = new OrbitControls(camera, renderer.domElement);

let gltfLoader = new GLTFLoader();
let panel_0 = null;
gltfLoader.load("./page_3/page_3_layout.glb", function(model) {


	let children = model.scene.children;

	for (let i = 0; i < children.length; i++) {

		let currentChild = children[i];
		console.log(currentChild);

		if (currentChild.material !== undefined) {

			let newMaterial = new THREE.MeshBasicMaterial({ map: currentChild.material.map });
			currentChild.material = newMaterial;

		}

		switch (currentChild.name) {

			case ("start"): {
				cameraStart = currentChild.position.y;
			} break;


			case ("end"): {
				cameraEnd = currentChild.position.y;
			} break;


		}

	}


	let tmpMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	model.scene.children[0].material = tmpMat;

	scene.add(model.scene);

});


let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let cube = new THREE.Mesh(geometry, material);
//scene.add(cube);


//TODO: resize is broken

function OnWindowResize(e) {
	console.log("here");

	camera.left = window.innerWidth / -2;
	camera.right = window.innerWidth / 2;
	camera.top = window.innerHeight / 2;
	camera.bottom = window.innerHeight / -2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

//function OnScroll(e) {
//	let scrollStart = Math.PI / 2;
//	let scrollEnd = -Math.PI / 2;
//
//	let currentPos = WindowScrollNormalPosition();
//
//
//	let currentRotation = lerp(scrollStart, scrollEnd, currentPos);
//
//	camera.rotation.x = currentRotation;
//
//
//}
//
function animate() {
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;

	//let scrollStart = Math.PI / 2;
	//let scrollEnd = -Math.PI / 2;

	let currentScrollPos = WindowScrollNormalPosition();

	let currentCameraPosition = lerp(cameraStart, cameraEnd, currentScrollPos);

	camera.position.y = currentCameraPosition;

	if (panel_0 !== null) {
		let normPos = OnScreenLerpPosition(panel_0.geometry.boundingBox, panel_0.scale, panel_0.position, camera);

		normPos = clamp(normPos, 0, 1);

		panel_0.material.color = new THREE.Color(normPos, 1 - normPos, normPos);


	}

	//let currentRotation = lerp(scrollStart, scrollEnd, currentPos);



	//console.log("ratio: " + camera.aspect);
	renderer.render(scene, camera);
}



window.addEventListener("resize", OnWindowResize);

renderer.setAnimationLoop(animate);
