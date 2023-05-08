import { Ref } from "vue"

export const DRAW_CALLBACK_TYPE = {
  EXPAND: 'expand', // 展开隐藏点击回调 
  DRAG: 'drag', // 拖拽回调
  EDIT: 'EDIT'
}

export interface ExtraOption {
  ratio: Ref<number>
}