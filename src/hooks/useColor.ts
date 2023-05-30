import { NodeInfo } from '../common/node/helper'
import { LINE_COLOR } from '../constant/attr'
export default function () {

  function changeColor ({color, colorKey, level}: {color: string, colorKey:string, level: string}, cb: any) {
    NodeInfo[level][colorKey] = color
    cb()
  }

  function changeLine (color: string, cb: any) {
    LINE_COLOR.value = color
    cb()
  }

  return {
    changeLine,
    changeColor
  }
}