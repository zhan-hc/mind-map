import type { RaphaelPaper } from 'raphael';
import { TreeOption } from './tree/index'
import { getNodeInfo } from '../utils/common'
import { NodeInfo } from './node/helper'
import { PositionOption, connectPositionOption } from './position'
class DrawGenerator {
  // private readonly paper: RaphaelPaper;
  constructor() {
    // this.paper = paper
  }
  // 绘制节点
  // public drawTopic (treeNode:TreeOption[], checkNodeId: string) {
  //   const that = this
  //   for (let node of treeNode) {
  //     const rect = this.paper.rect(node.x, node.y, node.width, node.height, 5);
  //     rect.attr({ 'fill': getNodeInfo(NodeInfo.fillColor, node), 'stroke-width': 0 })
  //     rect.data('node', node)
  //     rect.click(function() {
  //       that.checkNode = this.data('node')
  //     });

  //     // 选中新增节点
  //     // if (checkNodeId && node.id === checkNodeId) {
  //     //   hoverBlock && (hoverBlock.remove())
  //     //   hoverBlock = drawHoverBlock(node)
  //     // }
  //     if (node.children) this.drawTopic(node.children, checkNodeId)
  //   }
  // }

  // 绘制线
  public drawLine (lineList: string[]) {
    lineList.forEach(item => {
      const line = this.paper.path(item)
        line.attr({
          "stroke-width": 2
        })
    });
  }

  // 绘制文本
  public drawText (flatNodes: TreeOption[]) {
    flatNodes.forEach(node => {
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
      const textNode = text.node as HTMLElement
      textNode.style.userSelect =  'none'
    })
  }

  // 绘制第一层的模块连接线（贝塞尔曲线）
  public drawFirstLine (startPosition: PositionOption, endPosition: PositionOption): string {
    // start
    const x1 = startPosition.x
    const y1 = startPosition.y
    // end
    const x2 = endPosition.x
    const y2 = endPosition.y

    const k1 = 0.8;
    const k2 = 0.2;
    // 贝塞尔曲线控制点
    const x3 = x2 - k1 * (x2 - x1);
    const y3 = y2 - k2 * (y2 - y1);

    // return paper.path(`M${x1} ${y1}Q${x3} ${y3} ${x2} ${y2}`);
    return `M${x1} ${y1}Q${x3} ${y3} ${x2} ${y2}`
  }

  // 绘制除第一层节点之后的连接线 
  public drawChildLine (startPosition: PositionOption, endPosition: connectPositionOption): string {
    const connectPathStr = this.createConnectPathStr(startPosition.x + 15, startPosition.y, endPosition.leftBotX,  endPosition.leftBotY);
    let pathStr = `M${startPosition.x} ${startPosition.y} L${startPosition.x + 15} ${startPosition.y} ${connectPathStr}`;
      
    pathStr += ` M ${ endPosition.leftBotX} ${ endPosition.leftBotY} L${endPosition.rightBotX} ${endPosition.rightBotY}`;

    return pathStr
  }

  // 曲线
  private createConnectPathStr (x1: number, y1: number, x2: number, y2: number): string {
    const control1XFactor = 0.3;
    const control1YFactor = 0.76;
    const control1X = x1 + control1XFactor * (x2 - x1);
    const control1Y = y1 + control1YFactor * (y2 - y1);

    const control2XFactor = 0.5;
    const control2YFactor = 0;
    const control2X = x2 - control2XFactor * (x2 - x1);
    const control2Y = y2 - control2YFactor * (y2 - y1);

    return `M${x1} ${y1}C${control1X} ${control1Y} ${control2X} ${control2Y} ${x2} ${y2}`;
  };
}
export default DrawGenerator