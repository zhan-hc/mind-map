import { operateOption, operateType } from '../../utils/type'
import { NodeOptions } from '../node/index'
export interface TreeOption extends NodeOptions{
  children?: NodeOptions[] | null
}
export class Tree {
  public treeNodes: TreeOption[]
  constructor(flatNodes : NodeOptions[]) {
    this.treeNodes = this.arrayToTree(flatNodes) as TreeOption[]
  }
  /**
   * 将扁平化tree变成tree(非递归版)
   * @param flatNodes 
   * @returns 
   */
  public arrayToTree (flatNodes: NodeOptions[]): TreeOption[] {
    const result = [];   // 存放结果集
    const itemMap:{[key:string]: any} = {};  // 
    for (const item of flatNodes) {
      const id = item.id;
      const parentId = item.parentId;
  
      if (!itemMap[id]) {
        itemMap[id] = {
          children: []
        }
      }
  
      itemMap[id] = {
        ...item,
        children: itemMap[id]['children']
      }
  
      const treeItem =  itemMap[id];
  
      if (parentId === null) {
        result.push(treeItem);
      } else {
        if (!itemMap[parentId]) {
          itemMap[parentId] = {
            children: [],
          }
        }
        itemMap[parentId].children.push(treeItem)
      }
  
    }
    this.treeNodes = result;
    return result;
  }
  /**
   * 获取扁平化后当前tree节点的子节点
   * @param treeNode 
   * @returns 
   */
  public getflatNodeChlidIds (treeNode: TreeOption): Array<string> {
    const idList = []
    const children = treeNode.children as TreeOption[]
    for (let i = 0;i < children.length; i++) {
      idList.push(children[i].id)
      if (children[i].children?.length) {
        idList.push(...this.getflatNodeChlidIds((children[i])))
      }
    }
    return idList
  }

  /**
   * 获取扁平化后当前tree节点的所有子节点
   * @param treeNode 
   * @returns 
   */
  public getFlatNodeIds (treeNode: TreeOption): Array<string> {
    const childIds = this.getflatNodeChlidIds(treeNode)
    return [...childIds, treeNode.id]
  }

  /**
   * 删除扁平化数据里id包含nodeChildLists的节点
   * @param flatNodes 
   * @param nodeChildLists 
   */
  public deleteNodeLists (flatNodes: NodeOptions[], nodeChildLists: Array<string>): void {
    let len = flatNodes.length
    for (let i = 0;i < len; i++) {
      if (nodeChildLists.includes(flatNodes[i].id)) {
        flatNodes.splice(i,1)
        i = i - 1
        len = len -1
      }
    }
  }
}

export default Tree;