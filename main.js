import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { DragControls } from "three/addons/controls/DragControls.js";
//https://github.com/yomotsu/camera-controls
//https://github.com/yomotsu/camera-controls/blob/fb7b5751043a246b40ec90e45eb09a4ce1b68fe0/examples/fit-and-padding.html

const scene = new THREE.Scene();
scene.background = new THREE.Color("#ffb79d");

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.up.set(0, 0, 1);
camera.position.z = 5;

const directions = [
  { x: 1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: -1, z: 0 },
];
let directionIndex = 0;

{
  const skyColor = 0xb1e1ff; // light blue
  const groundColor = 0xb97a20; // brownish orange
  const intensity = 2;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(light);
}

const light1 = new THREE.DirectionalLight(0xffffff, 3);
light1.position.set(10, 10, 5); //.normalize();
light1.castShadow = true;

light1.shadow.mapSize.width = 512;
light1.shadow.mapSize.height = 512;
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 500;
const pointLightHelper = new THREE.PointLightHelper(light1, 1);
scene.add(pointLightHelper);
scene.add(light1);

const light2 = new THREE.AmbientLight(0xcccccc);
scene.add(light2);

const planeGeometry = new THREE.PlaneGeometry(20, 20, 32);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xf0f0f0,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.z = -0.501;
plane.receiveShadow = true;
scene.add(plane);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
//controls.minAzimuthAngle = 0;
//controls.maxAzimuthAngle = 0;
controls.zoomToCursor = true;
controls.maxPolarAngle = Math.PI / 2;
//controls.minPolarAngle = 0;
//controls.maxPolarAngle = 0;
//controls.update();

const buttonContainer = document.createElement("div");
buttonContainer.className = "buttons";
document.body.appendChild(buttonContainer);

buttonContainer.appendChild(
  createButton("grow", function () {
    let { x, y, z } = group.children[group.children.length - 1].position;
    let direction = directions[directionIndex];
    let { cube } = makeNiceCube(
      x + direction.x,
      y + direction.y,
      z + direction.z,
    );

    group.add(cube);

    cube.directionAddedIndex = directionIndex;
  }),
);

buttonContainer.appendChild(
  createButton("turn and grow", function () {
    // first update the direction
    directionIndex = (directionIndex + 1) % directions.length;
    let direction = directions[directionIndex];

    let { x, y, z } = group.children[group.children.length - 1].position;
    let { cube } = makeNiceCube(
      x + direction.x,
      y + direction.y,
      z + direction.z,
    );
    cube.directionAddedIndex = directionIndex;
    group.add(cube);
  }),
);

buttonContainer.appendChild(
  createButton("remove", function () {
    if (group.children.length > 1) {
      group.remove(group.children[group.children.length - 1]);
      directionIndex =
        group.children[group.children.length - 1].directionAddedIndex;
    }
  }),
);
let isDraggingThing = false;
const group = new THREE.Object3D();
for (let i = 0; i < 1; ++i) {
  let { cube } = makeNiceCube(i, 0, 0);
  cube.directionAddedIndex = directionIndex;
  cube.castShadow = true;
  group.add(cube);
}
if (false) {
  const dragcontrols = new DragControls(
    group.children,
    camera,
    renderer.domElement,
  );
  dragcontrols.addEventListener("drag", animate);
  dragcontrols.addEventListener("dragstart", () => (isDraggingThing = true));
  dragcontrols.addEventListener("dragend", () => (isDraggingThing = false));
} //default is false
scene.add(group);

function createButton(label, onClick) {
  const button = document.createElement("button");
  button.innerHTML = label;
  button.onclick = onClick;
  return button;
}

function makeNiceCube(x, y, z) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const outlineGeom = new THREE.BoxGeometry(1.01, 1.01, 1.01);
  const edges = new THREE.EdgesGeometry(outlineGeom);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x000000 }),
  );
  line.position.set(x, y, z);

  const material = new THREE.MeshLambertMaterial({
    color: new THREE.Color(`hsl(${Math.random() * 360}, 60%, 90%)`),
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z);
  cube.castShadow = true;
  return { cube, line };
}

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  animate();
}

function animate() {
  //group.rotateZ(0.001);
  renderer.render(scene, camera);
  //controls.update();
}
