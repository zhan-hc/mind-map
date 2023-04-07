import { reactive } from 'vue'
import Raphael from 'raphael'
import type { RaphaelPaper, RaphaelElement } from 'raphael';
import { TreeOption } from '../tree/index'
import { changeIconDisabled, getNodeInfo } from '../../utils/common'
import { NodeInfo } from '../node/helper'
import { iconList } from '../../constant'
import { NodeOptions } from '../node';
export class Paper {
  private readonly paper: RaphaelPaper;
  public  checkNode: TreeOption | null; // 当前选中节点
  public checkBorder: RaphaelElement | null; // 选中的边框
  public constructor(container: string | Element) {
    const wrapDom = this.getPaperElement(container)
    this.paper = new Raphael(wrapDom, wrapDom.clientWidth, wrapDom.clientHeight);
    this.checkNode = null
    this.checkBorder = null
  }

  // 绘制节点
  public drawTopic (treeNode:TreeOption[], checkNodeId: string) {
    for (let node of treeNode) {
      const st = this.paper.set()
      const rect = this.drawRect(node) // 底层节点
      const text = this.drawText(node) // 文本
      const wrapRect = this.drawClickRect(node) // 顶层节点
      st.push(rect, text, wrapRect)
      // 如果是新增节点默认选中新节点
      if (node.id === checkNodeId) {
        this.checkBorder = this.drawNodeBorder(node)
        this.checkNode = node
        changeIconDisabled(node, iconList)
      }
      if (node.children) this.drawTopic(node.children, checkNodeId)
    }
  }

  // 绘制线
  public drawLine (lineList: string[]) {
    lineList.forEach(item => {
      const line = this.paper.path(item)
        line.attr({
          'stroke-width': 2
        })
    });
  }

  // 绘制文本
  public drawText (node: TreeOption) {
      // 节点的中心位置
      const centerPosition = {
        x: node.x + (1 / 2) * node.width,
        y: node.y + (1 / 2) * node.height
      }
      const text = this.paper.text(centerPosition.x, centerPosition.y, node.text)
      text.attr({
        'font-size': getNodeInfo(NodeInfo.fontSize, node),
        'fill': getNodeInfo(NodeInfo.fontColor, node)
      })
      return text
  }

  // 绘制边框
  public drawNodeBorder (node: TreeOption) {
    const padding = 4
    const rect = this.paper.rect(node.x - padding, node.y - padding, node.width + padding * 2, node.height + padding * 2, 5);
    rect.attr({
      'stroke-width': 2,
      'stroke': '#3498db'
    })
    return rect
  }
  // 绘制底层的节点块
  public drawRect (node: TreeOption) {
    const rect = this.paper.rect(node.x, node.y, node.width, node.height, 5);
    const fillColor = getNodeInfo(NodeInfo.fillColor, node)
    rect.attr({ 'fill': fillColor, 'stroke-width': 0 })
    return rect
  }

  // 绘制最上层可点击的节点块
  public drawClickRect (node: TreeOption) {
    const that = this
    const padding = 4
    const rect =  this.paper.rect(node.x - padding, node.y - padding, node.width + padding * 2, node.height + padding * 2, 5);
    rect.attr({'stroke-width': 0, fill: 'transparent' })
    rect.data('node', node)
    rect.click(function() {
      that.checkNode = reactive(this.data('node'))
      // 更新操作栏的图标状态
      changeIconDisabled(that.checkNode as NodeOptions, iconList)
      // 选中当前节点
      that.checkBorder && (that.checkBorder.remove())
      that.checkBorder = that.drawNodeBorder(node)
    });
    rect.hover(function(){this.attr({'stroke-width': 2, 'stroke': '#87ceeb'})}, function(){this.attr({'stroke-width': 0})})
    return rect
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