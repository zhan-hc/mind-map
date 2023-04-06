export enum operateType {
  addTopic = 0,
  addSubTopic,
  editTopic,
  delTopic
}

export interface operateOption {
  icon: string,
  disabled: boolean,
  type: operateType
}