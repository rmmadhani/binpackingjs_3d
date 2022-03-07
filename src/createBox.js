import * as THREE from "three";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function createBox({ h, w, d, x = 0, y = 0, z = 0, color = getRandomColor() }) {
  const boxGeometry = new THREE.BoxGeometry(h, w, d);
  boxGeometry.translate(x, y, z);
  const boxMaterial = new THREE.MeshLambertMaterial({ color });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  return box;
}

export default createBox;
