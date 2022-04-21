import * as THREE from 'three';
import { CylinderGeometry } from 'three';
//台の形を作る
const genGeometry = () => {
  const vertices: number[] = [];
  //上の正方形
  vertices.push(- 3, 0.01, -3);
  vertices.push(- 3, 0.01, 3);
  vertices.push(3, 0.01, -3);
  vertices.push(3, 0.01, 3);
  const axis = new THREE.Vector3(0, 1, 0);
  //横の台形（90度づつ4つ）
  for (let i = 0; i < 4; i++) {
    const ary = [
      new THREE.Vector3(3 - 0.01, 0.01, -3 + 0.01),
      new THREE.Vector3(3 - 0.01, 0.01, 3 - 0.01),
      new THREE.Vector3(3.3, 0.01, 3.3),
      new THREE.Vector3(3.3, 0.01, -3.3),
      new THREE.Vector3(3.7, -0.4, 3.7),
      new THREE.Vector3(3.7, -0.4, -3.7),
    ];
    for (const v of ary) {
      const vv = v.applyAxisAngle(axis, (Math.PI / 2) * i);
      vertices.push(...vv.toArray());
    }
  }
  //面張り
  const indices: number[] = [];
  indices.push(0 ,1 ,2);
  indices.push(1, 3 ,2);
  for (let i = 0; i < 4; i++) {
  indices.push(4 + i * 6, 5 + i * 6, 6 + i * 6);
  indices.push(4 + i * 6, 6 + i * 6, 7 + i * 6);
  indices.push(6 + i * 6, 8 + i * 6, 7 + i * 6);
  indices.push(8 + i * 6, 9 + i * 6, 7 + i * 6);
}
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(vertices), 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
};
//初期化
export const init = (scene: THREE.Scene) => {
  //台を設置
  const geometry = genGeometry();
  geometry.computeVertexNormals();
  geometry.translate(0, -0.2, 0);
  const material = new THREE.MeshLambertMaterial({ color: '#333333' });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(1,1,0.5);//正方形なので横を縮める
  scene.add(mesh);
  //杭を設置
  const pole_material = new THREE.MeshLambertMaterial({ color: '#333333' });
  for(let i=0;i<3;i++){
    const pole_geometry = new CylinderGeometry(0.1, 0.1, 3, 32);
    pole_geometry.translate((i-1)*2, 1, 0);
    scene.add(new THREE.Mesh(pole_geometry, pole_material));
  }
};
