import * as Hanoi from './hanoi';
import * as View from './ui/view';

window.addEventListener('DOMContentLoaded', () =>  {
  const board=new Hanoi.Hanoi();
  const view = View.init();
  let startTime = Date.now();
  const onClick = (e: Event) => {
    if (!(e instanceof MouseEvent)) return;
    const x = (e.offsetX / window.innerWidth) * 2 - 1;
    const y = (e.offsetY / window.innerHeight) * 2 - 1;
    const id = view.pickArea(x, y);      
    if (id !== null)board.selectTower(id);
    moveNum.innerHTML = board.moves.length.toString(); 
    startTime = Date.now();   
  };
  const onUndo = () => {
      const id=board.moves.pop();
      if (id !== undefined)board.selectTower(id);
      board.moves.pop();
      moveNum.innerHTML = board.moves.length.toString();
  };
  const times:NodeJS.Timeout[]=[];
  const wait = async (ms:number)=>new Promise(resolve=>times.push(setTimeout(resolve,ms)));
  const onAuto = async () => {
      board.reset();
      moveNum.innerHTML = board.moves.length.toString();
      await performAuto();
  };
  const performAuto = async () => {
      const nextID :number|undefined = board.getAutoMove();
      if(nextID==undefined)return;
      board.selectTower(nextID);
      moveNum.innerHTML = board.moves.length.toString();
      await wait(500);
      await performAuto();
  };
  const onResize = () => {
    view.resize(
      window.innerWidth,
      window.innerHeight,
      window.devicePixelRatio
    );
  };
  
  onResize();
  window.addEventListener('resize', onResize);
  view.setAnimationLoop(() => {
    let elapsed = Date.now() - startTime;
    view.tick(board, elapsed);
  });
  const container = document.querySelector('#canvas-container')!;
  container.appendChild(view.getDomElement());
  container.addEventListener('click', onClick);
  const moveNum = document.querySelector('#moveNum')!;
  moveNum.innerHTML = '0';
  const undo = document.querySelector('#undo')!;
  undo.addEventListener('click', onUndo);
  const auto = document.querySelector('#auto')!;
  auto.addEventListener('click', onAuto);
});