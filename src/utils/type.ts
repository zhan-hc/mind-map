export enum operateType {
  addTopic = 0,
  addSubTopic,
  editTopic,
  delTopic
}

export enum operateTotalType {
  ADD,
  EDIT,
  DELETE
}

export interface operateOption {
  icon: string,
  disabled: boolean,
  type: operateType
}