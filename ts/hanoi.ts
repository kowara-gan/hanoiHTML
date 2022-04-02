type TowerState = {
  disks:number[];
};
export const DISK_NUM:number=4;

export class Hanoi{
  public board :TowerState[];
  public isSelect:boolean;
  public selectDisk:number;
  public moves: number[];
  public autoMoves: number[];
  constructor(){
    this.board = new Array(3);
    for(let i= 0; i < 3; i++){
      this.board[i]={disks:[]};
    }
    this.moves=[];
    this.autoMoves=[];
    for(let k=DISK_NUM-1;k>=0;k--){
      this.board[0].disks.push(k);
    }
    this.isSelect=false;
    this.selectDisk=-1;
    this.setAutoMoves();
  }
  reset = () =>{
    for(let i= 0; i < 3; i++){
      this.board[i].disks.splice(0);
    }
    for(let k=DISK_NUM-1;k>=0;k--){
      this.board[0].disks.push(k);
    }
    this.moves.splice(0);
    this.isSelect=false;
    this.selectDisk=-1;
    this.setAutoMoves();
  }
  isFinish = () =>{
    if(this.board[0].disks.length==0&&this.board[1].disks.length==0&&this.board[2].disks.length==DISK_NUM)
      return true;
    else return false;
  }
  selectTower = (towerNum:number):void =>{
    let disk = this.board[towerNum].disks[this.board[towerNum].disks.length-1];
     if(!this.isSelect){
      this.board[towerNum].disks.pop();
      if(disk!=undefined){this.selectDisk=disk;this.isSelect=true;this.moves.push(towerNum);}
     }else{
      if(disk==undefined||disk>this.selectDisk){
        this.board[towerNum].disks.push(this.selectDisk);
        this.isSelect=false;
        this.selectDisk=-1;
        this.moves.push(towerNum);
      }
     }
  }
  canSet = (towerNum:number):boolean =>{
    if(!this.isSelect)return false;
    else{
      let disk = this.board[towerNum].disks[this.board[towerNum].disks.length-1];
      if(disk==undefined)return true;
      if(disk>this.selectDisk)return true;
      return false;
    }
  }
  getSpaceState= (towerNum:number,spaceNum:number):number|undefined=>{
    return this.board[towerNum].disks[spaceNum];
  }
  getAutoMove= ():number|undefined=>{
    return this.autoMoves.shift();
  }
  private setAutoMoves=():void=>{
    this.autoMoves.splice(0);
    this.move(4,0,1,2,this.autoMoves);
  }
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
      console.log(this.board[i].disks);
    }
    console.log(this.selectDisk);
    console.log(this.isSelect);
  }*/
}