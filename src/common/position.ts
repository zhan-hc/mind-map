import { NodeWidthHeight } from '../constant/index';
import { dragNodeInfo, moduleInterval, modulePadding } from '../constant/index'
import { randomId } from '../utils/common';
import { operateType } from '../utils/type';
import DrawGenerator from './draw/drawGenerator'
import { createNode } from './node';
import { TreeOption } from './tree';

export interface positionOption {
  x: number;
  y: number;
}

export interface connectPositionOption {
  leftX: number;
  rightX: number;
  leftY: number;
  rightY: number;
}

export interface dragPositionOption {
  node: TreeOption;
  x: number;
  y: number;
  x2: number;
  y2: number;
  cx: number; // 绘制拖拽占位矩形的x
  cy: number; // 绘制拖拽占位矩形的y
  insertIndex: number;
  level: number; // 只是为了遍历时优先选中子区域
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
    const itemX = node.x + node.width + moduleInterval
    // 节点的中心坐标
    const centerY = node.y + 0.5 * node.height
    // 获取子节点的区域高度 顺便排序
    const childNodes = node.children.sort((a,b) => a.sort - b.sort)
    const childAreaHeight = areaHeightHandler.getAreaHeight(node)
    // 子节点的起始y坐标
    let startY = centerY - 0.5 * childAreaHeight
    childNodes.forEach((item, i) => {
      // 获取item节点的区域高度
      const nodeHeight = areaHeightHandler.getAreaHeight(item)
      item.x = itemX
      item.y = startY + 0.5 * (nodeHeight - item.height) // 当前节点的y坐标 = startY + 当前节点区域的中间位置 - 矩形块的一半高（垂直居中）
      // 每次递增当前节点的区域高度
      startY += nodeHeight
      item.sort = i
      // 遍历子节点
      item.children.length ? (this.getNodePosition(item)) : ''
    })
  }

  // 计算节点可插入的区域
  /**
   * 
   * @param node 树节点
   * @param list 存储区域数据
   * @param filterId 当前拖拽节点
   * @returns 
   */
  public getNodeInsertArea (node: TreeOption,  list: dragPositionOption[] = [], filterNode?: TreeOption) :dragPositionOption[] {
    const areaHeightHandler = new AreaHeight();
    const len = node.children.length
    if (len) {
      // 计算出兄弟节点宽度最长的
      const maxWidth = node.children.sort(function(a, b){return a.width-b.width})[0].width
      node.children.forEach((item, i) => {
        const itemCenterPosition = {
          y: item.y + 0.5 * item.height
        }
        const areaHeight = areaHeightHandler.getAreaHeight(item)
        const halfAreaHeight = areaHeight * 0.5
        if (i === 0) {
          // 当前节点上部分间距可插入节点区域
          const insertTopArea = {
            node: item,
            x: node.x + node.width,
            y: item.y - halfAreaHeight + 0.5 * item.height,
            x2: item.x + maxWidth,
            y2: itemCenterPosition.y,
            cx: item.x,
            cy: 0,
            insertIndex: 0,
            level: 0
          }
          const InsertAreaHeight = insertTopArea.y2 - insertTopArea.y
          insertTopArea.cy = insertTopArea.y + 0.5 * (InsertAreaHeight) - 1.5 * dragNodeInfo.height
          list.push(insertTopArea)
        }

        let id = item.id
        // 如果是同层节点(这里做判断是为了拖拽判断插入区域的时候过滤掉当前节点的id的区域，所以需要对id做逻辑判断)
        if (filterNode && item.parentId === filterNode.parentId) {
          if (item.sort < filterNode.sort) {
            id = node.children[i+1].id
          } else {
            id = item.id
          }
        }

        const notLastItem = (i < len - 1)
        // 当前节点下部分间距可插入节点区域
        const insertbottomArea = {
          node: item,
          x: node.x + node.width,
          y: itemCenterPosition.y,
          x2: item.x + maxWidth,
          y2: itemCenterPosition.y + halfAreaHeight + 0.5 * (notLastItem ? areaHeightHandler.getAreaHeight(node.children[i+1]) : 0),
          cx: item.x,
          cy: 0,
          insertIndex: i + 1,
          level: 0
        }
        const InsertAreaHeight = insertbottomArea.y2 - insertbottomArea.y
        insertbottomArea.cy = insertbottomArea.y + (0.5 * InsertAreaHeight) + (notLastItem ?  (-0.5 * dragNodeInfo.height) : 5)
        list.push(insertbottomArea)
        if (item.children.length && item.id !== filterNode?.id) {
          this.getNodeInsertArea(item, list, filterNode)
        }
        if (!item.children.length) {
          const insertChildArea = {
            node: item,
            x: item.x + item.width,
            y: item.y,
            x2: item.x + item.width +  NodeWidthHeight.others.width,
            y2: item.y + item.height,
            cx: item.x + item.width + moduleInterval,
            cy: item.y + 0.5 *( item.height - dragNodeInfo.height),
            insertIndex: 0,
            level: 1
          }
          list.push(insertChildArea)
        }
      })
    }
    return list
  }

}

export default Position;

// function getFilterNodeArea (item: any, i: any , len: any, areaHeight: any) {
//   const centerY = item.y + 0.5 * item.height
  
// }