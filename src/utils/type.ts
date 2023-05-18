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
  type: operateType
}