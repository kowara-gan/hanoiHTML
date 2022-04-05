import * as THREE from 'three';
import { CylinderGeometry } from 'three';
import * as Hanoi from '../hanoi';
//円盤オブジェクト
export type Discs = {
  tick: (board: Hanoi.Hanoi) => void;
};
//初期化
export const init = (scene: THREE.Scene): Discs => {
  const geometry = new CylinderGeometry(0.5, 0.5, 0.5, 32);
  const material =new THREE.MeshPhongMaterial();
  const discsMesh = new THREE.InstancedMesh(geometry, material, 13);

  scene.add(discsMesh);

  const tmpObject = new THREE.Object3D();
  const tmpColor = new THREE.Color();

  return {
    tick: (board: Hanoi.Hanoi) => {
        for (let x = 0; x < 3; x++) {
            for(let y = 0; y < Hanoi.DISK_NUM; y++){
                const id = x*4 + y;
                //id毎の空間の円盤の大きさを得る
                const space =board.getSpaceState(x,y);
                if (space == undefined) {
                    tmpObject.scale.setScalar(0);//円盤がなければ大きさ０
                }else{
                    //id毎の空間に円盤を設定（位置と大きさと色）
                    tmpObject.position.set((x - 1)*2, y*0.5, 0);
                    tmpObject.rotation.x = 0;
                    tmpObject.rotation.y = 0;
                    tmpObject.rotation.z = 0;
                    tmpObject.scale.set((space+1)*0.45,1,(space+1)*0.45);
                    setColor(tmpColor,space);
                    discsMesh.setColorAt(id,tmpColor);
                }
            tmpObject.updateMatrix();
            discsMesh.setMatrixAt(id, tmpObject.matrix);
            }
        }
        //id=12で選択中の円盤を設定（位置と大きさと色）
        const id = Hanoi.DISK_NUM*3;
        if(board.isSelect){
            tmpObject.position.set((board.getPreMove() - 1)*2, 3, 0);
            tmpObject.rotation.x = 0;
            tmpObject.rotation.y = 0;
            tmpObject.rotation.z = 0;
            tmpObject.scale.set((board.selectDisk+1)*0.45,1,(board.selectDisk+1)*0.45);
            setColor(tmpColor,board.selectDisk);
            discsMesh.setColorAt(id,tmpColor);
        }else{
            tmpObject.scale.setScalar(0);
        }
        tmpObject.updateMatrix();
        discsMesh.setMatrixAt(id, tmpObject.matrix);

        discsMesh.instanceMatrix.needsUpdate = true;
        if (discsMesh.instanceColor) discsMesh.instanceColor.needsUpdate = true;
    },
  };
};
//色を設定する
const setColor=(tmpColor:THREE.Color,size:number)=>{
switch(size){
    case 0:
        tmpColor.setRGB(0.9,0.1,0.1);
        break;
    case 1:
        tmpColor.setRGB(0.1,0.1,0.9);
        break;
    case 2:
        tmpColor.setRGB(0.8,0.5,0);
        break;
    case 3:
        tmpColor.setRGB(0.03,0.5,0.03);
        break;
    default:
        tmpColor.setRGB(1,1,1);
}
};