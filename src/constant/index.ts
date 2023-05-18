import { operateType, operateOption } from '../utils/type'
import { operateIcons } from '../utils/unocss-icon'
import { reactive } from 'vue'
export const moduleInterval = 50 // 模块左右间隔
export const modulePadding = 25 // 模块上下间隔
export const textPadding = 10 // 文本左右边距


export const iconList: operateOption[] = reactive([
  {
    icon: operateIcons[operateType.addTopic],
    disabled: true,
    type: operateType.addTopic
  },
  {
    icon: operateIcons[operateType.addSubTopic],
    disabled: true,
    type: operateType.addSubTopic
  },
  {
    icon: operateIcons[operateType.editTopic],
    disabled: true,
    type: operateType.editTopic
  },
  {
    icon: operateIcons[operateType.addImage],
    disabled: true,
    type: operateType.addImage
  },
  {
    icon: operateIcons[operateType.delTopic],
    disabled: true,
    type: operateType.delTopic
  }
])


export const dragNodeInfo = {
  width: 60,
  height: 20,
  radius: 5
}


export const VIEWPORT_SIZE = {
  MIN: 0.5,
  MAX: 3
}
