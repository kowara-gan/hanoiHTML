import * as THREE from 'three';
import { CylinderGeometry } from 'three';
import * as Hanoi from '../hanoi';

export type Discs = {
  tick: (board: Hanoi.Hanoi, elapsed: number) => void;
  getMeshes: () => THREE.Mesh;
};

export const init = (scene: THREE.Scene): Discs => {
  const geometry = new CylinderGeometry(0.5, 0.5, 0.5, 32);
  const material =new THREE.MeshPhongMaterial({ color: '#d82a47' });
  const instancedMesh = new THREE.InstancedMesh(geometry, material, 6 * 6);
  scene.add(instancedMesh);
  const meshes: THREE.InstancedMesh = instancedMesh;

  const tmpObject = new THREE.Object3D();

  return {
    tick: (board: Hanoi.Hanoi, elapsed: number) => {
        for (let x = 0; x < 3; x++) {
            for(let y = 0; y < Hanoi.DISK_NUM; y++){
                const space =board.getSpaceState(x,y);
                if (space == undefined) {
                    tmpObject.scale.setScalar(0);
                }else{
                    tmpObject.position.set((x - 1)*2, y*0.5, 0);
                    tmpObject.rotation.x = 0;
                    tmpObject.rotation.y = 0;
                    tmpObject.rotation.z = 0;
                    tmpObject.scale.set((space+1)*0.45,1,(space+1)*0.45);
                }
            tmpObject.updateMatrix();
            const id = x*4 + y;
            meshes.setMatrixAt(id, tmpObject.matrix);
            }
        }
        if(board.isSelect){
            tmpObject.position.set(0, 3, 0);
            tmpObject.rotation.x = 0;
            tmpObject.rotation.y = 0;
            tmpObject.rotation.z = 0;
            tmpObject.scale.set((board.selectDisk+1)*0.45,1,(board.selectDisk+1)*0.45);
        }else{
            tmpObject.scale.setScalar(0);
        }
        tmpObject.updateMatrix();
        const id = Hanoi.DISK_NUM*3;
        meshes.setMatrixAt(id, tmpObject.matrix);
        meshes.instanceMatrix.needsUpdate = true;
    },
    getMeshes: () => meshes,
  };
};