
/**
 * 公共
 */

// 边框为0
export const NONE_BORDER = {
  'stroke-width': 0
}

export const DEFAULT_LINE_WIDTH = {
  'stroke-width': 2
}


/**
 * 拖拽相关
 */

// 拖拽的主题色
const DRAG_COLOR = '#fa8072'

// 拖拽的当前矩形
export const DRAG_START_CUR_RECT = {
  'stroke': DRAG_COLOR,
  ...DEFAULT_LINE_WIDTH,
  'stroke-dasharray': '-'
}

// 拖拽时的占位矩形
export const DRAG_PLACEHOLDER_RECT = {
  'fill': DRAG_COLOR,
  'stroke-width': 0
}
// 拖拽时的占位链接线
export const DRAG_PLACEHOLDER_LINE = {
  stroke: DRAG_COLOR,
  ...DEFAULT_LINE_WIDTH
}


/**
 * 展开收起图标相关
 */

export const EXPAND_CIRCLE = {
  'stroke': '#262626',
  ...DEFAULT_LINE_WIDTH,
  'fill': '#ccc'
}
