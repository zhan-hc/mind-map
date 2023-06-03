
/**
 * 公共
 */

import { RaphaelAttributes } from "raphael"
import { ref } from "vue"
import { LINE_TYPES } from "."

// 边框为0
export const NONE_BORDER = {
  'stroke-width': 0,
  'stroke': 'transparent',
  'stroke-opacity': 1
}

export const DEFAULT_LINE_WIDTH = {
  'stroke-width': 2,
  'stroke-opacity': 1
}

//节点连接线的颜色
export const LINE_COLOR = ref('#000000')

// 节点连接线样式
export const LINE_TYPE = ref(LINE_TYPES.DEFAULT)

/**
 * 节点点击悬浮相关
 */

const HOVER_COLOR = '#87ceeb'
const CLICK_COLOR = '#3498db'
// hover 边框样式
export const HOVER_RECT_BORDER = {
  'stroke-width': 2,
  'stroke': HOVER_COLOR,
  'stroke-dasharray': ''
} as RaphaelAttributes

export const CLICK_RECT_BORDER = {
  'stroke-width': 2,
  'stroke': CLICK_COLOR,
  'stroke-dasharray': ''
} as RaphaelAttributes

export const SELECT_RECT = {
  ...HOVER_RECT_BORDER,
  fill: '#997cff',
  'fill-opacity': 0.1
} as RaphaelAttributes
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
} as RaphaelAttributes

// 拖拽时的占位矩形
export const DRAG_PLACEHOLDER_RECT = {
  'fill': DRAG_COLOR,
  'stroke-width': 0
} as RaphaelAttributes
// 拖拽时的占位链接线
export const DRAG_PLACEHOLDER_LINE = {
  stroke: DRAG_COLOR,
  ...DEFAULT_LINE_WIDTH
} as RaphaelAttributes


/**
 * 展开收起图标相关
 */

export const EXPAND_CIRCLE = {
  'stroke': '#262626',
  ...DEFAULT_LINE_WIDTH,
  'fill': '#ccc'
} as RaphaelAttributes
