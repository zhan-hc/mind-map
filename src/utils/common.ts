import { NodeOptions } from '../common/node'
import { NodeType, NodeInfo, NodeInfoList } from '../common/node/helper'
import { positionOption } from '../common/position'
import { TreeOption } from '../common/tree'
import { flatNodes } from '../constant'
import { operateOption, operateType } from './type'

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

// 获取节点的中心位置
export function getNodeCenterPosition (node: TreeOption): positionOption {
  return {
    x: node.x + (1 / 2) * node.width,
    y: node.y + (1 / 2) * node.height
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

// 对当前节点的sort字段进行更正
export function sortNodes(newNode: NodeOptions, type: operateType) {
  const targetId = type === operateType.addTopic ? newNode.parentId : newNode.id
  const brotherNodes = flatNodes.filter((item) => item.parentId === targetId)
  brotherNodes.forEach(item => {
    if (item.id !== newNode.id && item.sort >= newNode.sort) {
      item.sort = item.sort + 1
    }
  })
}


// 生成随机id
export function randomId() {
  return (Math.random() + new Date().getTime()).toString(32).slice(0,8)
}

// 获取节点相关信息
export function getNodeInfo (type: NodeInfo, node: NodeOptions) {
  if (node.id === NodeType.root.toString()) return NodeInfoList[type].first
  else if (node.parentId === NodeType.root.toString()) return NodeInfoList[type].second
  else return NodeInfoList[type].others
}

// 获取文本宽度
export function getTextWidth(node: NodeOptions, str = '') {
  const dom = document.createElement('span');
  const App = document.getElementById('app')
  dom.style.display = 'inline-block';
  dom.style.fontSize = getNodeInfo(NodeInfo.fontSize, node)
  dom.textContent = str;
  App?.appendChild(dom);
  const width = dom.clientWidth;
  console.log('文本宽度：', width)
  App?.removeChild(dom);
  return width;
}

// 改变操作icon的disabled属性
export function changeIconDisabled (checkNode: NodeOptions, iconList: operateOption[]) {
  // 如果是根节点不能添加根节点
  if (checkNode.id === NodeType.root.toString()) {
    iconList.forEach(item => {
      if (item.type !== operateType.addTopic) {
        item.disabled = false
      } else {
        item.disabled = true
      }
    })
  } else {
    iconList.forEach(item => {
      item.disabled = false
    })
  }
}
