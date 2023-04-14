import { onMounted, reactive, toRefs } from 'vue'
import DrawGenerator from "../common/draw/drawGenerator"
import { DrawRender } from "../common/draw/drawRender"
import { Paper } from "../common/paper"
import Position from "../common/position"
import Tree, { TreeOption } from "../common/tree"
import { flatNodes } from "../constant"
import { changeNodeExpand } from '../utils/nodeUtils'
import { DRAW_CALLBACK_TYPE } from '../common/draw/type'

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
  function initPaper () {
    data.tree = new Tree(flatNodes);
    data.paper = new Paper('#paper');
    data.drawGenerator = new DrawGenerator(data.paper.getPaper());
    data.drawRender = new DrawRender(data.paper);
    reDraw();
  }

  function reDraw (newNodeId = '') {
    const position = new Position(data.drawGenerator as DrawGenerator)
    // 重新更改tree数据
    data.tree?.arrayToTree(flatNodes)
    const treeNodes = (data?.tree?.getTreeNodes()[0]) as TreeOption
    // 对节点重新计算位置
    position.getNodePosition(treeNodes)
    data.paper?.clear()
    // 展开按钮的回调
    const callbackObj = {
      [DRAW_CALLBACK_TYPE.EXPAND]: function (node: TreeOption) {
        changeNodeExpand(flatNodes, node.id)
        reDraw()
      }
    }
    data.tree && data.drawRender?.drawTopic(data.tree.treeNodes, newNodeId, callbackObj)
  }

  onMounted(() => {
    initPaper()
  })

  return {
    ...toRefs(data),
    reDraw
  }
}