import { reactive } from 'vue'
import type { RaphaelPaper, RaphaelElement, RaphaelReadAttributes, RaphaelSet } from 'raphael';
import { changeIconDisabled } from '../../utils/common'
import { getNodeCenterPosition, getNodeIconPosition,  getNodeLevel,  getNodeRectAttr, getNodeRectBorder, getNodeRectInfo, getNodeTextAttr, setNodeRectAttr } from '../../utils/nodeUtils'
import { dragNodeInfo, iconList } from '../../constant'
import Node from '../node/node';
import { Paper } from '../paper';
import DrawGenerator from './drawGenerator';
import { DRAW_CALLBACK_TYPE } from './type';
import { Viewport } from '../paper/viewport';
import Position, { connectPositionOption, dragPositionOption } from '../position';
import { NodeLevel, NodeType, NodeTypeId } from '../node/helper';
import { DEFAULT_LINE_WIDTH, DRAG_PLACEHOLDER_LINE, DRAG_PLACEHOLDER_RECT, DRAG_START_CUR_RECT, NONE_BORDER } from '../../constant/attr';
export class DrawRender {
  private readonly paper: RaphaelPaper;
  private readonly drawGenerator: DrawGenerator;
  public viewport: Viewport;
  public checkNode: Node | null; // 当前选中节点
  private checkBorder: RaphaelElement | null; // 选中的边框
  private dragInsertEle: RaphaelSet | null; // 拖拽可插入的区域显示
  public constructor(paper: Paper) {
    this.paper = paper.getPaper()
    this.drawGenerator = paper.getDrawGenertator()
    this.viewport = new Viewport(paper)
    this.checkNode = null
    this.checkBorder = null
    this.dragInsertEle = null
  }

  // 绘制节点
  public drawTopic (node:Node, checkNodeId: string, callback?: any) {
    const st = this.paper.set()
    const rect = this.drawGenerator.drawRect(getNodeRectInfo(node, 5), getNodeRectAttr(node, 0) as RaphaelReadAttributes) // 底层节点
    const text = this.drawGenerator.drawText(getNodeCenterPosition(node), node.text, getNodeTextAttr(node) as RaphaelReadAttributes) // 文本
    const wrapRect = this.drawWrapRect(node, rect, callback || null)
    st.push(rect, text, wrapRect)
    // 节点连接线
    const line = this.drawLine(callback[node.father ? node.father.id : 0], node)
    if (line) {
      st.push(line)
    }

    node.setShape(rect)

    callback[node.id || 0] = node

    // 如果是新增节点则默认选中新节点
    if (node.id === checkNodeId) {
      this.checkBorder = this.drawCheckRect(node)
      this.checkNode = node
      changeIconDisabled(node, iconList)
    }

    if (node.children && node.children.length) {
      // 绘制展开按钮
      const data = {
        key: 'node',
        value: node
      }
      const expandIcon = this.drawGenerator.drawExpandIcon(getNodeIconPosition(node), data, !node.expand)
      expandIcon.click(function () {
        const node = this.data(data.key)
        if (callback[DRAW_CALLBACK_TYPE.EXPAND]) {
          node.setExpand(!node.expand)
          callback[DRAW_CALLBACK_TYPE.EXPAND]()
        }
      })
      // 如果子节点展开
      if (node.expand) {
        node.children.forEach((item: Node) => this.drawTopic(item, checkNodeId, callback))
        
      }
    }
  }

  // 绘制选中的矩形
  public drawCheckRect (node: Node) {
    return this.drawGenerator.drawRect(getNodeRectBorder(node, 5, 4), setNodeRectAttr( 2, '#3498db') as RaphaelReadAttributes)
  }

  // 绘制最顶层的矩形节点(即悬浮可点击节点)
  public drawWrapRect (node: Node, bindRect?: RaphaelElement, cb?: any) {
    const that = this
    const data = {
      key: 'node',
      value: node
    }
    const wrapRect = this.drawGenerator.drawRect(getNodeRectBorder(node, 5, 4), getNodeRectAttr(node, 1) as RaphaelReadAttributes, data)
    
    if (bindRect) {
      wrapRect.data('rect', bindRect)
    }

    wrapRect.click(function () {
      that.checkNode = this.data(data.key)
      // 更新操作栏的图标状态
      changeIconDisabled(that.checkNode as Node, iconList)
      // 选中当前节点
      that.checkBorder?.remove()
      that.checkBorder = that.drawCheckRect(node)
    })

    if (cb && cb[DRAW_CALLBACK_TYPE.DRAG]) {
      // const { treeNodes, flatNodes, reDraw } = cb[DRAW_CALLBACK_TYPE.DRAG]
      // const position = new Position()
      // let curNode: dragPositionOption | null = null;

      // wrapRect.drag(function onmove (x, y, cx, cy, e) {
      //   const nodeData = this.data('node')
      //   if (nodeData.id === NodeTypeId.root) {
      //     return
      //   }
      //   // 拖拽的对象红色虚线框标注
      //   const rect = this.data('rect')
      //   rect.attr(DRAG_START_CUR_RECT)
      //   const list = position.getNodeInsertArea(treeNodes, [], nodeData).sort((a,b) => (b.level - a.level))
      //   // 获取拖拽鼠标坐标所在的插入区域
      //   for (let i = 0;i<list.length;i++) {
      //     if (cx > list[i].x && cy > list[i].y && cx <= list[i].x2 && cy <= list[i].y2) {
      //       // 如果拖拽在当前节点上下区域
      //       if (list[i].node.id === nodeData.id) {
      //         curNode = {
      //           node: nodeData,
      //           cx: nodeData.x,
      //           cy: nodeData.y+ 0.5 * (nodeData.height - dragNodeInfo.height)
      //         } as any
      //       } else {
      //         curNode = list[i]
      //       }
      //       break;
      //     }
      //   }
      //   // 如果有找到可插入区域并且（不是同一个层级或者id与上一次不一致）
      //   if (curNode && (!that.dragInsertEle || curNode.node.father.id !== nodeData.father.id || nodeData.id !== curNode.node.id)) {
      //     that.dragInsertEle?.remove()
      //     that.dragInsertEle = that.drawDragRect(curNode, cb[curNode.node[curNode.level === 1 ? 'id' : 'father.id'] as string])
      //   }
      // }, function onstart (x,y,e) {
      // }, function onend (e) {
      //   const rect = this.data('rect')
      //   const nodeData = this.data('node')
      //   that.dragInsertEle?.remove()
      //   rect.attr(NONE_BORDER)
      //   if (curNode && (!that.dragInsertEle || curNode.node.father.id !== nodeData.father.id || nodeData.id !== curNode.node.id)) {
      //     console.log('拖拽生效', treeNodes)
      //     flatNodes.find((item: Node) => item.id === nodeData.id)['father.id'] = curNode?.node[curNode.level === 1 ? 'id' : 'father.id']
      //     const brotherNodes = flatNodes.filter((item: Node) => item.father.id === curNode?.node.father.id)
      //     console.log(brotherNodes, 'brotherNodes', curNode, ' curNode')
      //     brotherNodes.forEach((item: Node) => {
      //       console.log(item, 'item', curNode, 'curNode', curNode?.insertIndex)
      //       const insetIndex = curNode?.insertIndex as number
      //       if (item.id === nodeData.id) {
      //         item.setSort(insetIndex)
      //       } else {
      //         if (item.sort >= insetIndex) {
      //           item.setSort(cb[item.id].sort + 1)
      //         } else {
      //           item.setSort(cb[item.id].sort)
      //         }
      //       }
      //     })
      //     console.log(flatNodes, 'flatNodes')
      //     reDraw()
      //   }
        
      //   curNode = null
  
      // })
    }

    wrapRect.hover(function(){wrapRect.attr(setNodeRectAttr( 2, '#87ceeb'))}, function(){wrapRect.attr(NONE_BORDER)})
    
    return wrapRect
  }

  // 绘制拖拽占位矩形
  // public drawDragRect (node: dragPositionOption, pNode: Node) {
  //   const st = this.paper.set()
  //   // 绘制连接线
  //   const dNode =  {
  //     x: node.cx,
  //     y: node.cy,
  //     width: dragNodeInfo.width,
  //     height: dragNodeInfo.height,
  //   }
  //   const rectInfo = {
  //     ...dNode,
  //     radius: dragNodeInfo.radius
  //   }
  //   const data = {
  //     key: 'node',
  //     value: node
  //   }
  //   const rect = this.drawGenerator.drawRect(rectInfo, DRAG_PLACEHOLDER_RECT as RaphaelReadAttributes, data)
  //   const line = this.drawLine(pNode, dNode, DRAG_PLACEHOLDER_LINE as RaphaelReadAttributes) as RaphaelElement
  //   st.push(rect, line)
  //   return st
  // }

  // 绘制节点链接线
  public drawLine (pNode: Node | undefined, node: Node, attr?: RaphaelReadAttributes) {
    if (!pNode || node.id === NodeTypeId.root) return
    // 节点的中心坐标
    const centerPosition = {
      x: pNode.attr.x +  0.5 * pNode.attr.width,
      y: pNode.attr.y + 0.5 * pNode.attr.height
    }
    let linePath = '';
    // 绘制当前节点的链接线
    if (getNodeLevel(node) === NodeLevel.second) { // 第一层节点
      const endPosition = {
        x: node.attr.x +  0.5 * node.attr.width,
        y: node.attr.y + 0.5 * node.attr.height
      }
      linePath = this.drawGenerator.drawFirstLine(centerPosition, endPosition)
    } else {
      // 如果父节点有起始坐标则使用否则用默认坐标
      const startPosition = {
        x: pNode.attr.lineStartX ? pNode.attr.lineStartX : (pNode.attr.x + pNode.attr.width),
        y: pNode.attr.lineStartY ? pNode.attr.lineStartY : (centerPosition.y)
      }
      // 下次该子节点有子节点的时候其连接线的起始位置为节点矩形的右下角
      node.setAttr({
        ...node.attr,
        lineStartX: node.attr.x + node.attr.width,
        lineStartY: node.attr.y + node.attr.height
      })
      const endPosition = {
        leftX: node.attr.x,
        leftY: node.attr.y + node.attr.height ,
        rightX: node.attr.lineStartX,
        rightY: node.attr.lineStartY
      } as connectPositionOption
      linePath = this.drawGenerator.drawChildLine(startPosition, endPosition)
    }
    const drawAttr = attr ?? DEFAULT_LINE_WIDTH as RaphaelReadAttributes
    const line = this.drawGenerator.drawLine(linePath, drawAttr)
    line.toBack()
    return line
  }

  public getPaperElement (container: string | Element) : HTMLElement {
    const containerDom = (typeof container === 'string' ? document.querySelector(container) : container) as HTMLElement
    if (!containerDom) {
      throw new Error(`${container} is not exist`);
    }
    if (containerDom.clientWidth === 0 || containerDom.clientHeight === 0) {
      throw new Error('The width or height of Container is not more than 0')
    }
    return containerDom
  }

  public getCheckNode () {
    return this.checkNode
  }

  public clear(): void {
    this.paper.clear();
  }
}