import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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
camera.position.z = 5;

const directions = [
  { x: 1, z: 0 },
  { x: 0, z: 1 },
  { x: -1, z: 0 },
  { x: 0, z: -1 },
];
let directionIndex = 0;

const light1 = new THREE.DirectionalLight(0xffffff, 3);
light1.position.set(20, 25, 50).normalize();
scene.add(light1);

const light2 = new THREE.AmbientLight(0xcccccc);
scene.add(light2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const buttonContainer = document.createElement("div");
buttonContainer.className = "buttons";
document.body.appendChild(buttonContainer);

buttonContainer.appendChild(
  createButton("grow", function () {
    let { x, y, z } = group.children[group.children.length - 1].position;
    let direction = directions[directionIndex];
    let { cube } = makeNiceCube(x + direction.x, y, z + direction.z);

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
    let { cube } = makeNiceCube(x + direction.x, y, z + direction.z);
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

const group = new THREE.Object3D();
for (let i = 0; i < 1; ++i) {
  let { cube } = makeNiceCube(i, 0, 0);
  cube.directionAddedIndex = directionIndex;
  group.add(cube);
}
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

  return { cube, line };
}

function animate() {
  group.rotateY(0.001);
  renderer.render(scene, camera);
  controls.update();
}
