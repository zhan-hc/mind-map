/**
 * 节点之间的连接线
 */

import { LINE_TYPE } from "../../constant";
import { getNodeLevel } from "../../utils/nodeUtils";
import { NodeLevel, NodeTypeId } from "../node/helper";
import Node from "../node/node";
import { connectPositionOption, positionOption } from "../position";

export class ConnectLine {
  private lineType: number;
  constructor(lineType: number) {
    this.lineType = lineType
  }

  // 获取连接线
  public getLinePath (firstLevel: boolean, pNode: Node, node: Node) {
    const position:any = this.getLinePositon(pNode, node)
    if (this.lineType === LINE_TYPE.DEFAULT) {
      return this.defaultLine(firstLevel, position)
    } else if (this.lineType === LINE_TYPE.BROKEN) {
      return this.brokenPath(position.start, position.end)
    } else if (this.lineType === LINE_TYPE.BROKEN_RADIU){
      return this.brokenRadiuPath(position.start, position.end)
    } else if (this.lineType === LINE_TYPE.BROKEN_BIAS) {
      return this.brokenBiasPath(position.start, position.end)
    } else {
      return ''
    }
  }

  // 获取连接线坐标
  public getLinePositon (pNode: Node, node: Node) {
    // 父节点的中心坐标
    const centerPosition = {
      x: pNode.attr.x +  0.5 * pNode.attr.width,
      y: pNode.attr.y + 0.5 * pNode.attr.height
    }
    // 子节点的中心坐标
    const endPosition = {
      x: node.attr.x +  0.5 * node.attr.width,
      y: node.attr.y + 0.5 * node.attr.height
    }

    // 默认连接线
    if (this.lineType === LINE_TYPE.DEFAULT) {
       // 第一层节点(与根节点连接那层)
      if (getNodeLevel(node) === NodeLevel.second) {
        return  {
          start: centerPosition,
          end: endPosition
        }
      } else {
        // 默认连接线非第一层节点连接开始坐标
        const deFaultStartPosition = {
          x: pNode.attr.x + pNode.attr.width,
          y: pNode.father?.id === NodeTypeId.root ? centerPosition.y : (pNode.attr.y + pNode.attr.height)
        }
        // 默认连接线非第一层节点结束坐标
        const deFaultEndPosition = {
          leftX: node.attr.x,
          leftY: node.attr.y + node.attr.height ,
          rightX: node.attr.x + node.attr.width,
          rightY: node.attr.y + node.attr.height
        }
        return {
          start: deFaultStartPosition,
          end: deFaultEndPosition
        }
      }
    } else if (this.lineType === LINE_TYPE.BROKEN) {
      return  {
        start: {
          x: pNode.shape.getBBox().x2,
          y: centerPosition.y
        },
        end: {
          x: node.attr.x,
          y: endPosition.y
        }
      }
    } else if (this.lineType === LINE_TYPE.BROKEN_RADIU) {
      return {
        start: {
          x: pNode.shape.getBBox().x2,
          y: centerPosition.y
        },
        end: {
          x: node.attr.x,
          y: endPosition.y
        }
      }
    } else if (this.lineType === LINE_TYPE.BROKEN_BIAS) {
      return {
        start: {
          x: pNode.shape.getBBox().x2 - 15,
          y: centerPosition.y
        },
        end: {
          x: node.attr.x,
          y: endPosition.y
        }
      }
    } else {
      return ''
    }
  }

  /**
   * 绘制默认连接线
   * @param firstLevel 是否是第一层节点（即连接根节点那层）
   * @param position 
   * @returns 
   */
  private defaultLine (firstLevel: boolean, position: any) {
    if (firstLevel) {
      return this.defaultFirstPath(position.start, position.end)
    } else {
      return this.defaultOtherPath(position.start, position.end)
    }
  }

  // 默认根节点与第一层节点是贝塞尔曲线连接
  private defaultFirstPath (startPosition: positionOption, endPosition: positionOption): string {
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

    return `M${x1} ${y1}Q${x3} ${y3} ${x2} ${y2}`
  }

  // 默认除第一层节点之后的连接路径
  private defaultOtherPath  (startPosition: positionOption, endPosition: connectPositionOption): string {
    const connectPathStr = this.defaultCoverPath(startPosition.x + 15, startPosition.y, endPosition.leftX,  endPosition.leftY);
    return `M${startPosition.x} ${startPosition.y} 
    L${startPosition.x + 15} ${startPosition.y} ${connectPathStr} 
    M ${ endPosition.leftX} ${ endPosition.leftY} 
    L${endPosition.rightX} ${endPosition.rightY}`;
  }

  // 默认连接线其他节点曲线算法
  private defaultCoverPath (x1: number, y1: number, x2: number, y2: number): string {
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

  // 折线
  private brokenPath (startPosition: positionOption, endPosition: positionOption) {
    return `M ${startPosition.x} ${startPosition.y} 
    L ${startPosition.x + 15} ${startPosition.y} 
    L ${startPosition.x + 15} ${endPosition.y} 
    L ${endPosition.x} ${endPosition.y}`
  }

  // 圆角折线
  private brokenRadiuPath (startPosition: positionOption, endPosition: positionOption) {
    return `M ${startPosition.x} ${startPosition.y} 
    L ${startPosition.x + 15} ${startPosition.y} 
    L ${startPosition.x + 15} ${endPosition.y + (endPosition.y < startPosition.y ? 10 : -10)}
    A ${10} ${10} ${45} ${0} ${(endPosition.y < startPosition.y ? 1 : 0)} ${startPosition.x + 25} ${endPosition.y} 
    L ${endPosition.x} ${endPosition.y}`
  }

  // 斜折线
  private brokenBiasPath (startPosition: positionOption, endPosition: positionOption) {
    return `M ${startPosition.x} ${startPosition.y} 
    L ${endPosition.x - 15} ${endPosition.y}
    L ${endPosition.x} ${endPosition.y}`
  }
}