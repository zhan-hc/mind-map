import type { RaphaelPaper, RaphaelReadAttributes } from 'raphael';
import { positionOption, connectPositionOption } from '../position';

export interface rectOption extends positionOption {
  width: number,
  height: number,
  radius?: number
}
export interface circleOption extends positionOption {
  x: number,
  y: number,
  radius: number
}

interface rectData {
  key: string,
  value: any
}
class DrawGenerator {
  private readonly paper: RaphaelPaper
  public constructor(paper: RaphaelPaper) {
    this.paper = paper
  }
  // 绘制线
  public drawLine (linePath: string, attr?: RaphaelReadAttributes) {
    const line = this.paper.path(linePath)
    if (attr) {
      line.attr(attr)
    }
    return line
  }

  // 绘制文本
  public drawText (position: positionOption, text: string, attr?: RaphaelReadAttributes) {
    const paperText = this.paper.text(position.x, position.y, text)
    if (attr) {
      paperText.attr(attr)
    }
    
    return paperText
  }

  // 绘制圆
  public drawCircle (position: circleOption, attr?: RaphaelReadAttributes) {
    const circle = this.paper.circle(position.x, position.y, position.radius)
    if (attr) {
      circle.attr(attr)
    }
    
    return circle
  }

  // 绘制图标(展开和收藏图标)1+/0-
  public drawExpandIcon (position: circleOption,data?: rectData, type?: boolean) {
    const st = this.paper.set()
    const circle = this.drawCircle(position, {'stroke': '#262626', 'stroke-width': 2, 'fill': '#ccc'} as RaphaelReadAttributes)
    const horizontalLine = this.drawLine(`M${position.x - (position.radius / 2)} ${position.y}L${position.x + (position.radius / 2)} ${position.y}Z`)
    
    if (type) {
      const verticalLine = this.drawLine(`M${position.x} ${position.y - (position.radius / 2)}L${position.x} ${position.y + (position.radius / 2)}Z`)
      st.push(circle, horizontalLine, verticalLine)
    }
    else{
      st.push(circle, horizontalLine)
    }

    if (data) {
      st.data(data.key, data.value)
    }

    st.attr({opacity: 0})
    st.hover(function(){st.attr({opacity: 1})}, function(){st.attr({opacity: 0})})
    return st
  }

  // 绘制底层的节点块
  public drawRect (rectOption: rectOption, attr?: RaphaelReadAttributes, data?: rectData) {
    const rect = this.paper.rect(rectOption.x, rectOption.y, rectOption.width, rectOption.height, rectOption.radius);
    if (attr) {
      rect.attr(attr)
    }
    if (data) {
      rect.data(data.key, data.value)
    }
    return rect
  }
  

  // 绘制第一层的模块连接线（贝塞尔曲线）
  public drawFirstLine (startPosition: positionOption, endPosition: positionOption): string {
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

  // 绘制除第一层节点之后的连接线 
  public drawChildLine (startPosition: positionOption, endPosition: connectPositionOption): string {
    const connectPathStr = this.createConnectPathStr(startPosition.x + 15, startPosition.y, endPosition.leftX,  endPosition.leftY);
    let pathStr = `M${startPosition.x} ${startPosition.y} L${startPosition.x + 15} ${startPosition.y} ${connectPathStr}`;
    pathStr += ` M ${ endPosition.leftX} ${ endPosition.leftY} L${endPosition.rightX} ${endPosition.rightY}`;

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