<script setup lang="ts">
import type { RaphaelPaper } from 'raphael';
import { createNode, NodeOptions } from './common/node'
import { flatNodes, textPadding } from './constant/'
import { Tree, TreeOption } from './common/tree'
import { Paper } from './common/paper';
import { operateType } from './utils/type'
import { onMounted } from 'vue';
import operate from './components/operate.vue'
import Position from './common/position';
import { iconList } from './constant'
import { getNodeInfo, getTextWidth } from './utils/common';
import { NodeInfo } from './common/node/helper';
import DrawGenerator from './common/draw/drawGenerator';
import { DrawRender } from './common/draw/drawRender';

  let tree: Tree | null = null
  let paper: Paper | null = null
  let drawGenerator: DrawGenerator | null = null
  let drawRender: DrawRender | null = null

  function initPaper () {
    tree = new Tree(flatNodes)
    paper = new Paper('#paper')
    drawGenerator = new DrawGenerator(paper.getPaper())
    drawRender = new DrawRender(paper)
    reDraw()
  }

  function reDraw (newNodeId = '') {
    const position = new Position(drawGenerator as DrawGenerator)
    // 对节点重新计算位置
    position.getNodePosition(flatNodes[0])
    // 重新更改tree数据
    tree?.convertToTree(flatNodes)
    paper?.clear()
    const lineList = flatNodes.map(item => item.line) as string[]
    drawRender?.drawTopicLine(lineList)
    tree && drawRender?.drawTopic(tree.treeNodes, newNodeId)
  }

  function handleOperate (type: operateType) {
    if ([operateType.addTopic, operateType.addSubTopic].includes(type)) {
      const newNode = createNode(drawRender?.checkNode as TreeOption, type)
      flatNodes.push(newNode)
      // 重新对当前节点的sort属性排序
      tree?.sortNodes(newNode, type)
      // 重绘
      reDraw(newNode.id)
    } else if (type === operateType.editTopic) {
      const curNodeDom = document.querySelector('.node-edit-wrap');
      const NodeTextDom = document.querySelector('.node-text');
      (curNodeDom as HTMLElement).style.top = `${(drawRender?.checkNode as TreeOption).y * 1 + 15}px`;
      (curNodeDom as HTMLElement).style.left = `${(drawRender?.checkNode as TreeOption).x * 1 + 15}px`;
      (curNodeDom as HTMLElement).style.height = getNodeInfo(NodeInfo.fontSize, drawRender?.checkNode as TreeOption);
      (curNodeDom as HTMLElement).style.display = 'block';
      (NodeTextDom as HTMLElement).innerText = (drawRender?.checkNode as TreeOption).text;
      (NodeTextDom as HTMLElement).focus()
    }
  }

  function addEditToBlur () {
    const curNodeDom = document.querySelector('.node-edit-wrap')
    const NodeTextDom = document.querySelector('.node-text');
    (NodeTextDom as HTMLElement).addEventListener('blur',function(e){
      const target = e.target as HTMLElement
      (curNodeDom as HTMLElement).style.display = 'none';
      const editNode = flatNodes.find(item => item.id === (drawRender?.checkNode as TreeOption).id);
      (editNode as NodeOptions).width = getTextWidth((drawRender?.checkNode as TreeOption), target.innerText) + textPadding * 2;
      (editNode as NodeOptions).text = target.innerText
      console.log(flatNodes, 'flatNodesflatNodes')
      reDraw()
    })
  }

  onMounted(() => {
    initPaper()
    addEditToBlur()
  })


</script>

<template>
  <operate @operate="handleOperate" :iconList="iconList"/>
  <div id="paper" style="width:100vw;height:100vh;">
    <div class="node-edit-wrap">
      <div class="node-text" contenteditable="true">zzzzzz</div>
    </div>
  </div>
</template>

<style scoped>
.node-edit-wrap {
  display: none;
  position: absolute;
  top: 1500px;
  left: 100px;
  max-width: 200px;
  background-color: #fff;
}
.node-text {
  padding: 5px 10px;
  font-size: 16px;
  background-color: #fff;
  /* width: 200px;
  height: 100px; */
}
</style>
