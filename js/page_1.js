

import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { DeviceOrientationControls } from './DeviceOrientationControls.js';
import { normalize } from 'three/src/math/MathUtils.js';

console.log(THREE);


let scene = new THREE.Scene();


let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


camera.position.z = 5;


let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let texturePrefix = "./page_1/scene_";
let cubeTextures = [];
let currentChanel = 0;

function SetBackground() {



	console.log("here");

	cubeTextures[0] = new THREE.CubeTexture([

		leftTexture_0,
		rightTexture,
		topTexture,
		bottomTexture,
		backTexture,
		frontTexture

	]);

	cubeTextures[1] = new THREE.CubeTexture([

		leftTexture_1,
		rightTexture,
		topTexture,
		bottomTexture,
		backTexture,
		frontTexture

	]);

	cubeTextures[2] = new THREE.CubeTexture([

		leftTexture_2,
		rightTexture,
		topTexture,
		bottomTexture,
		backTexture,
		frontTexture

	]);


	for (let i = 0; i < cubeTextures.length; i++) {
		cubeTextures[i].needsUpdate = true;
		cubeTextures[i].colorSpace = THREE.SRGBColorSpace;
		renderer.initTexture(cubeTextures[i]);
	}
	scene.background = cubeTextures[0];

	console.log(scene.background);

}


let imageLoader = new THREE.ImageLoader();

let loadTarget = 8;
let loaded = 0;

let frontTexture = imageLoader.load(texturePrefix + "front.jpg", function(image) {
	loaded++;
	if (loaded == loadTarget) {
		SetBackground();
	}
});


let backTexture = imageLoader.load(texturePrefix + "back.jpg", function(image) {
	loaded++;
	if (loaded == loadTarget) {
		SetBackground();
	}
});

let leftTexture_0 = imageLoader.load(texturePrefix + "left_0.jpg", function(image) {
	loaded++;
	if (loaded == loadTarget) {
		SetBackground();
	}
});

let leftTexture_1 = imageLoader.load(texturePrefix + "left_1.jpg", function(image) {
	loaded++;
	if (loaded == loadTarget) {
		SetBackground();
	}
});

let leftTexture_2 = imageLoader.load(texturePrefix + "left_2.jpg", function(image) {
	loaded++;
	if (loaded == loadTarget) {
		SetBackground();
	}
});

let rightTexture = imageLoader.load(texturePrefix + "right.jpg", function(image) {
	loaded++;
	if (loaded == loadTarget) {
		SetBackground();
	}
});

let topTexture = imageLoader.load(texturePrefix + "top.jpg", function(image) {
	loaded++;
	if (loaded == loadTarget) {
		SetBackground();
	}
});

let bottomTexture = imageLoader.load(texturePrefix + "bottom.jpg", function(image) {
	loaded++;
	if (loaded == loadTarget) {
		SetBackground();
	}
});


//let cubeTexture = new THREE.CubeTexture([
//
//	leftTexture,
//	rightTexture,
//	topTexture,
//	bottomTexture,
//	backTexture,
//	frontTexture
//
//]);
//scene.background = cubeTexture;
//
//let environment = new THREE.CubeTextureLoader().setPath("./page_1/").load([
//	texturePrefix + "left_0.jpg",
//	texturePrefix + "right.jpg",
//	texturePrefix + "top.jpg",
//	texturePrefix + "bottom.jpg",
//	texturePrefix + "back.jpg",
//	texturePrefix + "front.jpg"
//], function(texture) {
//
//	console.log(texture);
//renderer.initTexture(texture);
//	scene.background = texture;
//
//});


let raycaster = new THREE.Raycaster();


let geometry = new THREE.BoxGeometry(1.3, 1.3, 1.3);
let material = new THREE.MeshBasicMaterial({ transparent: true, opacity: .0 });
material.transparent = true;
material.opacity = 0;
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cube.position.x = -3;
cube.position.z = 4.7;


let desktopControls = new PointerLockControls(camera, renderer.domElement);
let mobileControls = null;
console.log(desktopControls);
let confirmDevice = false;

function OnDeviceTilt(e) {

	console.log(e);

	if (!confirmDevice && e.alpha !== null && e.beta !== null && e.gamma !== null) {
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
	pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;


	raycaster.setFromCamera(pointer, camera);
	let intersects = raycaster.intersectObject(cube);

	if (intersects.length > 0) {

		console.log(intersects[0]);

		if (cubeTextures.length > 0) {

			console.log("here");

			currentChanel++;
			if (currentChanel >= cubeTextures.length) currentChanel = 0;
			scene.background = cubeTextures[currentChanel];


		}
		//intersects[0].object.material.color.set('#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'));

	}

}


function OnMouseDown(e) {
	if (e.target !== document.getElementById("p1-next")) {
		desktopControls.lock();
	}
};

function OnMouseUp(e) {
	if (mobileControls === null) {
		desktopControls.unlock();
	}
}

function OnTouchStart(e) {
	if (e.target !== document.getElementById("p1-next") && mobileControls === null) {
		desktopControls.lock();
	}
}

function OnTouchEnd(e) {
	if (mobileControls === null) {
		desktopControls.unlock();
	}
}



let previousButtons = [];

function animate() {

	if (mobileControls !== null) {

		mobileControls.update();

	} else {
		let gamepads = navigator.getGamepads();

		for (let i = 0; i < gamepads.length; i++) {

			let currentGamepad = gamepads[i];

			if (currentGamepad !== null) {

				let stickX = currentGamepad.axes[0];
				let stickY = -currentGamepad.axes[1];
				let rawInput = new THREE.Vector2(stickX, stickY);
				let normalStick = new THREE.Vector2(stickX, stickY).normalize().multiplyScalar(rawInput.length());

				if (stickX * stickX > .05) {
					camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), normalStick.x * -.01);
				}

				if (stickY * stickY > .05) {
					camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), normalStick.y * .01);
				}


				for (let j = 0; j < currentGamepad.buttons.length; j++) {

					if (currentGamepad.buttons[j].pressed) {
						console.log(j);
					}


					if (previousButtons[j] !== undefined && previousButtons[j] && previousButtons[j] !== currentGamepad.buttons[j].pressed) {


						switch (j) {

							case (14): {
								if (cubeTextures.length > 0) {
									currentChanel--;
									if (currentChanel < 0) currentChanel = cubeTextures.length - 1;
									scene.background = cubeTextures[currentChanel];
								}
							} break;

							case (15): {
								if (cubeTextures.length > 0) {
									currentChanel++;
									if (currentChanel >= cubeTextures.length) currentChanel = 0;
									scene.background = cubeTextures[currentChanel];
								}
							} break;

						}

					}
				}


				if (currentGamepad.buttons[5].pressed) {
					window.location.href = "page_2.html";
				}


				for (let j = 0; j < currentGamepad.buttons.length; j++) {
					previousButtons[j] = currentGamepad.buttons[j].pressed;
				}
			}

		}

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
