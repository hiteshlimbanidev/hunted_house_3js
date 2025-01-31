import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import {
  doorData,
  floorData,
  genralBush,
  gravesData,
  roofData,
  wallData,
} from "./measurements";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * House
 */

// floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(floorData.width, floorData.height),
  new THREE.MeshStandardMaterial()
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// made house group from conviniance

const house = new THREE.Group();
scene.add(house);

// walls

const wall = new THREE.Mesh(
  new THREE.BoxGeometry(wallData.width, wallData.height, wallData.depth),
  new THREE.MeshStandardMaterial()
);
wall.position.y = wallData.height / 2;
house.add(wall);

// roof

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(
    roofData.radius,
    roofData.height,
    roofData.radialSegments
  ),
  new THREE.MeshStandardMaterial()
);
roof.position.y = wallData.height + roofData.height / 2;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// door

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorData.width, doorData.height),
  new THREE.MeshStandardMaterial()
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// bushes

const bushGeometry = new THREE.SphereGeometry(
  genralBush.radius,
  genralBush.width,
  genralBush.height
);

const bushMaterial = new THREE.MeshStandardMaterial();

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.1);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
house.add(bush1, bush2, bush3, bush4);

// graves

const gravesGeometry = new THREE.BoxGeometry(
  gravesData.width,
  gravesData.height,
  gravesData.depth
);
const gravesMaterial = new THREE.MeshStandardMaterial();

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  const grave = new THREE.Mesh(gravesGeometry, gravesMaterial);

  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  grave.position.x = x;
  grave.position.y = Math.random() * 0.4;
  grave.position.z = z;

  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#ffffff", 1.5);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
