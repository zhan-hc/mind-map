import { operateOption, operateType } from '../../utils/type'
import { NodeOptions } from '../node/index'
export interface TreeOption extends NodeOptions{
  children?: NodeOptions[] | null
}
export class Tree {
  public treeNodes: TreeOption[]
  private flatNodes: NodeOptions[]
  constructor(flatNodes : NodeOptions[]) {
    this.flatNodes = flatNodes
    this.treeNodes = this.convertToTree(flatNodes) as TreeOption[]
  }
  // 对当前节点的sort字段进行更正
  public sortNodes(newNode: NodeOptions, type: operateType) {
    const targetId = type === operateType.addTopic ? newNode.parentId : newNode.id
    const brotherNodes = this.flatNodes.filter((item) => item.parentId === targetId)
    brotherNodes.forEach(item => {
      if (item.id !== newNode.id && item.sort >= newNode.sort) {
        item.sort = item.sort + 1
      }
    })
  }
  // 将扁平化tree变成tree
  public convertToTree(flatNodes: NodeOptions[], parentId : string | null = null): TreeOption[] {
    // 过滤
    const children: NodeOptions[] = flatNodes.filter(node => node.parentId === parentId)
    if (!children.length) {
        return [];
    }
    const res = children.map(node => ({
        ...node,
        children: this.convertToTree(flatNodes, node.id)
    }));
    this.treeNodes = res
    return res
  }
}

export default Tree;