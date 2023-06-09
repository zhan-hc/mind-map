import type { RaphaelSet } from 'raphael';
import { DRAG_START_CUR_RECT, NONE_BORDER } from "../../constant/attr";
import Position, { insertAreaOption } from "../position";
import { NodeTypeId } from "./helper";
import Node from "./node";

export class NodeDrag {
  private position: Position;
  private dragInsertEle: RaphaelSet | null; // 拖拽可插入的区域显示
  private insertArea: insertAreaOption | null; // 拖拽可插入的区域显示
  private insertAreaList: insertAreaOption[] | null; // 拖拽可插入的区域显示
  public constructor() {
    this.position = new Position()
    this.dragInsertEle = null
    this.insertArea = null
    this.insertAreaList = null
    this.dragMove = this.dragMove.bind(this)
    this.dragEnd = this.dragEnd.bind(this)
    this.removeDragEle = this.removeDragEle.bind(this)
  }
  public dragMove (position: {cx: number, cy: number}, rootNode: Node, node: Node, dragRect: Function) {
    const { cx, cy } = position
    if (node.id === NodeTypeId.root) {
      return
    }
    // 拖拽的节点设置红色虚线框
    node.shape.attr(DRAG_START_CUR_RECT);
    // 获取可插入区域的集合
    this.insertAreaList = this.insertAreaList || this.position.getNodeInsertArea(rootNode, [], node)
    // 获取拖拽鼠标坐标所在的插入区域
    for (let i = 0;i<this.insertAreaList.length;i++) {
      if (cx > this.insertAreaList[i].area.x && cy > this.insertAreaList[i].area.y && cx <= this.insertAreaList[i].area.x2 && cy <= this.insertAreaList[i].area.y2) {
        this.insertArea = this.insertAreaList[i]
        break;
      }
    }
    // 如果拖拽区域与上次是同个区域
    if (this.dragInsertEle && this.dragId === this.insertArea?.id) {
      return
    }
    // 如果可插入区域存在
    if (this.insertArea) {
      this.dragInsertEle?.remove()
      this.dragInsertEle = dragRect(this.insertArea, {key: 'dragId', value: this.insertArea.id})
    }
  }

  public dragEnd ( node: Node, cb: Function) {
    this.insertAreaList = null
    // 如果拖拽的区域未变
    if (this.dragInsertEle && this.dragId === this.insertArea?.id) {
      return
    }
    if (this.insertArea) {
      cb(node, this.insertArea)
      this.init()
    }
  }

  public get dragId () {
    return this.dragInsertEle && this.dragInsertEle.data('dragId')
  }

  public getdragInsertEle () {
    return this.dragInsertEle
  }

  public init () {
    this.dragInsertEle?.remove()
    this.insertArea = null
  }

  public removeDragEle () {
    this.dragInsertEle?.remove()
  }

}