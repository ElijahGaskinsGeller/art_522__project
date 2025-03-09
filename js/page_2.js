import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

console.log(THREE);

function randomRange(min, max) {
	let result = Math.floor(Math.random() * (max - min + 1)) + min;
	return result;
}


let scene = new THREE.Scene();


let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


camera.position.z = 20;


let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
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
let textureLoader = new THREE.TextureLoader();


let boundLeft = 0;
let boundRight = 0;
let boundTop = 0;
let boundBottom = 0;
let boundZoom = 0;

let smoke = null;
let smokeTextures = [];

smokeTextures.push(textureLoader.load("./page_2/smoke_0000.png", function(t) {
	if (smoke !== null) {
		smoke.material.map = smokeTextures[0];
	}
}));
smokeTextures.push(textureLoader.load("./page_2/smoke_0001.png"));
smokeTextures.push(textureLoader.load("./page_2/smoke_0002.png"));
smokeTextures.push(textureLoader.load("./page_2/smoke_0003.png"));

gltfLoader.load('./page_2/page_2__scene.glb', function(model) {

	let children = model.scene.children;
	for (let i = 0; i < children.length; i++) {
		let currentChild = children[i];

		if (currentChild.material !== undefined) {

			let basicMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
			basicMaterial.transparent = true;
			basicMaterial.map = currentChild.material.map;
			currentChild.material = basicMaterial;
		}


		switch (currentChild.name) {

			case ("mrs_riita"): {

				//currentChild.material.transparent = true;


			} break;

			case ("smoke"): {

				smoke = currentChild;

				if (smokeTextures[0] !== undefined) {
					smoke.material.map = smokeTextures[0];
				}
				smoke.scale.z *= -1;

			} break;

			case ("bounds"): {

				//let boundsMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
				//currentChild.material = boundsMaterial;

				camera.position.y = currentChild.position.y;
				controls.target.y = currentChild.position.y;

				boundZoom = currentChild.position.z + .2;

			} break;

			case ("riita_bars"): {

				currentChild.material.transparent = false;

			} break;

			case ("bound_left"): {
				boundLeft = currentChild.position.x;
				console.log("b-left: " + boundLeft);
			} break;

			case ("bound_right"): {
				boundRight = currentChild.position.x;
				console.log("b-right: " + boundRight);
			} break;

			case ("bound_top"): {
				boundTop = currentChild.position.y;
				console.log("b-top: " + boundTop);
			} break;

			case ("bound_bottom"): {
				boundBottom = currentChild.position.y;
				console.log("b-bottom: " + boundBottom);
			} break;


		}

		console.log(currentChild);

	}

	console.log(model);
	scene.add(model.scene);

});


let leaves = [];
let baseLeaf = null;
let leafCount = 100;

let leafRangeX = [-100, 20];
let leafRangeY = [-5, 50];

gltfLoader.load('./page_2/leaf.glb', function(model) {


	baseLeaf = model.scene.children[0];
	baseLeaf.material.transparent = true;
	console.log(baseLeaf);
	let scaleRange = .005;

	for (let i = 0; i < leafCount; i++) {
		let newLeaf = baseLeaf.clone(true);
		newLeaf.position.x = randomRange(leafRangeX[0], leafRangeX[1]);
		newLeaf.position.y = randomRange(leafRangeY[0], leafRangeY[1]);
		newLeaf.position.z = 3;

		newLeaf.scale.x = .1 + (scaleRange * (i % 10));
		newLeaf.scale.y = .1 + (scaleRange * (i % 10));
		newLeaf.scale.z = .1 + (scaleRange * (i % 10));

		newLeaf.rotation.y = randomRange(0, 2 * Math.PI);



		leaves.push(newLeaf);

		scene.add(newLeaf);

	}


});


let light = new THREE.DirectionalLight(0xFFFFFF, 3);
light.position.set(1, 1, 1).normalize();
//scene.add(light);

let ambientLight = new THREE.AmbientLight(0xFFFFFF, 3);
scene.add(ambientLight);

//let geometry = new THREE.BoxGeometry(1, 1, 1);
//let material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
//let cube = new THREE.Mesh(geometry, material);
//scene.add(cube);



function OnWindowResize(e) {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function OnPointerDown(e) {


}


function OnMouseDown(e) {

};

function OnMouseUp(e) {

}

function OnTouchStart(e) {

}

function OnTouchEnd(e) {

}


let clock = new THREE.Clock(true);
let frameLength = .75;
let frameTimer = 0;
let currentFrame = 0;
function animate() {

	let deltaTime = clock.getDelta();


	if (smoke !== null && smokeTextures.length !== 0) {
		frameTimer += deltaTime;
		if (frameTimer > frameLength) {
			currentFrame++;
			if (currentFrame >= smokeTextures.length) {
				currentFrame = 0;
			}

			while (frameTimer > frameLength) {
				frameTimer -= frameLength;
			}

			if (smoke.material.map !== smokeTextures[currentFrame]) {
				smoke.material.map = smokeTextures[currentFrame];
			}


		}

	}




	if (leaves.length > 0) {
		let leafXSpeed = 1;
		let leafYSpeed = .5;

		let leafRotationSpeed = Math.PI / 6;

		let leafXSpeedRange = .03;
		let leafYSpeedRange = .01;
		let leafRotationSpeedRange = .01;

		let leavesPadding = 10;

		for (let i = 0; i < leafCount; i++) {

			leaves[i].position.x += (leafXSpeed + (leafXSpeedRange * (i % 10))) * deltaTime;
			leaves[i].position.y -= (leafYSpeed + (leafYSpeedRange * (i % 10))) * deltaTime;

			leaves[i].rotation.y += (leafRotationSpeedRange + (leafRotationSpeedRange * (i % 10))) * deltaTime;

			if (leaves[i].position.x < boundLeft - leavesPadding || leaves[i].position.y > boundTop + leavesPadding) {
				scene.remove(leaves[i]);
				//leaves[i].material.opacity = 0;
			} else {
				scene.add(leaves[i]);
				//leaves[i].material.opacity = 1;
			}


			if (leaves[i].position.x > boundRight + leavesPadding || leaves[i].position.y < boundBottom - leavesPadding) {

				leaves[i].position.x = randomRange(leafRangeX[0], leafRangeX[1]);
				leaves[i].position.y = randomRange(leafRangeY[0], leafRangeY[1]);

			}
		}
	}




	if (camera.position.x < boundLeft) {
		camera.position.x = boundLeft;
		controls.target.x = boundLeft;
		controls.update();
	}

	if (camera.position.x > boundRight) {
		camera.position.x = boundRight;
		controls.target.x = boundRight;
		controls.update();
	}

	if (camera.position.y > boundTop) {
		camera.position.y = boundTop;
		controls.target.y = boundTop;
		controls.update();
	}

	if (camera.position.y < boundBottom) {
		camera.position.y = boundBottom;
		controls.target.y = boundBottom;
		controls.update();
	}

	//console.log(camera.position);
	//console.log("boundzoom: " + boundZoom);

	if (camera.position.z < boundZoom) {
		camera.position.z = boundZoom;
		//controls.target.z = boundZoom;
		controls.update();
	}

	renderer.render(scene, camera);
}



window.addEventListener("resize", OnWindowResize);
window.addEventListener("mousedown", OnMouseDown);
window.addEventListener("mouseup", OnMouseUp);
window.addEventListener("pointerdown", OnPointerDown);
window.addEventListener("touchstart", OnTouchStart);
window.addEventListener("touchend", OnTouchEnd);


renderer.setAnimationLoop(animate);
