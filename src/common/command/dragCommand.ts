import { NONE_BORDER } from "../../constant/attr";
import { operateTotalType } from "../../constant/operate";
import Node from "../node/node";
import { insertAreaOption } from "../position";
import { Command } from "./type";

export default class DragCommand implements Command{
  public type: string;
  public lastCheckNodeIds: string[];
  public lastNode: Node;
  constructor(public node: Node, public insertArea: insertAreaOption) {
    this.type = operateTotalType.DRAG
    this.lastCheckNodeIds = [node.id]
    this.lastNode = new Node(node)
  }

  execute() {
    // 删除该节点
    this.node.father?.removeChild(this.node)
    // 对其父节点的子节点sort重新设值
    this.node.father?.sortChild()
    // 拖拽的节点更改父节点
    this.node.setFather(this.insertArea.father)
    // 拖拽的节点更改节点sort
    this.node.setSort(this.insertArea?.insertIndex)
    // 拖拽的节点更改属性
    this.node.setAttr({
      ...this.node.attr
    })
    // 给node的插入的父节点插入node
    this.insertArea?.father.pushChild(this.node)
    // 并重新排序
    this.insertArea?.father.insertSortChild(this.node)
    this.node.shape.attr(NONE_BORDER)
  }

  undo () {
    // 删除该节点
    this.node.father?.removeChild(this.node)
    // 对其父节点的子节点sort重新设值
    this.node.father?.sortChild()
    // 拖拽的节点更改父节点
    this.node.setFather(this.lastNode.father)
    // 拖拽的节点更改节点sort
    this.node.setSort(this.lastNode.sort)
    // 拖拽的节点更改属性
    this.node.setAttr({
      ...this.node.attr
    })
    // 给node的插入的父节点插入node
    this.lastNode.father?.pushChild(this.node)
    // 并重新排序
    this.lastNode.father?.insertSortChild(this.node)
    this.lastNode.shape.attr(NONE_BORDER)
  }
}