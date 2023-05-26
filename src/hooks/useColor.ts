import { NodeInfo } from '../common/node/helper'
import { lineColor } from '../constant/attr'
export default function () {

  function changeColor ({color, colorKey, level}: {color: string, colorKey:string, level: string}, cb: any) {
    NodeInfo[level][colorKey] = color
    cb()
  }

  function changeLine (color: string, cb: any) {
    lineColor.value = color
    cb()
  }

  return {
    changeLine,
    changeColor
  }
}