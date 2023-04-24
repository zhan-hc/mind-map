import { NodeOptions } from '../common/node'
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
    icon: operateIcons[operateType.delTopic],
    disabled: true,
    type: operateType.delTopic
  }
])

export const NodeWidthHeight = {
  first: {
    width: 120,
    height: 60
  },
  second: {
    width: 100,
    height: 50
  },
  others: {
    width: 80,
    height: 40
  }
}

export const flatNodes : NodeOptions[] = [
  {
    id: '1',
    text: 'My Root',
    x: 100,
    y: 500,
    parentId: null,
    width: NodeWidthHeight.first.width,
    height: NodeWidthHeight.first.height,
    sort: 0,
    expand: true
  }
]

export const NodeTextPadding =  {
  first: 18,
  second: 16,
  others: 12
}

export const dragNodeInfo = {
  width: 60,
  height: 20,
  radius: 5
}


export const VIEWPORT_SIZE = {
  MIN: 0.5,
  MAX: 3
}
