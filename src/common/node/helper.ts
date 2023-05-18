export enum NodeTypeId {
  root = '1'
}
export const NodeInfo: any = {
  first: {
    fontSize: 20,
    fontColor: '#ffffff',
    fillColor: '#3f89de',
    textPadding: 18,
    attr: {
      width: 120,
      height: 60
    }
  },
  second: {
    fontSize: 16,
    fontColor: '#000000',
    fillColor: '#f5f5f5',
    textPadding: 16,
    attr: {
      width: 100,
      height: 50
    }
  },
  others: {
    fontSize: 14,
    fontColor: '#000000',
    fillColor: 'transparent',
    textPadding: 12,
    attr: {
      width: 80,
      height: 40
    }
  }
}
export enum NodeLevel {
  first = 'first',
  second = 'second',
  others = 'others'
}