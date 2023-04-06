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
  public sortNodes(newNode: NodeOptions) {
    const brotherNodes = this.flatNodes.filter((item) => item.parentId === newNode.id)
    brotherNodes.forEach(item => {
      if (item.id !== newNode.id) {
        item.sort >= newNode.sort ? (item.sort += 1) : ''
      }
    })
    // flatNodes.sort((a,b) => a.sort-b.sort)
  }
  public convertToTree(flatNodes: NodeOptions[], parentId : string | null = null): TreeOption[] {
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