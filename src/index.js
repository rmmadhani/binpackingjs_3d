import "./styles.css";
import * as THREE from "three";
import createBox from "./createBox";
import { BP3D } from "binpackingjs";

const OrbitControls = require("three-orbit-controls")(THREE);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  12,
  window.innerWidth / window.innerHeight,
  1,
  500
);
camera.position.set(60, 35);
camera.position.z = 60;
camera.lookAt(new THREE.Vector3(0, 0, 0));

const controls = new OrbitControls(camera);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(dirLight);

const hemiLight2 = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
hemiLight2.position.set(0, 0, 2);
scene.add(hemiLight2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

const geometryGround = new THREE.BoxGeometry(40, 0.5, 30);
geometryGround.translate(0, 0, 0);
const materialGround = new THREE.MeshLambertMaterial({ color: 0x006442 });
const cubeGround = new THREE.Mesh(geometryGround, materialGround);
scene.add(cubeGround);

// function getDimension(item) {
//   let dimensions;
//   switch (item.rot) {
//     case bp3d.ROTATION.WHD:
//       dimensions = { h: item.w, w: item.h, d: item.d };
//       break;
//     case bp3d.ROTATION.HWD:
//       dimensions = { h: item.h, w: item.w, d: item.d };
//       break;
//     case bp3d.ROTATION.HDW:
//       dimensions = { h: item.h, w: item.d, d: item.w };
//       break;
//     case bp3d.ROTATION.DHW:
//       dimensions = { h: item.d, w: item.h, d: item.w };
//       break;
//     case bp3d.ROTATION.DWH:
//       dimensions = { h: item.d, w: item.w, d: item.h };
//       break;
//     case bp3d.ROTATION.WDH:
//       dimensions = { h: item.w, w: item.d, d: item.h };
//       break;
//     default:
//       dimensions = { h: item.h, w: item.w, d: item.d };
//       break;
//   }
//   return dimensions;
// }

const items = [
  { h: 2, w: 2, d: 2, color: "blue" },
  { h: 1, w: 1, d: 1, color: "red" },
  // { h: 1, w: 3, d: 1, color: "green" },
  // { h: 1, w: 6, d: 3, color: "purple" },
  { h: 1, w: 1, d: 1, color: "yellow" }
  // { h: 1, w: 1, d: 4, pos: {}, rot: bp3d.ROTATION.HWD },
  // { h: 2, w: 3, d: 2, pos: {}, rot: bp3d.ROTATION.HWD },
  // { h: 5, w: 2, d: 5, pos: {}, rot: bp3d.ROTATION.HWD }
];

const unpackedBin = { h: 4, w: 4, d: 4, items: [] };
const geometryPallet = new THREE.BoxGeometry(
  unpackedBin.h,
  unpackedBin.w,
  unpackedBin.d
);
geometryPallet.translate(
  -15 + unpackedBin.h / 2,
  unpackedBin.w / 2 + 1,
  unpackedBin.d / 2
);
const materialPallet = new THREE.MeshLambertMaterial({ color: "yellow" });
const pallet = new THREE.Mesh(geometryPallet, materialPallet);
scene.add(pallet);

items.reduce(
  (acc, { h, w, d, color }) => {
    const box = createBox({
      h,
      w,
      d,
      x: h / 2 + acc.x,
      y: w - w / 2 + 1,
      z: acc.z + d / 2,
      color
    });
    scene.add(box);
    const x = acc.x + h + 1;
    const y = acc.y;
    const z = acc.z;
    return { x, y, z };
  },
  { x: -18, y: 0, z: -8 }
);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

const BinPacking3D = require("binpackingjs").BP3D;

const { Item, Bin, Packer } = BinPacking3D;

let bin1 = new Bin("Bin1", 4, 4, 4, 700);
let item1 = new Item("Item 1", 2, 2, 2, 200);
let item2 = new Item("Item 2", 2, 2, 2, 200);
let item3 = new Item("Item 3", 2, 2, 2, 200);
let item4 = new Item("Item 3", 1, 1, 1, 200);
let item5 = new Item("Item 3", 1, 1, 1, 200);
let packer = new Packer();

packer.addBin(bin1);
packer.addItem(item1);
packer.addItem(item2);
packer.addItem(item3);

// pack items into bin1
packer.pack();
console.log(bin1.items);
// items will be empty, all items was packed
console.log(packer.items);
// unfitItems will be empty, all items fit into bin1
console.log(packer.unfitItems);

const packMoreBtn = document.getElementById("packMore");
let i = 0;
packMoreBtn.onclick = () => {
  if (i <= bin1.items.length) {
    const item = bin1.items[i];
    // const { h, w, d } = getDimension(item);
    const { height: h, width: w, depth: d } = item;
    const box = createBox({
      h,
      w,
      d,
      x: item.position[0] + h / 2,
      y: item.position[1] + w / 2 + 1,
      z: item.position[2] + d / 2,
      color: item.color
    });
    scene.add(box);
    i += 1;
  }
};
