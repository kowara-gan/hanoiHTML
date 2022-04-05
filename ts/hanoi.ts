//タワーの情報
type TowerState = {
  disks:number[];
};
//盤面情報
type State = {
  board:TowerState[];
};
//円盤の合計の数
export const DISK_NUM:number=4;
//ハノイクラス
export class Hanoi{
  public state :State;
  public isSelect:boolean;
  public selectDisk:number;
  public moves: number[];//操作記録用配列
  public autoMoves: number[];//自動操作用配列

  constructor(){//初期化コンストラクタ
    this.state={board:new Array(3)};
    for(let i= 0; i < 3; i++){
      this.state.board[i]={disks:[]};
    }
    this.moves=[];
    this.autoMoves=[];
    for(let k=DISK_NUM-1;k>=0;k--){
      this.state.board[0].disks.push(k);
    }
    this.isSelect=false;
    this.selectDisk=-1;
    this.setAutoMoves();
  }
  //状態をリセットする
  reset = ():void =>{
    for(let i= 0; i < 3; i++){
      this.state.board[i].disks.splice(0);
    }
    for(let k=DISK_NUM-1;k>=0;k--){
      this.state.board[0].disks.push(k);
    }
    this.moves.splice(0);
    this.isSelect=false;
    this.selectDisk=-1;
    this.setAutoMoves();
  }
  //直前の移動を返す
  getPreMove = ():number =>{
    return this.moves[this.moves.length-1];
  }
  //クリアしたか
  isFinish = ():boolean =>{
    if(this.state.board[0].disks.length==0&&this.state.board[1].disks.length==0&&this.state.board[2].disks.length==DISK_NUM)
      return true;
    else return false;
  }
  //タワーを選択する
  selectTower = (towerNum:number):void =>{
    let topDisc = this.state.board[towerNum].disks[this.state.board[towerNum].disks.length-1];
     if(!this.isSelect){//選択状態でない
      this.trySelectDisc(towerNum,topDisc);
     }else{//選択状態
      this.trySetDisc(towerNum,topDisc);
     }
  }
  //topDiscを選択状態にする
  private trySelectDisc = (towerNum:number,topDisc:number|undefined):void=>{
    this.state.board[towerNum].disks.pop();
    if(topDisc!=undefined){this.selectDisk=topDisc;this.isSelect=true;this.moves.push(towerNum);}
  }
  //topDiscの上に選択状態のDiscを配置する
  private trySetDisc = (towerNum:number,topDisc:number|undefined):void=>{
    if(topDisc==undefined||topDisc>this.selectDisk){
      this.state.board[towerNum].disks.push(this.selectDisk);
      this.isSelect=false;
      this.selectDisk=-1;
      this.moves.push(towerNum);
    }
  }
  //選択可能エリア描画用に配置可能か返す
  canSelect = (towerNum:number):boolean =>{
    let disk = this.state.board[towerNum].disks[this.state.board[towerNum].disks.length-1];
    if(!this.isSelect){
      if(disk!=undefined)return true;
    }
    else{
      if(disk==undefined)return true;
      if(disk>this.selectDisk)return true;
    }
    return false;
  }
  //描画用にその場所の円盤大きさを返す（ない場合undefinde）
  getSpaceState= (towerNum:number,spaceNum:number):number|undefined=>{
    return this.state.board[towerNum].disks[spaceNum];
  }
  //自動用配列からシフトして返す
  getAutoMove= ():number|undefined=>{
    return this.autoMoves.shift();
  }
  //自動用配列を生成
  private setAutoMoves=():void=>{
    this.autoMoves.splice(0);
    this.move(4,0,1,2,this.autoMoves);
  }
  //自動用配列を生成用再帰関数
  private move=(n:number,org:number,tmp:number,dst:number,solution:number[]):void=>{
    if(n==1){
      solution.push(org);
      solution.push(dst);
      return
    }else{
      this.move(n-1,org,dst,tmp,solution);
      this.move(1,org,tmp,dst,solution);
      this.move(n-1,tmp,org,dst,solution);
    }
  }
  /*
  show = ():void =>{
    for(let i= 0; i < 3; i++){
      console.log(this.state.board[i].disks);
    }
    console.log(this.selectDisk);
    console.log(this.isSelect);
  }*/
}