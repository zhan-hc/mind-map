import { Paper } from '.';
import { getAssetsFile } from '../../utils/common';

interface scaleOption {
  coef: number, // 每次放大、缩小的增量
  zoom: number, // 目前的大小与原来大小的比例
  x: number, // 缩放的坐标
  y: number,
  w: number, // 以(x,y)为原点的宽度
  h: number
}
export class Viewport {
  private readonly paper: Paper;
  private scale: scaleOption;
  private maxSize: number; // 允许放大的最大倍数
  private minSize: number; // 允许缩小的最大倍数
  private paperWidth: number; // 允许放大的最大倍数
  private paperHeight: number; // 允许缩小的最大倍数
  private lastMouseLocation: any; // 鼠标上次的坐标
  private mouseDown: boolean; // 鼠标是否是按住状态
  private keyDown: boolean; // 空格键盘是否是按住状态
  public constructor(paper: Paper) {
    this.paper = paper
    this.maxSize = 3;
    this.minSize = 0.5;
    this.paperWidth = this.paper.getPaperElement().clientWidth;
    this.paperHeight = this.paper.getPaperElement().clientHeight;
    this.scale = { coef: 0.05, zoom: 1, x: 0, y: 0, w: this.paperWidth, h: this.paperHeight }
    this.lastMouseLocation = {x: 0, y: 0}
    this.mouseDown = false;
    this.keyDown = false;
    this.init()
  }

  private init () {
    this.paper.getPaper().canvas.addEventListener('mousewheel', this.onMouseWheeling.bind(this))
    this.paper.getPaper().canvas.addEventListener('mousedown', this.onMouseDown.bind(this) as (e: Event) => void)
    this.paper.getPaper().canvas.addEventListener('mouseup', this.onMouseUp.bind(this))
    this.paper.getPaper().canvas.addEventListener('mousemove', this.onMouseMove.bind(this)  as (e: Event) => void)
    document.addEventListener('keydown', this.onKeydown.bind(this))
    document.addEventListener('keypress', this.onKeypress.bind(this))
    document.addEventListener('keyup', this.onKeyup.bind(this))
  }

  public updateScale(x:number, y:number, w:number, h:number) {
    this.scale = { ...this.scale, x, y, h, w }
  }

  // 获取操作前的viewbox中心点
  public getLastCenterPoint() {
    return {
      x: this.scale.x + this.scale.w / 2,
      y: this.scale.y + this.scale.h / 2
    }
  }

  public onMouseWheeling(e:any) {
    if(e.wheelDelta && e.ctrlKey){ // IE/Opera/Chrome
      e.returnValue = false;
      this.onScale(e.wheelDelta)
     }else if(e.detail){ // Firefox or others
      e.returnValue = false;
      this.onScale( -e.detail)
     }
  }

  public onScale (dtl: number) {
    if (dtl < 0) {
      //缩小
      if (this.scale.zoom < this.minSize) {
        return;
      }
      this.scale.zoom -= this.scale.coef;
    }
    //放大
    else {
      if (this.scale.zoom > this.maxSize) {
        return;
      }
      this.scale.zoom += this.scale.coef;
    }

    //计算新的视图参数
    var w = this.paperWidth / this.scale.zoom;
    var h = this.paperHeight / this.scale.zoom;
    var lastCenterPoint = this.getLastCenterPoint();
    var x = lastCenterPoint.x - w / 2;
    var y = lastCenterPoint.y - h / 2;

    this.updateScale(x, y, w, h);
    this.paper.getPaper().setViewBox(x, y, w, h, false);
  }

  public onMouseDown (e: MouseEvent) {
    this.mouseDown = true
    this.lastMouseLocation.x = e.clientX;
    this.lastMouseLocation.y = e.clientY;
  }

  public onMouseMove (e: MouseEvent) {
    if (!this.keyDown) return;
    if (!this.mouseDown) return;
    const dx = e.clientX - this.lastMouseLocation.x;
    const dy = e.clientY - this.lastMouseLocation.y;

    const x = this.scale.x - dx;
    const y = this.scale.y - dy;

    this.updateScale(x, y, this.scale.w, this.scale.h);
    this.lastMouseLocation.x = e.clientX;
    this.lastMouseLocation.y = e.clientY;
    this.paper.getPaper().setViewBox(x, y, this.scale.w, this.scale.h, false);
  }

  public onMouseUp () {
    this.mouseDown = false
    // this.lastMouseLocation = {};
  }

  public onKeydown (e: KeyboardEvent) {
    if (e.code === 'Space') (this.keyDown = true)
  }

  public onKeypress (e: KeyboardEvent) {
    if (!this.keyDown) return
    this.paper.getPaperElement().style.cursor = `url(${getAssetsFile('move.svg')}) 16 16,auto`;
  }

  public onKeyup (e: KeyboardEvent) {
    this.keyDown = false;
    this.paper.getPaperElement().style.cursor = 'default';
  }

  public getScaleOption () {
    return this.scale
  }

  public getScaleMinSize () {
    return this.minSize
  }

  public getScaleMaxSize () {
    return this.maxSize
  }
}