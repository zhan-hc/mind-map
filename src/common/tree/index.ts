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
}

export default Tree;