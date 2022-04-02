import * as THREE from 'three';

export type Areas = {
  tick: () => void;//board: Hanoi.Hanoi) => void;
  pick: (
    camera: THREE.Camera,
    x: number,
    y: number,
    obstacles: THREE.Mesh
  ) => number | null;
};

export const init = (scene: THREE.Scene): Areas => {
  const geometry = new THREE.BoxGeometry(1.8, 1.8, 3);
  const material = new THREE.MeshStandardMaterial();
  const cellsMesh = new THREE.InstancedMesh(geometry, material, 3);

  scene.add(cellsMesh);

  const tmpObject = new THREE.Object3D();
  const tmpColor = new THREE.Color();

  return {
    tick: () => {//board: Hanoi.Hanoi) => {
      const scores: (number | null)[] = [];
      for (let i = 0; i < 3; i++) {
        const id = i;
        let score: number | null = null;
        scores.push(score);
        tmpObject.position.set(i*2-2, 1, 0);
        tmpObject.rotation.x = -Math.PI / 2;
        tmpObject.rotation.y = 0;
        tmpObject.rotation.z = 0;
        
        tmpObject.scale.setScalar(1);
        tmpObject.updateMatrix();
        cellsMesh.setMatrixAt(id, tmpObject.matrix);
        cellsMesh.material.transparent=true;
        cellsMesh.material.opacity=0;
        cellsMesh.material.depthTest=false;
        cellsMesh.instanceMatrix.needsUpdate = true;
        if (cellsMesh.instanceColor) cellsMesh.instanceColor.needsUpdate = true;
      }
    },
    pick: (
      camera: THREE.Camera,
      x: number,
      y: number,
      obstacles: THREE.Mesh
    ): number | null => {
      const mouse = new THREE.Vector2();
      mouse.x = x;
      mouse.y = -y;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const targets = [cellsMesh as THREE.Mesh].concat(obstacles);
      const intersects = raycaster.intersectObjects(targets);
      if (intersects.length > 0 && intersects[0].object == cellsMesh) {
        const id = intersects[0].instanceId;
        return typeof id === 'undefined' ? null : id;
      }
      return null;
    },
  };
};