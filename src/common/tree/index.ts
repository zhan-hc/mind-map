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