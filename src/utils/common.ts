import Node, { NodeOptions } from '../common/node/node'
import { NodeType, NodeInfo, NodeTypeId } from '../common/node/helper'
import { getNodeInfo } from './nodeUtils';
import { operateOption, operateType } from './type'


// 生成随机id
export function randomId() {
  return (Math.random() + new Date().getTime()).toString(32).slice(0,8)
}

// 获取文本宽度
export function getTextWidth(node: Node, str = '') {
  const dom = document.createElement('span');
  const App = document.getElementById('app')
  dom.style.display = 'inline-block';
  dom.style.fontSize = getNodeInfo(NodeInfo.fontSize, node)
  dom.textContent = str;
  App?.appendChild(dom);
  const width = dom.clientWidth;
  App?.removeChild(dom);
  return width;
}

// 改变操作icon的disabled属性
export function changeIconDisabled (checkNode: NodeOptions, iconList: operateOption[]) {
  // 如果是根节点不能添加兄弟节点和删除节点
  if (checkNode.id === NodeTypeId.root) {
    iconList.forEach(item => {
      if (![operateType.addTopic, operateType.delTopic].includes(item.type)) {
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


// 获取assets静态资源
export function getAssetsFile (url: string) {
  return new URL(`../assets/${url}`, import.meta.url).href
}

export function getCenterXY (x:number, y:number, x2:number, y2:number) {
  const width = x2 - x
  const height = y2 - y
  const cx = x + 0.5 * width
  const cy = y + 0.5 * height
  return {
    cx,
    cy
  }
}
