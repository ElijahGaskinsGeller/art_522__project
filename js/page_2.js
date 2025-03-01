import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

console.log(THREE);


let scene = new THREE.Scene();


let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


camera.position.z = 5;


let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);
controls.mouseButtons = {
	LEFT: THREE.MOUSE.PAN,
	MIDDLE: THREE.MOUSE.PAN,
	RIGHT: THREE.MOUSE.PAN
};

controls.touches = {
	ONE: THREE.TOUCH.PAN,
	TWO: THREE.TOUCH.DOLLY_PAN
};


let gltfLoader = new GLTFLoader();

gltfLoader.load('./page_2/page_2__scene.glb', function(model) {

	let children = model.scene.children;
	for (let i = 0; i < children.length; i++) {
		let currentChild = children[i];

		switch (currentChild.name) {

			case ("bounds"): {

				let boundsMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
				currentChild.material = boundsMaterial;


			} break;


		}

		console.log(currentChild);

	}

	console.log(model);
	scene.add(model.scene);

});

let light = new THREE.DirectionalLight(0xFFFFFF, 3);
light.position.set(1, 1, 1).normalize();
scene.add(light);

let ambientLight = new THREE.AmbientLight(0xFFFFFF, 3);
scene.add(ambientLight);

let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
let cube = new THREE.Mesh(geometry, material);
//scene.add(cube);



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
