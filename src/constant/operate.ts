import { operateIcons } from '../utils/unocss-icon'
import { reactive } from 'vue'

export enum operateType {
  addTopic = 0,
  addSubTopic,
  editTopic,
  addImage,
  delTopic,
  saveData
}

export enum operateTotalType {
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',
  IMG = 'img',
  SAVE = 'save'
}

export interface operateOption {
  icon: string,
  disabled: boolean,
  type: operateType,
  desc: string
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
    icon: operateIcons[operateType.addImage],
    disabled: true,
    type: operateType.addImage,
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
  }
])