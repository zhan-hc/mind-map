/**
 * 节点相关的操作方法
 */
import { NodeOptions } from '../common/node'
import { NodeType, NodeInfo, NodeInfoList } from '../common/node/helper'
import { positionOption } from '../common/position'
import { TreeOption } from '../common/tree'
import { flatNodes } from '../constant'
import { operateType } from './type'

/**
 * 获取节点绘制元素相关方法
 */

// 获取矩形节点的信息
export function getNodeRectInfo (node: TreeOption, radius: number) {
  return {
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    radius
  }
}

// 获取节点边框信息
export function getNodeRectBorder (node: TreeOption,  radius: number, padding: number = 0) {
  return {
    x: node.x - padding,
    y: node.y - padding,
    width: node.width + padding * 2,
    height: node.height + padding * 2,
    radius
  }
}

// 获取节点矩形的属性 0/1 = 默认矩形/外层可点击矩形
export function getNodeRectAttr (node: TreeOption, type: 0|1) {
  return {
    fill: type ? 'transparent' : getNodeInfo(NodeInfo.fillColor, node),
    'stroke-width': 0
  }
}

// 获取节点文本的属性
export function getNodeTextAttr (node: TreeOption) {
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
export function getNodeCenterPosition (node: TreeOption): positionOption {
  return {
    x: node.x + (1 / 2) * node.width,
    y: node.y + (1 / 2) * node.height
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
export function sortNodes(newNode: NodeOptions, type: operateType) {
  const targetId = type === operateType.addTopic ? newNode.parentId : newNode.id
  const brotherNodes = flatNodes.filter((item) => item.parentId === targetId)
  brotherNodes.forEach(item => {
    if (item.id !== newNode.id && item.sort >= newNode.sort) {
      item.sort = item.sort + 1
    }
  })
}


/**
 * 获取节点相关信息
 * @param type 
 * @param node 
 * @returns 
 */
export function getNodeInfo (type: NodeInfo, node: NodeOptions) {
  return NodeInfoList[type][getNodeLevel(node)]
}

/**
   * 获取扁平化后当前tree节点的子节点
   * @param treeNode 
   * @returns 
   */
export function getflatNodeChlidIds (treeNode: TreeOption): Array<string> {
  const idList = []
  const children = treeNode.children as TreeOption[]
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
export function getFlatNodeIds (treeNode: TreeOption): Array<string> {
  const childIds = getflatNodeChlidIds(treeNode)
  return [...childIds, treeNode.id]
}

/**
 * 删除扁平化数据里id包含nodeChildLists的节点
 * @param flatNodes 
 * @param nodeChildLists 
 */
export function deleteNodeLists (flatNodes: NodeOptions[], nodeChildLists: Array<string>): void {
  let len = flatNodes.length
  for (let i = 0;i < len; i++) {
    if (nodeChildLists.includes(flatNodes[i].id)) {
      flatNodes.splice(i,1)
      i = i - 1
      len = len -1
    }
  }
}

// 获取节点层级
export function getNodeLevel (node: NodeOptions) {
  if (node.id === NodeType.root.toString()) return 'first'
  else if (node.parentId === NodeType.root.toString()) return 'second'
  else return 'others'
}

// 获取节点的area区域
export function getNodeAreaList (flatNodes: NodeOptions[]) {
  const areaList:any = []
  flatNodes.forEach(node => {
    areaList.push({
      node: node,
      x: node.x,
      y: node.y,
      x2: node.x + node.width,
      y2: node.y + node.height
    })
  })
  return areaList
}

// --------------------------------------------------------------------------------- //

/**
 * 展开隐藏icon节点相关方法
 */

// 获取展开隐藏按钮的position
export function getNodeIconPosition (node: NodeOptions, radius: number = 10) {
  const position = {
    x: node.x + node.width + 15,
    y: node.y +  (getNodeLevel(node) === 'others' ? node.height : (1 / 2) * node.height),
    radius
  }
  return position
}

// 取反节点的expand字段值
export function changeNodeExpand (flatNodes: NodeOptions[], id: string) {
  let len = flatNodes.length
  for (let i = 0;i < len; i++) {
    if (flatNodes[i].id === id) {
      flatNodes[i].expand = !flatNodes[i].expand
      break
    }
  }
}

