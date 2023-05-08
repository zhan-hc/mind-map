import { onMounted, reactive, Ref, toRefs } from 'vue'
import DrawGenerator from "../common/draw/drawGenerator"
import { DrawRender } from "../common/draw/drawRender"
import { Paper } from "../common/paper"
import Position from "../common/position"
import Tree from "../common/tree/tree"
import { DRAW_CALLBACK_TYPE, ExtraOption } from '../common/draw/type'
import Node, { getInitData } from '../common/node/node'

interface dataOption {
  tree:  Tree | null,
  paper: Paper | null,
  drawGenerator: DrawGenerator | null,
  drawRender: DrawRender | null
}
export default function () {
  const data: dataOption = reactive({
    tree:  null,
    paper:  null,
    drawGenerator: null,
    drawRender: null
  })
  function initPaper (options?: ExtraOption) {
    data.tree = new Tree({data: getInitData()});
    data.paper = new Paper('#paper');
    data.drawGenerator = new DrawGenerator(data.paper.getPaper());
    data.drawRender = new DrawRender(data.paper, options);
    reDraw();
  }

  function reDraw (newNodeId = '', cb?: any) {
    const position = new Position()
    const rootTree = (data.tree as Tree).getRoot()
    // 对节点重新计算位置
    position.getNodePosition(rootTree)
    data.paper?.clear()
    // 展开按钮的回调
    const callbackObj = {
      [DRAW_CALLBACK_TYPE.EXPAND]: function () {
        reDraw()
      },
      [DRAW_CALLBACK_TYPE.DRAG]: function () {
        reDraw()
      },
      ...cb
    }
    data.tree && data.drawRender?.drawTopic(rootTree, newNodeId, callbackObj)
  }


  return {
    ...toRefs(data),
    initPaper,
    reDraw
  }
}