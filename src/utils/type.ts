export enum operateType {
  addTopic = 0,
  addSubTopic,
  editTopic,
  addImage,
  delTopic
}

export enum operateTotalType {
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',
  IMG = 'img'
}

export interface operateOption {
  icon: string,
  disabled: boolean,
  type: operateType
}