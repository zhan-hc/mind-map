export enum NodeType {
  root = 1,
  firstLevel,
  othersChild,
}
export enum NodeTypeId {
  root = '1'
}
export enum NodeLevel {
  first = 'first',
  second = 'second',
  others = 'others'
}
export enum NodeFontSize {
  first = 20,
  second = 16,
  others = 14
}

export enum NodeFillColor {
  first = '#3f89de',
  second = '#f5f5f5',
  others = 'transparent'
}

export enum NodeFontColor {
  first = '#ffffff',
  second = '#000000',
  others = '#000000'
}

export enum createType {
  topic = 0,
  subTopic = 1
}

export enum NodeInfo {
  fillColor,
  fontSize,
  fontColor,
  NodeTextPadding
}

export const NodeInfoList = [NodeFillColor, NodeFontSize, NodeFontColor] 