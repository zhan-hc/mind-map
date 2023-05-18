import type { RaphaelSet } from 'raphael';
import { DRAG_START_CUR_RECT, NONE_BORDER } from "../../constant/attr";
import Position, { insertAreaOption } from "../position";
import { NodeTypeId } from "./helper";
import Node from "./node";

export class NodeDrag {
  private position: Position;
  private dragInsertEle: RaphaelSet | null; // 拖拽可插入的区域显示
  private insertArea: insertAreaOption | null; // 拖拽可插入的区域显示
  public constructor() {
    this.position = new Position()
    this.dragInsertEle = null
    this.insertArea = null
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
    const list = this.position.getNodeInsertArea(rootNode, [], node)
    // 获取拖拽鼠标坐标所在的插入区域
    for (let i = 0;i<list.length;i++) {
      if (cx > list[i].area.x && cy > list[i].area.y && cx <= list[i].area.x2 && cy <= list[i].area.y2) {
        this.insertArea = list[i]
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
    // 如果拖拽的区域未变
    if (this.dragInsertEle && this.dragId === this.insertArea?.id) {
      return
    }
    if (this.insertArea) {
      // 删除该节点
      node.father && node.father.removeChild(node)
      // 对其父节点的子节点sort重新设值
      node.father && node.father.sortChild()
      // 拖拽的节点更改父节点
      this.insertArea?.father && node.setFather(this.insertArea.father)
      // 拖拽的节点更改节点sort
      this.insertArea?.father && node.setSort(this.insertArea?.insertIndex)
      // 拖拽的节点更改属性
      node.setAttr({
        ...node.attr,
        lineStartX: undefined,
        lineStartY: undefined
      })
      // 给node的插入的父节点插入node
      this.insertArea?.father.pushChild(node)
      // 并重新排序
      this.insertArea?.father.insertSortChild(node)
      node.shape.attr(NONE_BORDER)
      this.init()
      cb()
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