import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as Hanoi from '../hanoi';
import * as Discs from './discs';
import * as Areas from './areas';
import * as Frame from './frame';

export type View = {
  getDomElement: () => HTMLCanvasElement;
  setAnimationLoop: (tick1: () => void) => void;
  resize: (width: number, height: number, pixelRatio: number) => void;
  tick: (board: Hanoi.Hanoi, elapsed: number) => void;
  pickArea: (x: number, y: number) => number | null;
  orbitSwith:(onoff :boolean)=>void;
};

export const init = (): View => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(600, 600);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 5, 40);

  const ambientLight = new THREE.AmbientLight();
  ambientLight.intensity = 0.5;
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight();
  spotLight.position.set(10, -10, 20);
  spotLight.angle = 0.15;
  spotLight.penumbra = 1;
  scene.add(spotLight);

  const pointLight = new THREE.PointLight();
  pointLight.position.set(-10, 10, -10);
  scene.add(pointLight);

  const defaultFov = 50;
  const camera = new THREE.PerspectiveCamera();
  camera.fov = defaultFov;
  camera.position.set(0, 4, 9);
  camera.lookAt(0, 0, 0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.maxPolarAngle = Math.PI / 2;
  controls.enabled =true;

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
    tick: (board1: Hanoi.Hanoi, elapsed: number) => {
      discs.tick(board1,elapsed);
      areas.tick();
      controls.update();
      renderer.render(scene, camera);
    },
    pickArea: (x: number, y: number) => {
      return areas.pick(camera, x, y, discs.getMeshes());
    },
    orbitSwith:(onoff :boolean)=>{
      controls.enabled=onoff;
    }
  };
};
