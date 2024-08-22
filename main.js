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
    if (draggingObject) {
      if (e.key == "x" || e.key == "y" || e.key == "z") {
        startPosition.copy(draggingObject.position);
      }
    }
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
  { x: 0, y: 0, z: 1 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 0, z: -1 },
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
//camera.up.set(0, 0, 1);
camera.position.z = 5;
const group = new THREE.Object3D();
const loader = new GLTFLoader();
const characters = [];
function addModel(url, x, y, z) {
  loader.load(
    url,
    function (gltf) {
      gltf.scene.position.set(x, y, z);
      gltf.scene.rotation.set(0, Math.random() * Math.PI * 2, 0);

      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
        }
      });

      gltf.scene.castShadow = true;

      scene.add(gltf.scene);

      if (url.indexOf("character") > -1) {
        let y = Math.random() + 0.5;
        let r = gltf.scene.rotation.y;
        gsap.to(gltf.scene.position, {
          duration: 1 + y / 2,
          y,
          repeat: -1,
          yoyo: true, // Reverse the animation direction
          ease: "bounce.in", // Smooth easing function
        });
      }
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );
}

const models = [
  "./GLB/character-female-a.glb",
  "./GLB/character-female-b.glb",
  "./GLB/character-female-c.glb",
  "./GLB/character-female-d.glb",
  "./GLB/character-male-c.glb",
  "./GLB/character-male-b.glb",
  "./GLB2/cabinetTelevisionDoors.glb",
  "./GLB2/kitchenFridgeLarge.glb",
  "./GLB2/bedBunk.glb",
  "./GLB2/rugDoormat.glb",
  "./GLB2/shower.glb",
  "./GLB2/wall.glb",
  "./GLB2/wall.glb",
  "./GLB2/wall.glb",
  "./GLB2/wall.glb",
  "./GLB2/toilet.glb",
  "./GLB2/televisionModern.glb",
  "./GLB2/wallWindow.glb",
  "./GLB3/bevel-hq-brick-2x8.glb",
  //"./GLB4/firetruck.glb",
  //"./GLB4/ambulance.glb",
  //"./GLB4/tractor.glb",
  //"./GLB4/race.glb",
  // "./GLB4/sedan.glb",
  //"./GLB4/debris-drivetrain.glb",
];
const spread = 15;
models.forEach((m) => {
  for (let i = 0; i < 10; i++) {
    addModel(
      m,
      Math.random() * spread - spread / 2,
      0,
      Math.random() * spread - spread / 2,
    );
  }
});

{
  const skyColor = 0xb1e1ff; // light blue
  const groundColor = 0xb97a20; // brownish orange
  const intensity = 2;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(light);
}
if (true) {
  {
    const light1 = new THREE.DirectionalLight(0xff00ff, 2);
    light1.position.set(10, 5, -10); //.normalize();
    light1.castShadow = true;
    light1.shadow.mapSize.width = 5120;
    light1.shadow.mapSize.height = 5120;
    light1.shadow.camera.near = 0.5;
    light1.shadow.camera.far = 500;
    const pointLightHelper = new THREE.PointLightHelper(light1, 1);
    scene.add(pointLightHelper);
    scene.add(light1);
    gsap.to(light1.position, { duration: 10, z: 10, repeat: -1, yoyo: true });
  }
  {
    const light1 = new THREE.DirectionalLight(0xffff00, 2);
    light1.position.set(10, 5, 10); //.normalize();
    light1.castShadow = true;
    light1.shadow.mapSize.width = 5120;
    light1.shadow.mapSize.height = 5120;
    light1.shadow.camera.near = 0.5;
    light1.shadow.camera.far = 500;
    const pointLightHelper = new THREE.PointLightHelper(light1, 1);
    scene.add(pointLightHelper);
    scene.add(light1);
    gsap.to(light1.position, { duration: 10, z: -10, repeat: -1, yoyo: true });
  }
  {
    const light1 = new THREE.DirectionalLight(0x00ffff, 2);
    light1.position.set(-10, 5, -10); //.normalize();
    light1.castShadow = true;
    light1.shadow.mapSize.width = 5120;
    light1.shadow.mapSize.height = 5120;
    light1.shadow.camera.near = 0.5;
    light1.shadow.camera.far = 500;
    const pointLightHelper = new THREE.PointLightHelper(light1, 1);
    scene.add(pointLightHelper);
    scene.add(light1);
    gsap.to(light1.position, { duration: 10, z: 10, repeat: -1, yoyo: true });
  }
  {
    const light1 = new THREE.DirectionalLight(0xff0000, 2);
    light1.position.set(-10, 5, 10); //.normalize();
    light1.castShadow = true;
    light1.shadow.mapSize.width = 5120;
    light1.shadow.mapSize.height = 5120;
    light1.shadow.camera.near = 0.5;
    light1.shadow.camera.far = 500;
    const pointLightHelper = new THREE.PointLightHelper(light1, 1);
    scene.add(pointLightHelper);
    scene.add(light1);
    gsap.to(light1.position, { duration: 10, z: -10, repeat: -1, yoyo: true });
  }
}
const planeGeometry = new THREE.BoxGeometry(20, 0.1, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xc2ba92,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.y = -0.1;
plane.receiveShadow = true;

scene.add(plane);

const controls = new OrbitControls(camera, renderer.domElement);

controls.zoomToCursor = true;
controls.maxPolarAngle = Math.PI / 2 - 0.1;
controls.minPolarAngle = 0.1;
controls.update();
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

for (let i = 0; i < 1; ++i) {
  let { cube } = makeNiceCube(i, 0.5, 0);
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
  draggingObject = event.object;
  controls.enabled = false;
  event.object.material.emissive.set(0xaaaaaa);
  let rotY = event.object.rotation.y;
  gsap.to(event.object.rotation, { duration: 0.3, y: rotY + Math.PI / 2 });
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
  draggingObject = undefined;
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
