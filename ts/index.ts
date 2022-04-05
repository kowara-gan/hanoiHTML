import * as Hanoi from './hanoi';
import * as View from './ui/view';
import * as Times from './times';

window.addEventListener('DOMContentLoaded', () =>  {
  const board=new Hanoi.Hanoi();
  const view = View.init();
  //クリック時の操作
  const onClick = (e: Event) => {
    if (!(e instanceof MouseEvent)) return;
    const x = (e.offsetX / window.innerWidth) * 2 - 1;//画面中央から-1~1で上下
    const y = (e.offsetY / window.innerHeight) * 2 - 1;//画面中央から-1~1で左右
    const id = view.pickArea(x, y);      
    if (id !== null){board.selectTower(id);Times.deleteWait();}
    updataMoveNum();    
  };
  //経過手数を更新
  const updataMoveNum = ()=>{
    moveNum.innerHTML =  (Math.floor(board.moves.length/2)).toString();
  }
  //一つ戻る時の操作
  const onUndo = () => {
      const id=board.moves.pop();
      if (id !== undefined)board.selectTower(id);
      board.moves.pop();
      updataMoveNum();
      Times.deleteWait();
  };
  //自動攻略の時の操作
  const onAuto = async () => {
      onReset();
      await performAuto();
  };
  //自動攻略を遂行
  const performAuto = async () => {
      const nextID :number|undefined = board.getAutoMove();
      if(nextID==undefined)return;
      board.selectTower(nextID);
      updataMoveNum();
      await Times.wait(500);
      await performAuto();
  };
  //リセットを遂行
  const onReset = () => {
    board.reset();
    updataMoveNum();
    Times.deleteWait();
  };
  //リサイズを遂行
  const onResize = () => {
    view.resize(
      window.innerWidth,
      window.innerHeight,
      window.devicePixelRatio
    );
  };
  onResize();
  //htmlの要素を入手、イベント関数を登録
  const container = document.querySelector('#canvas-container')!;
  container.appendChild(view.getDomElement());
  container.addEventListener('click', onClick);
  const moveNum = document.querySelector('#moveNum')!;
  moveNum.innerHTML = '0';
  const undo = document.querySelector('#undo')!;
  undo.addEventListener('click', onUndo);
  const reset = document.querySelector('#reset')!;
  reset.addEventListener('click', onReset);
  const auto = document.querySelector('#auto')!;
  auto.addEventListener('click', onAuto);
  window.addEventListener('resize', onResize);
  //viewのtickをループさせて画面にゲーム情報を更新し続ける
  view.setAnimationLoop(() => {
    view.tick(board);
  });
});