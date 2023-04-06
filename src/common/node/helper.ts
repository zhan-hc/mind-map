export enum NodeType {
  root = 1,
  firstLevel,
  othersChild,
}
export enum NodeFontSize {
  first = '20px',
  second = '16px',
  others = '14px'
}

export enum NodeFillColor {
  first = '#3f89de',
  second = '#f5f5f5',
  others = 'transparent'
}

export enum NodeFontColor {
  first = '#fff',
  second = '#000',
  others = '#000'
}

export enum createType {
  topic = 0,
  subTopic = 1
}

export enum NodeInfo {
  fillColor,
  fontSize,
  fontColor
}

export const NodeInfoList = [NodeFillColor, NodeFontSize, NodeFontColor] 