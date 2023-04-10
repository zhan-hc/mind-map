export enum operateType {
  addTopic = 0,
  addSubTopic,
  editTopic,
  delTopic
}

export enum operateTotalType {
  add,
  edit,
  del
}

export interface operateOption {
  icon: string,
  disabled: boolean,
  type: operateType
}