import { LINE_TYPES } from '.'
import { conLineType, operateIcons, snapshotIcon } from '../utils/unocss-icon'
import { reactive, ref } from 'vue'

export enum operateType {
  addTopic = 0,
  addSubTopic,
  editTopic,
  operateImg,
  delTopic,
  saveData,
  execute,
  undo
}

export enum styleType {
  first = 0,
  second,
  others,
  line,
  lineColor
}
export interface lineOption {
  value: number;
  icon: string;
  checked: boolean;
  desc: string;
}

export enum operateTotalType {
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',
  IMG = 'img',
  SAVE = 'save',
  STYLE = 'style',
  EXECUTE = 'execute',
  UNDO = 'undo',
  DRAG = 'drag'
}

export interface operateOption {
  icon: string,
  disabled: boolean,
  type: operateType,
  desc: string
}

export enum imgType {
  add = 1,
  delete = 0
}

export const operateList: operateOption[] = reactive([
  {
    icon: operateIcons[operateType.addTopic],
    disabled: true,
    type: operateType.addTopic,
    desc: '添加同级节点'
  },
  {
    icon: operateIcons[operateType.addSubTopic],
    disabled: true,
    type: operateType.addSubTopic,
    desc: '添加子级节点'
  },
  {
    icon: operateIcons[operateType.editTopic],
    disabled: true,
    type: operateType.editTopic,
    desc: '编辑文本'
  },
  {
    icon: operateIcons[operateType.operateImg],
    disabled: true,
    type: operateType.operateImg,
    desc: '添加图片'
  },
  {
    icon: operateIcons[operateType.delTopic],
    disabled: true,
    type: operateType.delTopic,
    desc: '删除节点'
  },
  {
    icon: operateIcons[operateType.saveData],
    disabled: false,
    type: operateType.saveData,
    desc: '保存数据'
  },
  {
    icon: snapshotIcon[0],
    disabled: true,
    type: operateType.undo,
    desc: '撤回'
  },
  {
    icon: snapshotIcon[1],
    disabled: true,
    type: operateType.execute,
    desc: '恢复'
  }
])

export const lineList: lineOption[] = reactive([
  {
    value: LINE_TYPES.DEFAULT,
    icon: conLineType[LINE_TYPES.DEFAULT],
    checked: true,
    desc: '默认样式'
  },
  {
    value: LINE_TYPES.BROKEN,
    icon: conLineType[LINE_TYPES.BROKEN],
    checked: false,
    desc: '折线样式'
  },
  {
    value: LINE_TYPES.BROKEN_RADIU,
    icon: conLineType[LINE_TYPES.BROKEN_RADIU],
    checked: false,
    desc: '圆角折线样式'
  },
  {
    value: LINE_TYPES.BROKEN_BIAS,
    icon: conLineType[LINE_TYPES.BROKEN_BIAS],
    checked: false,
    desc: '斜线样式'
  }
])