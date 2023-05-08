import { Ref, reactive, ref } from 'vue';
import { Paper } from '.';
import { VIEWPORT_SIZE } from '../../constant';
import { getAssetsFile } from '../../utils/common';

interface scaleOption {
  coef: number; // 每次放大、缩小的增量
  zoom: number; // 目前的大小与原来大小的比例
  x: number; // 缩放的坐标
  y: number;
  w: number; // 以(x,y)为原点的宽度
  h: number;
}
export class Viewport {
  private readonly paper: Paper;
  private ratio:  Ref<number>;
  private scale: scaleOption;
  private maxSize: number; // 允许放大的最大倍数
  private minSize: number; // 允许缩小的最大倍数
  private paperWidth: number; // 允许放大的最大倍数
  private paperHeight: number; // 允许缩小的最大倍数
  private lastMouseLocation: any; // 鼠标上次的坐标
  private mouseDown: boolean; // 鼠标是否是按住状态
  private keyDown: boolean; // 空格键盘是否是按住状态
  public changeRatio: Function; // 空格键盘是否是按住状态
  public constructor(paper: Paper, ratio: Ref<number>) {
    this.paper = paper
    this.ratio = ratio
    this.maxSize = VIEWPORT_SIZE.MAX;
    this.minSize = VIEWPORT_SIZE.MIN;
    this.paperWidth = this.paper.getPaperElement().clientWidth;
    this.paperHeight = this.paper.getPaperElement().clientHeight;
    this.scale = { coef: 0.05, zoom: 1, x: 0, y: 0, w: this.paperWidth, h: this.paperHeight }
    this.lastMouseLocation = {x: 0, y: 0}
    this.mouseDown = false;
    this.keyDown = false;
    this.init()
    this.changeRatio = this._changeRatio.bind(this)
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
    if (e.ctrlKey) {
      if((e.wheelDelta > 0 || e.detail < 0)){
      e.returnValue = false;
      this.onScale(1)
      this.changeRatio(1)
     } else {
      e.returnValue = false;
      this.onScale(-1)
      this.changeRatio(0)
     }
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
    const w = this.paperWidth / this.scale.zoom;
    const h = this.paperHeight / this.scale.zoom;
    const lastCenterPoint = this.getLastCenterPoint();
    const x = lastCenterPoint.x - w / 2;
    const y = lastCenterPoint.y - h / 2;

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
  private _changeRatio (type: 0|1) {
    const maxSize = this.maxSize * 100
    const minSize = this.minSize * 100
    const coef = this.scale.coef * 100
    if (type) {
      const newRatio = this.ratio.value + coef
      this.ratio.value = newRatio > maxSize ? maxSize: newRatio
    } else {
      const newRatio = this.ratio.value - coef
      this.ratio.value = newRatio < minSize ? minSize: newRatio
    }
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