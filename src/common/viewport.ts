import { Ref } from 'vue';
import { Paper } from './paper';
import { VIEWPORT_SIZE } from '../constant';
import { operateList } from '../constant//operate';
import { changeIconDisabled, getAssetsFile, isMobile } from '../utils/common';
import type { RaphaelElement } from 'raphael';
import { setNodeRectAttr } from '../utils/nodeUtils';
import Node from './node/node';
import { NONE_BORDER, SELECT_RECT } from '../constant/attr';
interface scaleOption {
  coef: number; // 每次放大、缩小的增量
  zoom: number; // 目前的大小与原来大小的比例
  x: number; // 缩放的坐标
  y: number;
  w: number; // 以(x,y)为原点的宽度
  h: number;
}

export interface vpExtraOption {
  ratio: Ref<number>;
  operateStatus: Ref<string>;
  cb: any
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
  private _checkBox: RaphaelElement | null; // 单击移动生成的选中框
  private _checkNodeList: Array<Node>;
  private callBacks: any;
  private operateStatus: Ref<string>;
  public changeRatio: Function; // 改变缩放百分比函数
  public constructor(paper: Paper, option: vpExtraOption) {
    this.paper = paper
    this.ratio = option?.ratio
    this.maxSize = VIEWPORT_SIZE.MAX;
    this.minSize = VIEWPORT_SIZE.MIN;
    this.paperWidth = this.paper.getPaperElement().clientWidth;
    this.paperHeight = this.paper.getPaperElement().clientHeight;
    this.scale = { coef: 0.05, zoom: 1, x: 0, y: 0, w: this.paperWidth, h: this.paperHeight }
    this.lastMouseLocation = {x: 0, y: 0}
    this.mouseDown = false;
    this.keyDown = false;
    this.callBacks = option.cb
    this._checkBox = null
    this._checkNodeList = []
    this.operateStatus = option?.operateStatus
    this.changeRatio = this._changeRatio.bind(this)
    this.init()
  }

  private init () {
    this.paper.getPaper().canvas.addEventListener('mousewheel', this.onMouseWheeling.bind(this))
    this.paper.getPaper().canvas.addEventListener(isMobile ? 'touchstart' : 'mousedown', this.onMouseDown.bind(this) as (e: Event) => void)
    this.paper.getPaper().canvas.addEventListener(isMobile ? 'touchend' : 'mouseup', this.onMouseUp.bind(this))
    this.paper.getPaper().canvas.addEventListener(isMobile ? 'touchmove' : 'mousemove', this.onMouseMove.bind(this)  as (e: Event) => void)
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

  public onMouseDown (e: MouseEvent | TouchEvent) {
    if (this.keyDown || !this.operateStatus.value) {
      e.preventDefault()
    }
    this.mouseDown = true
    this.lastMouseLocation.x = !isMobile ? (e as MouseEvent).clientX : (e as TouchEvent).targetTouches[0].pageX;
    this.lastMouseLocation.y = !isMobile ? (e as MouseEvent).clientY : (e as TouchEvent).targetTouches[0].pageY;
  }

  public onMouseMove (e: MouseEvent | TouchEvent) {
    const { clientX, clientY } = {
      clientX: !isMobile ? (e as MouseEvent).clientX : (e as TouchEvent).targetTouches[0].pageX,
      clientY: !isMobile ? (e as MouseEvent).clientY : (e as TouchEvent).targetTouches[0].pageY
    }
    // 单击移动选中框(没有悬浮在元素中)
    if (!isMobile && this.mouseDown && !this.keyDown && !this.operateStatus.value) {
      if (!this._checkBox) {
        this._checkBox = this.paper.getDrawGenertator().drawRect({
          x: this.lastMouseLocation.x,
          y: this.lastMouseLocation.y,
          width: 10,
          height: 10
        },
        SELECT_RECT
        )
      }
      const dx = clientX - this.lastMouseLocation.x;
      const dy = clientY - this.lastMouseLocation.y;
      const { x, y } = this._checkBox.getBBox()
      const boxAttr = {
        x: dx < 0 ? clientX  :  x,
        y: dy < 0 ? clientY : y,
        width: dx < 0 ? (Math.abs(dx)) :  dx,
        height: dy< 0 ? (Math.abs(dy)) : dy
      }
      this._checkBox.attr(boxAttr)
      if (this._checkNodeList.length) {
        this._checkNodeList.forEach(item => item.shape.attr(NONE_BORDER))
      }
      const checkNodeList = this.callBacks['checkBoxEvent'](boxAttr)
      if (!checkNodeList.length) {
        this.callBacks['clearClickStatus']()
      }
      this._checkNodeList = checkNodeList
      this.callBacks['setCheckNodeList'](this._checkNodeList)
      this._checkNodeList.forEach(item => item.shape.attr(setNodeRectAttr( 2, '#3498db')))
      changeIconDisabled(this._checkNodeList, operateList)
    }

    // 如果空格 + 鼠标按下（拖拽移动）
    if (isMobile || (this.keyDown && this.mouseDown)) {
      const dx = clientX - this.lastMouseLocation.x;
      const dy = clientY - this.lastMouseLocation.y;

      const x = this.scale.x - dx;
      const y = this.scale.y - dy;

      this.updateScale(x, y, this.scale.w, this.scale.h);
      this.lastMouseLocation.x = clientX;
      this.lastMouseLocation.y = clientY;
      this.paper.getPaper().setViewBox(x, y, this.scale.w, this.scale.h, false);
    }
    
  }

  public onMouseUp () {
    this.mouseDown = false
    this._checkBox?.node.remove()
    this._checkBox = null
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