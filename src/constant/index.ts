export const dataKey = 'mind-map_node-data'
export const optionKey = 'mind-map_optionKey'
export interface dataOption {
  lineType: number
}

export const moduleInterval = 50 // 模块左右间隔
export const modulePadding = 25 // 模块上下间隔
export const textPadding = 10 // 文本左右边距


// 拖拽显示可插入的节点信息
export const dragNodeInfo = {
  width: 60,
  height: 20,
  radius: 5
}

// 缩放的最大最小值
export const VIEWPORT_SIZE = {
  MIN: 0.5,
  MAX: 3
}

// 上传图片的最大最小值
export const IMG_SIZE = {
  width: 300,
  height: 300
}

// 连接线种类
export const LINE_TYPE = {
  DEFAULT: 1, 
  BROKEN: 2,
  BROKEN_RADIU: 3,
  BROKEN_BIAS: 4
  
}