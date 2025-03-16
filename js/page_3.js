
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

camera.position.z = 5;

let cameraStart = 0;
let cameraEnd = 0;


let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


//let controls = new OrbitControls(camera, renderer.domElement);

let gltfLoader = new GLTFLoader();
let panel_0 = null;

let bubble_0 = null;
let bubble_0_textures = [];
let bubble_0_frameLength = 1;
let bubble_0_frameTimer = 0;
let bubble_0_currentFrame = 0;

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

			case ("bubble_0"): {

				bubble_0 = currentChild;
				bubble_0.scale.z *= -1;
				if (bubble_0_textures[0] !== undefined) {

					bubble_0.material.map = bubble_0_textures[0];

				}


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

let textureLoader = new THREE.TextureLoader();

bubble_0_textures.push(textureLoader.load("page_3/bubble_0/bubble_0_0000.png", function(t) {
	console.log(t);
}));
bubble_0_textures.push(textureLoader.load("page_3/bubble_0/bubble_0_0001.png", function(t) {

	console.log(t);

}));
bubble_0_textures.push(textureLoader.load("page_3/bubble_0/bubble_0_0002.png", function(t) {

	console.log(t);

}));
bubble_0_textures.push(textureLoader.load("page_3/bubble_0/bubble_0_0003.png", function(t) {

	console.log(t);

}));


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

let clock = new THREE.Clock(true);
function animate() {

	let deltaTime = clock.getDelta();

	let currentScrollPos = WindowScrollNormalPosition();

	let currentCameraPosition = lerp(cameraStart, cameraEnd, currentScrollPos);

	camera.position.y = currentCameraPosition;



	if (bubble_0 !== null && bubble_0_textures.length !== 0) {

		bubble_0_frameTimer += deltaTime;
		if (bubble_0_frameTimer > bubble_0_frameLength) {
			bubble_0_currentFrame++;
			if (bubble_0_currentFrame >= bubble_0_textures.length) {
				bubble_0_currentFrame = 0;
			}

			while (bubble_0_frameTimer > bubble_0_frameLength) {
				bubble_0_frameTimer -= bubble_0_frameLength;
			}

			bubble_0.material.map = bubble_0_textures[bubble_0_currentFrame];
		}
	}



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
