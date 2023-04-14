import { NodeOptions } from './node';
import { NodeType } from './node/helper';
import { moduleInterval, modulePadding } from '../constant/index'
import DrawGenerator from './draw/drawGenerator'
import { TreeOption } from './tree';

export interface positionOption {
  x: number,
  y: number
}

export interface connectPositionOption {
  leftX: number,
  rightX: number,
  leftY: number,
  rightY: number
}

/*
此图就代表节点之间的连接线的坐标（startXY到leftXY是曲线）
 ___________                      ___________
 |         |                      |         |
 |  rect   |startXY------         |  rect   |
 |         |            |         |         |
 ￣￣￣￣￣￣            ----leftXY￣￣￣￣￣￣rightXY
*/

class AreaHeight {
  private readonly areaHeightMap: Map<string, number>;
  public constructor() {
    this.areaHeightMap = new Map()
  }
  /**
   * 获取节点的区域高度(优化：后续可以做个缓存，需要判断以下在添加节点时哪些节点会变动高度)
   * @param treeNode 树节点
   * @returns 
   */
  public getAreaHeight(treeNode: TreeOption): number {
    let areaHeight = 0
    if (this.areaHeightMap.has(treeNode.id)) {
      return this.areaHeightMap.get(treeNode.id) as number
    }
    if (treeNode.children.length) {
      const childrenAreaHeight = treeNode.children.reduce((total, child) => {
        const childAreaHeight = this.getAreaHeight(child);
        return total + childAreaHeight;
      }, 0);
      areaHeight = childrenAreaHeight
    } else {
      areaHeight = this.getDefaultAreaHeight(treeNode.height)
    }
    this.areaHeightMap.set(treeNode.id, areaHeight)
    return areaHeight
  }

  // 获取默认块区域高度
  public getDefaultAreaHeight (height: number) {
    // 当前块的区域高度 = 矩形高度 + 两个padding
    return height + 2 * modulePadding
  }
}

class Position {
  private drawGenerator: DrawGenerator;
  public constructor(drawGenerator: DrawGenerator) {
    this.drawGenerator = drawGenerator;
  }

  public getNodePosition (node: TreeOption) {
    const areaHeightHandler = new AreaHeight();
    const itemX = node.x + moduleInterval + node.width
    // 节点的中心坐标
    const centerY = node.y + (1 / 2) * node.height
    const centerX = node.x +  (1 / 2) * node.width
    // 获取子节点的区域高度 顺便排序
    const childNodes = node.children.sort((a,b) => a.sort - b.sort)
    const childAreaHeight = areaHeightHandler.getAreaHeight(node)
    // 子节点的起始y坐标
    let startY = centerY - (1 / 2) * childAreaHeight
    childNodes.forEach(item => {
      // 获取item节点的区域高度
      const nodeHeight = areaHeightHandler.getAreaHeight(item)
      item.x = itemX
      item.y = startY + (1 / 2) * (nodeHeight - item.height) // 当前节点的y坐标 = startY + 当前节点区域的中间位置 - 矩形块的一半高（垂直居中）
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
        item.line = this.drawGenerator.drawFirstLine(startPosition, endPosition)
      } else {
        // 如果父节点有起始坐标则使用否则用默认坐标
        const startPosition = {
          x: node.nextStartPosition ? node.nextStartPosition.x : (node.x + node.width),
          y: node.nextStartPosition ? node.nextStartPosition.y : (centerY)
        }
        // 下次该子节点有子节点的时候其连接线的起始位置为节点矩形的右下角
        item.nextStartPosition = {
          x: item.x + item.width,
          y: item.y + item.height
        }
        const endPosition = {
          leftX: item.x,
          leftY: item.y + item.height ,
          rightX: item.nextStartPosition.x,
          rightY: item.nextStartPosition.y
        }
        item.line = this.drawGenerator.drawChildLine(startPosition, endPosition)
      }
      // 遍历子节点
      item.children.length ? (this.getNodePosition(item)) : ''
    })
  }

}

export default Position;