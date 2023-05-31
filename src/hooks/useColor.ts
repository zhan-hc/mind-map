import { NodeInfo } from '../common/node/helper'
import { LINE_COLOR } from '../constant/attr'
export default function () {


  function changeLine (color: string, cb: any) {
    LINE_COLOR.value = color
    cb()
  }

  return {
    changeLine
  }
}