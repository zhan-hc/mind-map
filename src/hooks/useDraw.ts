import { onMounted, reactive, toRefs } from 'vue'
import DrawGenerator from "../common/draw/drawGenerator"
import { DrawRender } from "../common/draw/drawRender"
import { Paper } from "../common/paper"
import Position from "../common/position"
import Tree from "../common/tree"
import { flatNodes } from "../constant"
import type { RaphaelPaper } from 'raphael';

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
    // 对节点重新计算位置
    position.getNodePosition(flatNodes[0])
    // 重新更改tree数据
    data.tree?.convertToTree(flatNodes)
    data.paper?.clear()
    const lineList = flatNodes.map(item => item.line)
    data.drawRender?.drawTopicLine(lineList as string[])
    data.tree && data.drawRender?.drawTopic(data.tree.treeNodes, newNodeId)
  }

  onMounted(() => {
    initPaper()
  })

  return {
    ...toRefs(data),
    reDraw
  }
}