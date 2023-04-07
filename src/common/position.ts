import { TreeOption } from './tree';
import { NodeOptions } from './node';
import { NodeType } from './node/helper';
import { flatNodes, moduleInterval, modulePadding } from '../constant/index'
import DrawGenerator from './drawGenerator'

export interface PositionOption {
  x: number,
  y: number
}

export interface connectPositionOption {
  leftBotX: number,
  rightBotX: number,
  leftBotY: number,
  rightBotY: number
}

class AreaHeight {
  // private readonly areaHeightMap: Map<string, number> = {};
  public constructor() {
    // this.areaHeightMap = new Map()
  }
  /**
   * 获取节点的区域高度(后续可以做个缓存，需要判断以下在添加节点时哪些节点会变动高度)
   * @param siblingNode 兄弟节点
   * @param flatNodes 扁平化后的节点
   * @returns 
   */
  public getAreaHeight(siblingNode: NodeOptions[]): number {
    // 当前块的区域高度 = 矩形高度 + 两个padding
    const blockAreaHeight = (height: number) => height + 2 * modulePadding
    let areaHeight = 0
    siblingNode.forEach(item => {
      const childNodes = flatNodes.filter(node => node.parentId === item.id)
      areaHeight += childNodes.length ? this.getAreaHeight(childNodes) : blockAreaHeight(item.height)
    })
    return areaHeight
  }

  public getChildrenAreaHeight(parentNode: NodeOptions, childNodes: NodeOptions) {}
}

class Position {
  // private treeNodes: TreeOption[] | null;
  public constructor() {
    // this.treeNodes = treeNodes === undefined ? null : treeNodes;
  }

  public getNodePosition (node: NodeOptions) {
    const areaHeightHandler = new AreaHeight();
    const drawGenerator = new DrawGenerator();
    const itemX = node.x + moduleInterval + node.width
    // 节点的中心坐标
    const centerY = node.y + (1 / 2) * node.height
    const centerX = node.x +  (1 / 2) * node.width
    // 获取子节点的区域高度 顺便排序
    const childNodes = flatNodes.filter(item => item.parentId === node.id).sort((a,b) => a.sort-b.sort)
    const childAreaHeight = areaHeightHandler.getAreaHeight(childNodes)
    // 子节点的起始y坐标
    let startY = centerY - (1 / 2) * childAreaHeight
    childNodes.forEach(item => {
      // 获取item节点的区域高度
      const nodeHeight = areaHeightHandler.getAreaHeight([item])
      item.x = itemX
      item.y = startY + (1 / 2) * (nodeHeight) - item.height / 2 // 当前节点的y坐标 = startY + 当前节点区域的中间位置 - 矩形块的一半高（垂直居中）
      // 每次递增当前节点的区域高度
      startY += nodeHeight

      // 绘制当前节点的链接线
      if (item.parentId === NodeType.root.toString()) { // 第一层节点
        const startPosition = {
          x: centerX,
          y: centerY
        }
        const endPosition = {
          x: item.x +  (1 / 2) * item.width ,
          y: item.y + (1 / 2) * item.height
        }
        item.line = drawGenerator.drawFirstLine(startPosition, endPosition)
      } else {
        // 如果父节点有起始坐标则使用否则用默认坐标
        const startPosition = {
          x: node.nextStartPosition ? node.nextStartPosition.x : (node.x + node.width),
          y: node.nextStartPosition ? node.nextStartPosition.y : (centerY)
        }
        // 当前节点的子节点的起始坐标（为了后续递归可调用）
        item.nextStartPosition = {
          x: item.x + item.width,
          y: item.y + item.height
        }
        const endPosition = {
          leftBotX: item.x,
          leftBotY: item.y + item.height ,
          rightBotX: item.nextStartPosition.x,
          rightBotY: item.nextStartPosition.y
        }
        item.line = drawGenerator.drawChildLine(startPosition, endPosition)
      }
      // 遍历子节点
      const childrenNodes =  flatNodes.filter(node => node.parentId === item.id)
      childrenNodes.length ? (this.getNodePosition(item)) : ''
    })
  }

  public reset (): void {

  }

}

export default Position;