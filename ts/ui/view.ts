import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as Hanoi from '../hanoi';
import * as Discs from './discs';
import * as Areas from './areas';
import * as Frame from './frame';
//画面全体を運営する
export type View = {
  getDomElement: () => HTMLCanvasElement;//キャンバス要素を登録するときに使用
  setAnimationLoop: (tick: () => void) => void;
  resize: (width: number, height: number, pixelRatio: number) => void;
  tick: (board: Hanoi.Hanoi) => void;
  pickArea: (x: number, y: number) => number | null;
};
//初期化
export const init = (): View => {
  //レンダラー生成
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(600, 600);
  //シーン生成
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 5, 40);
  //環境光
  const ambientLight = new THREE.AmbientLight();
  ambientLight.intensity = 0.5;
  scene.add(ambientLight);
  //スポットライト
  const spotLight = new THREE.SpotLight();
  spotLight.position.set(10, -10, 20);
  spotLight.angle = 0.15;
  spotLight.penumbra = 1;
  scene.add(spotLight);
  //ポイントライト
  const pointLight = new THREE.PointLight();
  pointLight.position.set(-10, 10, -10);
  scene.add(pointLight);
  //カメラ設定
  const defaultFov = 50;
  const camera = new THREE.PerspectiveCamera();
  camera.fov = defaultFov;
  camera.position.set(0, 4, 9);
  camera.lookAt(0, 0, 0);
  //カメラコントロール用
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.maxPolarAngle = Math.PI / 2;
  controls.enabled =true;//オフにすると固定される
  //オブジェクト初期化
  const discs = Discs.init(scene);
  const areas = Areas.init(scene);
  Frame.init(scene);

  return {
    getDomElement: () => renderer.domElement,
    setAnimationLoop: (tick: () => void) => renderer.setAnimationLoop(tick),
    resize: (width: number, height: number, pixelRatio: number) => {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      if (width > height) {
        camera.fov = defaultFov;
      } else {
        const f = ((defaultFov / 2) * Math.PI) / 180;
        camera.fov =
          2 * Math.atan2(height * Math.sin(f), width * Math.cos(f)) * 180 /
          Math.PI;
      }
      camera.updateProjectionMatrix();
    },
    tick: (board: Hanoi.Hanoi) => {
      discs.tick(board);
      areas.tick(board);
      controls.update();
      renderer.render(scene, camera);
    },
    pickArea: (x: number, y: number) => {
      return areas.pick(camera, x, y);
    }
  };
};
