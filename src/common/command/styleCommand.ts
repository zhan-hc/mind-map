import { LINE_COLOR, LINE_TYPE } from "../../constant/attr";
import { lineList, operateTotalType, styleType } from "../../constant/operate";
import { changeLineType } from "../../utils/common";
import { NodeInfo } from "../node/helper";
import { Command } from "./type";

export default class StyleCommand implements Command{
  public type: string;
  public lastVal: number | string;
  constructor(public styleInfo: { value: number|string, type: number, key: string}) {
    this.type = operateTotalType.STYLE
    this.lastVal = styleInfo.value
  }

  execute() {
    let lastVal:number | string = 0
    if (this.styleInfo.type === styleType.line) {
      lastVal = lineList.find(item => item.checked)?.value as number
      changeLineType(lineList, this.styleInfo.value as number)
      LINE_TYPE.value = this.styleInfo.value as number
    } else if (this.styleInfo.type === styleType.lineColor) {
      lastVal = LINE_COLOR.value
      LINE_COLOR.value = this.styleInfo.value  as string
    } else {
      lastVal = NodeInfo[this.styleInfo.type][this.styleInfo.key]
      NodeInfo[this.styleInfo.type][this.styleInfo.key] = this.styleInfo.value
    }
    this.lastVal = lastVal
  }

  undo () {
    if (this.styleInfo.type === styleType.line) {
      changeLineType(lineList, this.lastVal as number)
      LINE_TYPE.value = this.lastVal as number
    } else if (this.styleInfo.type === styleType.lineColor) {
      LINE_COLOR.value = this.lastVal as string
    } else {
      NodeInfo[this.styleInfo.type][this.styleInfo.key] = this.lastVal
    }
  }
}