/**
 * 节点相关的操作方法
 */
import Node, { dragAreaOption } from '../common/node/node'
import { NodeType, NodeInfo, NodeInfoList, NodeTypeId, NodeLevel } from '../common/node/helper'
import { positionOption } from '../common/position'
import { operateType } from './type'

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
    fill: type ? 'transparent' : getNodeInfo(NodeInfo.fillColor, node),
    'stroke-width': 0
  }
}

// 获取节点文本的属性
export function getNodeTextAttr (node: Node) {
  return {
    'font-size': getNodeInfo(NodeInfo.fontSize, node),
    fill: getNodeInfo(NodeInfo.fontColor, node)
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

// --------------------------------------------------------------------------------- //

/**
 * 节点数据相关操作方法
 */

/**
 * 对当前节点的sort字段进行更正
 * @param newNode 
 * @param type 
 */
// export function sortNodes(newNode: Node, type: operateType) {
//   const targetId = type === operateType.addTopic ? newNode.father.id : newNode.id
//   const brotherNodes = flatNodes.filter((item) => item.father.id === targetId)
//   brotherNodes.forEach(item => {
//     if (item.id !== newNode.id && item.sort >= newNode.sort) {
//       item.sort = item.sort + 1
//     }
//   })
// }


/**
 * 获取节点相关信息
 * @param type 
 * @param node 
 * @returns 
 */
export function getNodeInfo (type: NodeInfo, node: Node) {
  return NodeInfoList[type][getNodeLevel(node)]
}

/**
   * 获取扁平化后当前tree节点的子节点
   * @param treeNode 
   * @returns 
   */
export function getflatNodeChlidIds (treeNode: Node): Array<string> {
  const idList = []
  const children = treeNode.children as Node[]
  for (let i = 0;i < children.length; i++) {
    idList.push(children[i].id)
    if (children[i].children?.length) {
      idList.push(...getflatNodeChlidIds((children[i])))
    }
  }
  return idList
}

/**
 * 获取扁平化后当前tree节点的所有子节点
 * @param treeNode 
 * @returns 
 */
export function getFlatNodeIds (treeNode: Node): Array<string> {
  const childIds = getflatNodeChlidIds(treeNode)
  return [...childIds, treeNode.id]
}

/**
 * 删除扁平化数据里id包含nodeChildLists的节点
 * @param flatNodes 
 * @param nodeChildLists 
 */
// export function deleteNodeLists (flatNodes: Node[], nodeChildLists: Array<string>): void {
//   let len = flatNodes.length
//   for (let i = 0;i < len; i++) {
//     if (nodeChildLists.includes(flatNodes[i].id)) {
//       flatNodes.splice(i,1)
//       i = i - 1
//       len = len -1
//     }
//   }
// }

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

// 取反节点的expand字段值
// export function changeNodeExpand (flatNodes: Node[], id: string) {
//   let len = flatNodes.length
//   for (let i = 0;i < len; i++) {
//     if (flatNodes[i].id === id) {
//       flatNodes[i].expand = !flatNodes[i].expand
//       break
//     }
//   }
// }

