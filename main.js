import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import gsap from "gsap";
import Stats from "stats.js";

//https://github.com/yomotsu/camera-controls
//https://github.com/yomotsu/camera-controls/blob/fb7b5751043a246b40ec90e45eb09a4ce1b68fe0/examples/fit-and-padding.html

const keyPressed = {};
document.addEventListener("keydown", (e) => {
  if (!keyPressed[e.key]) {
    keyPressed[e.key] = new Date().getTime();
  }
});
document.addEventListener("keyup", (e) => {
  delete keyPressed[e.key];
});

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom

stats.dom.style.position = "absolute";
stats.dom.style.top = "0px";
stats.dom.style.right = "0px";
stats.dom.style.left = "unset";
document.body.appendChild(stats.dom);
const directions = [
  { x: 1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: -1, z: 0 },
];
let directionIndex = 0;

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

const loader = new GLTFLoader();

function addModel(url, x, y, z) {
  loader.load(
    url,
    function (gltf) {
      gltf.scene.position.set(x, y, z);
      scene.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );
}

for (let i = 0; i < 10; i++) {
  addModel("./GLB/character-male-b.glb", Math.random() * 10 - 5, 0, 0);
}
for (let i = 0; i < 10; i++) {
  addModel("./GLB2/bedBunk.glb", Math.random() * 10 - 5, 0, 0);
}
{
  const skyColor = 0xb1e1ff; // light blue
  const groundColor = 0xb97a20; // brownish orange
  const intensity = 2;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(light);
}
{
  const light1 = new THREE.DirectionalLight(0xff00ff, 2);
  light1.position.set(10, 10, 5); //.normalize();
  light1.castShadow = true;
  light1.shadow.mapSize.width = 512;
  light1.shadow.mapSize.height = 512;
  light1.shadow.camera.near = 0.5;
  light1.shadow.camera.far = 500;
  const pointLightHelper = new THREE.PointLightHelper(light1, 1);
  scene.add(pointLightHelper);
  scene.add(light1);
}
{
  const light1 = new THREE.DirectionalLight(0xffff00, 2);
  light1.position.set(10, -10, 5); //.normalize();
  light1.castShadow = true;
  light1.shadow.mapSize.width = 512;
  light1.shadow.mapSize.height = 512;
  light1.shadow.camera.near = 0.5;
  light1.shadow.camera.far = 500;
  const pointLightHelper = new THREE.PointLightHelper(light1, 1);
  scene.add(pointLightHelper);
  scene.add(light1);
}
{
  const light1 = new THREE.DirectionalLight(0x00ffff, 2);
  light1.position.set(-10, -10, 5); //.normalize();
  light1.castShadow = true;
  light1.shadow.mapSize.width = 512;
  light1.shadow.mapSize.height = 512;
  light1.shadow.camera.near = 0.5;
  light1.shadow.camera.far = 500;
  const pointLightHelper = new THREE.PointLightHelper(light1, 1);
  scene.add(pointLightHelper);
  scene.add(light1);
}
{
  const light1 = new THREE.DirectionalLight(0xffffff, 2);
  light1.position.set(-10, 10, 5); //.normalize();
  light1.castShadow = true;
  light1.shadow.mapSize.width = 512;
  light1.shadow.mapSize.height = 512;
  light1.shadow.camera.near = 0.5;
  light1.shadow.camera.far = 500;
  const pointLightHelper = new THREE.PointLightHelper(light1, 1);
  scene.add(pointLightHelper);
  scene.add(light1);
}
const planeGeometry = new THREE.PlaneGeometry(20, 20, 32);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xc2ba92,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.z = -0.501;
plane.receiveShadow = true;
scene.add(plane);

const controls = new OrbitControls(camera, renderer.domElement);

controls.zoomToCursor = true;
controls.maxPolarAngle = Math.PI / 2 - 0.001;

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

const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(2, 2, 1);
sphere.castShadow = true;
scene.add(sphere);

const group = new THREE.Object3D();
for (let i = 0; i < 1; ++i) {
  let { cube } = makeNiceCube(i, 0, 0);
  cube.directionAddedIndex = directionIndex;
  cube.castShadow = true;
  group.add(cube);
}

//const dragcontrols1 = new DragControls([sphere], camera, renderer.domElement);

const dragcontrols = new DragControls(
  group.children,
  camera,
  renderer.domElement,
);

let startPosition = new THREE.Vector3();

dragcontrols.addEventListener("dragstart", (event) => {
  controls.enabled = false;
  event.object.material.emissive.set(0xaaaaaa);
  let rotZ = event.object.rotation.z;
  gsap.to(event.object.rotation, { duration: 0.3, z: rotZ + Math.PI / 2 });
  startPosition.copy(event.object.position);
});

dragcontrols.addEventListener("drag", (event) => {
  if (keyPressed["x"]) {
    event.object.position.set(
      event.object.position.x,
      startPosition.y,
      startPosition.z,
    );
  } else if (keyPressed["y"]) {
    event.object.position.set(
      startPosition.x,
      event.object.position.y,
      startPosition.z,
    );
  } else if (keyPressed["z"]) {
    event.object.position.set(
      startPosition.x,
      startPosition.y,
      event.object.position.z,
    );
  }
});
dragcontrols.addEventListener("dragend", (event) => {
  controls.enabled = true;
  event.object.material.emissive.set(0x000000);
});

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
    color: new THREE.Color(`hsl(${Math.random() * 360}, 60%, 60%)`),
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
  stats.begin();
  renderer.render(scene, camera);
  stats.end();
  if (false) {
    Object.entries(keyPressed).forEach((e) => {
      console.log(e);
      const [key, start] = e;
      const duration = new Date().getTime() - start;

      // increase momentum if key pressed longer
      let momentum = Math.sqrt(duration + 200) * 0.01 + 0.05;

      // adjust for actual time passed
      // momentum = (momentum * delta) / 0.016;

      // increase momentum if camera higher
      momentum = momentum + camera.position.z * 0.02;

      switch (key) {
        case "w":
          camera.translateY(momentum);
          controls.update();
          break;
        case "s":
          camera.translateY(-momentum);
          controls.update();
          break;
        case "d":
          camera.translateX(momentum);
          controls.update();
          break;
        case "a":
          camera.translateX(-momentum);
          controls.update();
          break;
        default:
      }
    });
  }
}
