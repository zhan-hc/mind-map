import { reactive } from 'vue'
import type { RaphaelPaper, RaphaelElement, RaphaelReadAttributes } from 'raphael';
import { TreeOption } from '../tree/index'
import { changeIconDisabled, getNodeCenterPosition,  getNodeRectAttr, getNodeRectBorder, getNodeRectInfo, getNodeTextAttr, setNodeRectAttr } from '../../utils/common'
import { iconList } from '../../constant'
import { NodeOptions } from '../node';
import { Paper } from '../paper';
import DrawGenerator from './drawGenerator';
export class DrawRender {
  private readonly paper: RaphaelPaper;
  private readonly drawGenerator: DrawGenerator;
  public  checkNode: TreeOption | null; // 当前选中节点
  public checkBorder: RaphaelElement | null; // 选中的边框
  public constructor(paper: Paper) {
    this.paper = paper.getPaper()
    this.drawGenerator = paper.getDrawGenertator()
    this.checkNode = null
    this.checkBorder = null
  }

  // 绘制节点
  public drawTopic (treeNode:TreeOption[], checkNodeId: string) {
    const that = this
    for (let node of treeNode) {
      const st = this.paper.set()
      const rect = this.drawGenerator.drawRect(getNodeRectInfo(node, 5), getNodeRectAttr(node, 0) as RaphaelReadAttributes) // 底层节点
      const text = this.drawGenerator.drawText(getNodeCenterPosition(node), node.text, getNodeTextAttr(node) as RaphaelReadAttributes) // 文本      
      const wrapRect = this.drawWrapRect(node)
      st.push(rect, text, wrapRect)
      // 如果是新增节点则默认选中新节点
      if (node.id === checkNodeId) {
        this.checkBorder = this.drawCheckRect(node)
        this.checkNode = node
        changeIconDisabled(node, iconList)
      }
      if (node.children) this.drawTopic(node.children, checkNodeId)
    }
  }

  // 绘制选中的矩形
  public drawCheckRect (node: TreeOption) {
    return this.drawGenerator.drawRect(getNodeRectBorder(node, 5, 4), setNodeRectAttr( 2, '#3498db') as RaphaelReadAttributes)
  }

  // 绘制最顶层的矩形节点(即悬浮可点击节点)
  public drawWrapRect (node: TreeOption) {
    const that = this
    const data = {
      key: 'node',
      value: node
    }
    const wrapRect = this.drawGenerator.drawRect(getNodeRectBorder(node, 5, 4), getNodeRectAttr(node, 1) as RaphaelReadAttributes, data)
    
    wrapRect.click(function () {
      that.checkNode = reactive(this.data(data.key))
      // 更新操作栏的图标状态
      changeIconDisabled(that.checkNode as NodeOptions, iconList)
      // 选中当前节点
      that.checkBorder?.remove()
      that.checkBorder = that.drawCheckRect(node)
    })

    wrapRect.hover(function(){wrapRect.attr(setNodeRectAttr( 2, '#87ceeb'))}, function(){wrapRect.attr({'stroke-width': 0})})
    
    return wrapRect
  }

  // 绘制线
  public drawTopicLine (lineList: string[]) {
    const that = this
    lineList.forEach(item => {
      that.drawGenerator.drawLine(item, {'stroke-width': 2} as RaphaelReadAttributes)
    });
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

  

  public clear(): void {
    this.paper.clear();
  }
}