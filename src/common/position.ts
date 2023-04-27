import { NodeWidthHeight } from '../constant/index';
import { moduleInterval, modulePadding } from '../constant/index'
import { randomId } from '../utils/common';
import Node from './node/node';

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

export interface areaOption {
  x: number;
  y: number;
  x2: number;
  y2: number
}

export interface insertAreaOption {
  id: string;
  father: Node;
  area: areaOption;
  insertIndex: number
}
// export interface dragPositionOption {
//   node: TreeOption;
//   x: number;
//   y: number;
//   x2: number;
//   y2: number;
//   cx: number; // 绘制拖拽占位矩形的x
//   cy: number; // 绘制拖拽占位矩形的y
//   insertIndex: number;
//   level: number; // 只是为了遍历时优先选中子区域
// }

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
   * @param node 树节点
   * @returns 
   */
  public getAreaHeight(node: Node): number {
    let areaHeight = 0
    if (this.areaHeightMap.has(node.id)) {
      return this.areaHeightMap.get(node.id) as number
    }
    if (node.children.length) {
      const childrenAreaHeight = node.children.reduce((total, child) => {
        const childAreaHeight = this.getAreaHeight(child);
        return total + childAreaHeight;
      }, 0);
      areaHeight = childrenAreaHeight
    } else {
      areaHeight = this.getDefaultAreaHeight(node.attr.height)
    }
    this.areaHeightMap.set(node.id, areaHeight)
    return areaHeight
  }

  // 获取默认块区域高度
  public getDefaultAreaHeight (height: number) {
    // 当前块的区域高度 = 矩形高度 + 两个padding
    return height + 2 * modulePadding
  }
}

class Position {
  public constructor() {
  }

  public getNodePosition (node: Node) {
    const areaHeightHandler = new AreaHeight();
    const itemX = node.attr.x + node.attr.width + moduleInterval
    // 节点的中心坐标
    const centerY = node.attr.y + 0.5 * node.attr.height
    // 获取子节点的区域高度 顺便排序
    const childNodes = node.children.sort((a,b) => a.sort - b.sort)
    const childAreaHeight = areaHeightHandler.getAreaHeight(node)
    // 子节点的起始y坐标
    let startY = centerY - 0.5 * childAreaHeight
    childNodes.forEach((item, i) => {
      // 获取item节点的区域高度
      const nodeHeight = areaHeightHandler.getAreaHeight(item)
      item.attr.x = itemX
      item.attr.y = startY + 0.5 * (nodeHeight - item.attr.height) // 当前节点的y坐标 = startY + 当前节点区域的中间位置 - 矩形块的一半高（垂直居中）
      // 每次递增当前节点的区域高度
      startY += nodeHeight
      item.setSort(i)
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
  public getNodeInsertArea (node: Node,  areaList: insertAreaOption[] = [], filterNode?: Node) :insertAreaOption[] {
    const areaHeightHandler = new AreaHeight();
    const len = node.children.length
    const nodeAreaHeight = areaHeightHandler.getAreaHeight(node)
    // 是否与拖拽节点同个父节点
    if (len) {
      // 计算出兄弟节点宽度最长的
      const maxWidth = node.children.sort(function(a, b){return a.attr.width - b.attr.width})[0].attr.width
      const startX = node.shape.getBBox().x2
      let startY = node.shape.getBBox().cy - 0.5 * nodeAreaHeight
      const endX = startX + moduleInterval + maxWidth
      const endY = node.shape.getBBox().cy + 0.5 * nodeAreaHeight
      // 是否需要略过当前节点(如果是当前节点直接合并两个插入区域,并跳过下一节点区域的push)
      let skipCurArea = false
      for(let i = 0; i < len; i++) {
        const item = node.children[i]
        const { cy } = item.shape.getBBox()
          const isFilterNode = item.id === filterNode?.id
          // 当前节点后面是否还有节点
          const isAfterChlid = i + 1 < len
          const y2 = isFilterNode ? (isAfterChlid ? node.children[i + 1].shape.getBBox().cy : endY) : cy
          !skipCurArea && (
            areaList.push({
              id: randomId(),
              father: node,
              area: { x: startX, y: startY, x2: endX, y2 },
              insertIndex: i
            })
          )
          startY = y2
          skipCurArea = isFilterNode

        // 父节点不能拖拽到子节点位置,所以不递归其子节点
        if (item.id !== filterNode?.id) {
          if (item.children.length) {
            this.getNodeInsertArea(item, areaList, filterNode)
          } else {
            const itemStartX = item.shape.getBBox().x2
            // 子节点区域
            areaList.unshift({
              id: randomId(),
              father: item,
              area: { x: itemStartX, y: item.shape.getBBox().y, x2: itemStartX + NodeWidthHeight.others.width, y2: item.shape.getBBox().y2 },
              insertIndex: 0
            })
          }
        }
      }
      if (!(node.id === filterNode?.father?.id && filterNode.sort === len - 1)) {
        areaList.push({
          id: randomId(),
          father: node,
          area: { x: startX, y: startY, x2: endX, y2: endY },
          insertIndex: len
        })
      }
      
    }
    return areaList
  }

}

export default Position;