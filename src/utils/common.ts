import { NodeOptions } from '../common/node'
import { NodeType, NodeInfo, NodeInfoList } from '../common/node/helper'
import { operateOption, operateType } from './type'
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
