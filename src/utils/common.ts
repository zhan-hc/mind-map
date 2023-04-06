import { NodeOptions } from '../common/node'
import { NodeType, NodeInfo, NodeInfoList } from '../common/node/helper'
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
