export enum operateType {
  addTopic = 0,
  addSubTopic,
  editTopic,
  delTopic
}

export enum operateTotalType {
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete'
}

export interface operateOption {
  icon: string,
  disabled: boolean,
  type: operateType
}