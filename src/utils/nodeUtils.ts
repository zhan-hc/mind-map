/**
 * 节点相关的操作方法
 */
import Node, { dragAreaOption } from '../common/node/node'
import { NodeInfo, NodeTypeId, NodeLevel } from '../common/node/helper'
import { positionOption } from '../common/position'
import { forTreeEvent } from './common'

/**
 * 获取节点绘制元素相关方法
 */

// 获取矩形节点的信息
export function getNodeRectInfo (node: Node, radius: number) {
  return {
    x: node.attr.x,
    y: node.attr.y,
    width: node.attr.width,
    height: node.attr.height,
    radius
  }
}

// 获取节点边框信息
export function getNodeRectBorder (node: Node,  radius: number, padding: number = 0) {
  return {
    x: node.attr.x - padding,
    y: node.attr.y - padding,
    width: node.attr.width + padding * 2,
    height: node.attr.height + padding * 2,
    radius
  }
}

// 获取节点矩形的属性 0/1 = 默认矩形/外层可点击矩形
export function getNodeRectAttr (node: Node, type: 0|1) {
  return {
    fill: type ? 'transparent' : NodeInfo[getNodeLevel(node)].fillColor,
    'stroke-width': 0
  }
}

// 获取节点文本的属性
export function getNodeTextAttr (node: Node) {
  return {
    'font-size': NodeInfo[getNodeLevel(node)].fontSize,
    fill: NodeInfo[getNodeLevel(node)].fontColor
  }
}

// 获取节点文本的属性
export function setNodeRectAttr (strokeWidth: number, stroke: string) {
  return {
    'stroke-width': strokeWidth,
    'stroke': stroke
  }
}

// 获取节点的中心位置
export function getNodeCenterPosition (node: Node): positionOption {
  return {
    x: node.attr.x + (1 / 2) * node.attr.width,
    y: node.attr.y + (1 / 2) * node.attr.height
  }
}


// 获取节点层级
export function getNodeLevel (node: Node | dragAreaOption) {
  const pid = node.father ? node.father.id : null
  if (node.id === NodeTypeId.root) return 'first'
  else if (pid === NodeTypeId.root) return 'second'
  else return 'others'
}

// --------------------------------------------------------------------------------- //

/**
 * 展开隐藏icon节点相关方法
 */

// 获取展开隐藏按钮的position
export function getNodeIconPosition (node: Node, radius: number = 10) {
  const position = {
    x: node.attr.x + node.attr.width + 15,
    y: node.attr.y +  (getNodeLevel(node) === NodeLevel.others ? node.attr.height : 0.5 * node.attr.height),
    radius
  }
  return position
}

export function treeToFlat (node: Node | undefined) {
  if (!node) return
  const list:any = []
  forTreeEvent(node, (item: Node, pid: any) => {
    list.push({
      id: item.id,
      attr:item.attr,
      sort:item.sort,
      text:item.text,
      pid: pid || 0,
      expand: true
    })
  })
  return list
}

// 扁平化数据转tree
export function arrayToTree(items: any) {
  const result = [];   // 存放结果集
  const itemMap:any = {};  // 
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      }
    }

    itemMap[id] = new Node(item)

    const treeItem =  itemMap[id];

    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        }
      }
      treeItem.setFather(itemMap[pid])
      itemMap[pid].children.push(treeItem)
    }

  }
  return result;
}

