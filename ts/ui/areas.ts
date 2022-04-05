import * as THREE from 'three';
import * as Hanoi from '../hanoi';
//クリック判定用エリア
export type Areas = {
  tick: (board: Hanoi.Hanoi) => void;
  pick: (
    camera: THREE.Camera,
    x: number,
    y: number,
  ) => number | null;
};
//初期化
export const init = (scene: THREE.Scene): Areas => {
  const geometry = new THREE.BoxGeometry(1.8, 1.8, 3);
  const material = new THREE.MeshStandardMaterial();
  const areasMesh = new THREE.InstancedMesh(geometry, material, 3);

  scene.add(areasMesh);

  const tmpObject = new THREE.Object3D();
  const tmpColor = new THREE.Color();

  areasMesh.material.transparent=true;
  areasMesh.material.opacity=0.1;
  areasMesh.material.depthTest=false;

  return {
    //毎フレーム呼ばれる
    tick: (board: Hanoi.Hanoi) => {
      for (let i = 0; i < 3; i++) {
        const id = i;
        //id毎のオブジェクトの位置を設定
        tmpObject.position.set(i*2-2, 1, 0);
        tmpObject.rotation.x = -Math.PI / 2;
        tmpObject.rotation.y = 0;
        tmpObject.rotation.z = 0;
        tmpObject.scale.setScalar(1);
        tmpObject.updateMatrix();
        areasMesh.setMatrixAt(id, tmpObject.matrix);
        //id毎のオブジェクトの色を設定
        const f= board.canSelect(i)?1:0;
        tmpColor.setRGB(1,f,1);
        areasMesh.setColorAt(id,tmpColor);
      }
      if(board.isFinish())areasMesh.material.opacity=0;
      else areasMesh.material.opacity=0.1;
      areasMesh.instanceMatrix.needsUpdate = true;
      if (areasMesh.instanceColor) areasMesh.instanceColor.needsUpdate = true;
    },
    //選択時にidを返す
    pick: (
      camera: THREE.Camera,
      x: number,
      y: number,
    ): number | null => {
      const mouse = new THREE.Vector2();
      mouse.x = x;
      mouse.y = -y;
      //カメラからレイを飛ばして最初に当たったオブジェクトのidを返す
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([areasMesh as THREE.Mesh]);
      if (intersects.length > 0 && intersects[0].object == areasMesh) {
        const id = intersects[0].instanceId;
        return typeof id === 'undefined' ? null : id;
      }
      return null;
    },
  };
};